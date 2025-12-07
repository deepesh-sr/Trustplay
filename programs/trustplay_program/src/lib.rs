pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe");

#[program]
pub mod trustplay_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        create_room::handler(ctx)
    }
}
