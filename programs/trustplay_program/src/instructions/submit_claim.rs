use anchor_lang::prelude::*;

use crate::Claim;

#[derive(Accounts)]
#[instruction(claim_id: String)]
pub struct SubmitClaim<'info> {
    #[account(
        mut, 
        seeds = [b"room", room.organizer.as_ref(), room.room_id.as_bytes()], 
        bump = room.bump
    )]
    pub room: Account<'info, Room>,

    #[account(init, payer = claimant, space = 8 + Claim::INIT_SPACE , seeds = [b"claim", room.key().as_ref(), claimant.key.as_ref(), claim_id.as_bytes()], bump)]
    pub claim: Account<'info, Claim>,

    #[account(mut)]
    pub claimant: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl <'info> SubmitClaim<'info>{

    pub fn submit_claim(&mut self, claim_id: String)-> Result<()>{
         let claim = &mut self.claim;
        claim.claimant = claimant.key();
        claim.claim_id = claim_id;
        // claim.proof_hash = proof_hash;
        claim.votes_for = 0;
        claim.votes_against = 0;
        claim.resolved = false;
        claim.created_at = Clock::get()?.unix_timestamp;
        claim.bump = self.claim.bump ;
        Ok(())
    }
}