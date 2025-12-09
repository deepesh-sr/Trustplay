use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};

use crate::{Claim, Reputation, Room, RoomStatus, error::ErrorCode};

#[derive(Accounts)]
pub struct ResolveClaim<'info> {
    #[account(mut, seeds = [b"room", room.organizer.as_ref(), room.room_id.as_bytes()], bump = room.bump)]
    pub room: Account<'info, Room>,

    #[account(mut, seeds = [b"vault", room.key().as_ref()], bump)]
    pub vault: SystemAccount<'info>,

    #[account(mut, seeds = [b"claim", room.key().as_ref(), claimant.key.as_ref(), claim.claim_id.as_bytes()], bump = claim.bump)]
    pub claim: Account<'info, Claim>,

    /// claimant to receive funds
    #[account(mut)]
    pub claimant: AccountInfo<'info>,

    /// reputation PDA for claimant (init if needed)
    #[account(mut, seeds = [b"rep", claimant.key.as_ref()], bump)]
    pub reputation: Account<'info, Reputation>,

    /// participants_count is a trivial loader storing the current number of participants
    /// For simplicity we use an AccountLoader<u64> to store the count on-chain (could be improved)
    // pub participants_count: AccountLoader<'info, u64>,

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
            let vault_lamports = self.vault.to_account_info().lamports().checked_sub(Rent::get()?.minimum_balance(self.vault.data_len())).unwrap();

            require!(vault_lamports > 0, ErrorCode::InsufficientFunds);

            // Build transfer ix from vault PDA -> claimant
            // The vault PDA is owned by system program (it is a SystemAccount). To move lamports we need to sign with PDA.
            // b"vault".as_ref(),
            // room.key().as_ref(),
            // &[room.bump],
        
            
            transfer(CpiContext::new_with_signer(self.system_program.to_account_info(), Transfer{
                from : self.vault.to_account_info(),
                to : self.claimant.to_account_info()
            }, &[&[
                b"vault".as_ref(),
                self.room.key().as_ref(),
                &[self.room.bump],
            ]]), vault_lamports)?;
            
            //update reputatio pda
            self.reputation.set_inner(Reputation { player: self.claimant.key(), score: 0, wins: 0, initialized: true, bump : self.reputation.bump });
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