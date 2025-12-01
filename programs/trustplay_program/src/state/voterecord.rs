use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct VoterRecord {
    pub claim: Pubkey,
    pub voter: Pubkey,
    pub bump: u8,
}