use anchor_lang::prelude::*;

use crate::RoomStatus;

/// Room account
#[account]
pub struct Room {
    pub organizer: Pubkey,
    pub room_id: String,
    pub name: String,
    pub vault: Pubkey,
    pub total_pool: u64,
    pub status: RoomStatus,
    pub created_at: i64,
    pub deadline_ts: i64,
    pub vote_threshold: u8,
    pub bump: u8,
}

impl Room {
    pub const LEN: usize = 8 + 32 + 4 + 64 + 4 + 64 + 32 + 8 + 1 + 8 + 8 + 1 + 1;
}