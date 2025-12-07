use anchor_lang::prelude::*;

/// Participant account
#[account]
#[derive(InitSpace)]
pub struct Participant {
    pub player: Pubkey,
    pub joined_at: i64,
    pub bump: u8,
}