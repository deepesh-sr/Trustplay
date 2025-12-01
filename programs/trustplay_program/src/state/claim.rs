use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Claim {
    pub claimant: Pubkey,
    #[max_len(50)]
    pub claim_id: String,
    #[max_len(50)]
    pub proof_hash: String,
    pub votes_for: u64,
    pub votes_against: u64,
    pub resolved: bool,
    pub created_at: i64,
    pub resolved_at: Option<i64>,
    pub bump: u8,
}