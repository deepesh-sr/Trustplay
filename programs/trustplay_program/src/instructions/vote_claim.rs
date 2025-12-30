use anchor_lang::prelude::*;

use crate::{Claim, Room, VoterRecord, Whitelist};
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct VoteClaim<'info> {
    #[account(mut)]
    pub room: Account<'info, Room>,

    #[account(mut)]
    pub claim: Account<'info, Claim>,

    /// Voter signer
    #[account(mut)]
    pub voter: Signer<'info>,
    
    /// CHECK: it's safe
    #[account(mut)]
    pub claimant: UncheckedAccount<'info>,

    /// Whitelist 
    #[account(
        seeds = [b"whitelist"],
        bump,
    )]
    pub whitelist: Account<'info, Whitelist>,

    /// a voter_record to prevent double votes
    #[account(
        init, 
        payer = voter, 
        space = 8 + VoterRecord::INIT_SPACE, 
        seeds = [b"voter", claim.key().as_ref(), voter.key().as_ref()], 
        bump
    )]
    pub voter_record: Account<'info, VoterRecord>,

    pub system_program: Program<'info, System>,
}

impl<'info> VoteClaim<'info> {
    pub fn vote_claim(&mut self, accept: bool) -> Result<()> {
        let claim = &mut self.claim;
        
        // Ensure voter is whitelisted
        if !self.whitelist.addresses.contains(&self.voter.key()) {
            return Err(ErrorCode::VoterNotWhitelisted.into());
        }
        
        // Record the vote to prevent double voting
        self.voter_record.set_inner(VoterRecord { 
            claim: claim.key(), 
            voter: self.voter.key(), 
            bump: self.voter_record.bump
        });

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