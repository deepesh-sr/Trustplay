use anchor_lang::prelude::*;

pub mod constants;
pub mod instructions;
pub mod state;
pub mod error;

pub use constants::*;
pub use instructions::CreateRoom;
pub use state::*;
pub use error::ErrorCode;

declare_id!("5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe");

#[program]
pub mod trustplay_program {
    use super::*;

    pub fn create_room(ctx: Context<CreateRoom>,room_id: String, name: String, total_pool: u64, deadline: i64, vote_threshold: u8 ) -> Result<()> {
        ctx.accounts.create_room(room_id,name,total_pool,deadline,vote_threshold)
    }
}
