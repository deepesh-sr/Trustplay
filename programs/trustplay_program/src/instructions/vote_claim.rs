use anchor_lang::prelude::*;

use crate::{VoterRecord, Whitelist};
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct VoteClaim<'info> {
    #[account(mut, seeds = [b"room", room.organizer.as_ref(), room.room_id.as_bytes()], bump = room.bump)]
    pub room: Account<'info, Room>,

    #[account(mut, seeds = [b"claim", room.key().as_ref(), claimant.key.as_ref(), claim.claim_id.as_bytes()], bump = claim.bump)]
    pub claim: Account<'info, Claim>,

    /// Voter signer
    #[account(mut)]
    pub voter: Signer<'info>,

    /// Whitelist 
    #[account(
        seeds = [b"whitelist"],
        bump = whitelist.bump,
    )]
    pub whitelist : Account<'info,Whitelist>,

    /// a voter_record to prevent double votes
    #[account(init, payer = voter, space = 8 + VoterRecord::INIT_SPACE, seeds = [b"voter", claim.key().as_ref(), voter.key().as_ref()], bump)]
    pub voter_record: Account<'info, VoterRecord>,

    pub system_program: Program<'info, System>,
}

impl<'info>  VoteClaim<'info> {
     pub fn vote_claim(&mut self, accept: bool) -> Result<()> {
        let claim = &mut ctx.accounts.claim;

        // ensure voter hasn't voted already (voter_record PDA)
        if !self.whitelist.addresses.contains(self.voter.key) {
            panic!("TransferHook: Voter is not whitelisted");
        };

        let voter_record = &mut self.voter_record;
        voter_record.claim = claim.key();
        voter_record.voter = self.voter.key();
        voter_record.bump = self.voter_record.bump;

        if accept {
            claim.votes_for = claim
                .votes_for
                .checked_add(1)
                .ok_or(ErrorCode::NumericalOverflow)?;
        } else {
            claim.votes_against = claim
                .votes_against
                .checked_add(1)
                .ok_or(ErrorCode::NumericalOverflow)?;
        }
        Ok(())
    }
}
