use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};

use crate::{Claim, Reputation, Room, RoomStatus, error::ErrorCode};

#[derive(Accounts)]
pub struct ResolveClaim<'info> {
    #[account(mut)]
    pub room: Account<'info, Room>,

    /// CHECK: vault is a PDA
    #[account(mut)]
    pub vault: UncheckedAccount<'info>,

    #[account(mut)]
    pub claim: Account<'info, Claim>,

    /// claimant to receive fund
    #[account(mut)]
    pub claimant: Signer<'info>,

    /// reputation PDA for claimant (init if needed)
    #[account(
        init_if_needed,
        payer = claimant,
        space = 8 + Reputation::INIT_SPACE,
        seeds = [b"rep", claimant.key().as_ref()],
        bump
    )]
    pub reputation: Account<'info, Reputation>,

    pub system_program: Program<'info, System>,
}

impl <'info> ResolveClaim<'info> {
      /// Resolve claim: if votes_for threshold satisfied, transfer vault -> claimant and update reputation.
    pub fn resolve_claim(&mut self) -> Result<()> {

        require!(!self.claim.resolved, ErrorCode::AlreadyResolved);


        // total voters considered = participants_count (we'll use participants_count passed in)
        // let participants_count = self.participants_count.load()?;
        // require!(participants_count > 0, ErrorCode::NoParticipants);

        // compute percent
        let total_votes = self.claim
            .votes_for
            .checked_add(self.claim.votes_against)
            .ok_or(ErrorCode::NumericalOverflow)?;
        require!(total_votes > 0, ErrorCode::NoVotes);

        // threshold logic: accept if votes_for * 100 >= vote_threshold * total_votes
        let accept = (self.claim.votes_for as u128)
            .checked_mul(100)
            .unwrap()
            >= (self.room.vote_threshold as u128).checked_mul(total_votes as u128).unwrap();

        if accept {
            // transfer all lamports from vault to claimant
            let vault_lamports = self.vault.to_account_info().lamports()
                .checked_sub(Rent::get()?.minimum_balance(self.vault.data_len()))
                .unwrap();

            require!(vault_lamports > 0, ErrorCode::InsufficientFunds);

            // Derive the vault bump
            let (vault_pda, vault_bump) = Pubkey::find_program_address(
                &[b"vault".as_ref(), self.room.key().as_ref()],
                &crate::ID
            );
            
            // Verify the vault account matches
            require_keys_eq!(
                vault_pda,
                self.vault.key(),
                ErrorCode::InvalidVaultAccount
            );

            // Build transfer ix from vault PDA -> claimant
            transfer(
                CpiContext::new_with_signer(
                    self.system_program.to_account_info(),
                    Transfer {
                        from: self.vault.to_account_info(),
                        to: self.claimant.to_account_info()
                    },
                    &[&[
                        b"vault".as_ref(),
                        self.room.key().as_ref(),
                        &[vault_bump],
                    ]]
                ),
                vault_lamports
            )?;
            
            //update reputation pda
            if !self.reputation.initialized {
                self.reputation.player = self.claimant.key();
                self.reputation.score = 0;
                self.reputation.wins = 0;
                self.reputation.initialized = true;
                self.reputation.bump = self.reputation.bump;
            }
            self.reputation.wins = self.reputation.wins.checked_add(1).ok_or(ErrorCode::NumericalOverflow)?;
            self.reputation.score = self.reputation.score.checked_add(10).ok_or(ErrorCode::NumericalOverflow)?; // arbitrary scoring

            self.claim.resolved = true;
            self.claim.resolved_at = Some(Clock::get()?.unix_timestamp);

            // update room status
            let room_mut = &mut self.room;
            room_mut.status = RoomStatus::Resolved;
        } else {
            // reject - mark resolved (or leave for organizer to refund)
            self.claim.resolved = true;
            self.claim.resolved_at = Some(Clock::get()?.unix_timestamp);
            // do not transfer funds
        }

        Ok(())
    }
}