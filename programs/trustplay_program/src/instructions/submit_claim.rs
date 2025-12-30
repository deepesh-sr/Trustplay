use anchor_lang::prelude::*;

use crate::{Claim, Room};

#[derive(Accounts)]
#[instruction(claim_id: String)]
pub struct SubmitClaim<'info> {
    #[account(mut)]
    pub room: Account<'info, Room>,

    #[account(
        init, 
        payer = claimant, 
        space = 8 + Claim::INIT_SPACE, 
        seeds = [b"claim", room.key().as_ref(), claimant.key().as_ref(), claim_id.as_bytes()], 
        bump
    )]
    pub claim: Account<'info, Claim>,

    #[account(mut)]
    pub claimant: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> SubmitClaim<'info> {
    pub fn submit_claim(&mut self, claim_id: String) -> Result<()> {
        self.claim.set_inner(Claim { 
            claimant: self.claimant.key(), 
            claim_id, 
            votes_for: 0, 
            votes_against: 0, 
            resolved: false, 
            created_at: Clock::get()?.unix_timestamp, 
            resolved_at: None, 
            bump: self.claim.bump 
        });
        Ok(())
    }
}