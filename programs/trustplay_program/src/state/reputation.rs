use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Reputation {
    pub player: Pubkey,
    pub score: u64,
    pub wins: u32,
    pub initialized: bool,
    pub bump: u8,
}