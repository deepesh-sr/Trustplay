use anchor_lang::prelude::*;

pub mod constants;
pub mod instructions;
pub mod state;
pub mod error;

pub use constants::*;
pub use instructions::*;
pub use state::*;
pub use error::ErrorCode;

declare_id!("5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe");

#[program]
pub mod trustplay_program {
    use super::*;

    /// Create a new gaming room with prize pool
    pub fn create_room(
        ctx: Context<CreateRoom>,
        room_id: String,
        name: String,
        total_pool: u64,
        deadline: i64,
        vote_threshold: u8,
    ) -> Result<()> {
        ctx.accounts.create_room(room_id, name, total_pool, deadline, vote_threshold)
    }

    /// Join an existing room as a participant
    pub fn join_room(ctx: Context<JoinRoom>) -> Result<()> {
        ctx.accounts.join_room()
    }

    /// Deposit SOL to the room's vault
    pub fn deposit_to_vault(ctx: Context<DepositToVault>, amount: u64) -> Result<()> {
        ctx.accounts.deposit_to_vault(amount)
    }

    /// Submit a claim for achievements in a room
    pub fn submit_claim(ctx: Context<SubmitClaim>, claim_id: String) -> Result<()> {
        ctx.accounts.submit_claim(claim_id)
    }

    /// Vote on a claim (accept or reject)
    pub fn vote_claim(ctx: Context<VoteClaim>, accept: bool) -> Result<()> {
        ctx.accounts.vote_claim(accept)
    }

    /// Resolve a claim and distribute rewards if approved
    pub fn resolve_claim(ctx: Context<ResolveClaim>) -> Result<()> {
        ctx.accounts.resolve_claim()
    }

    /// Initialize the whitelist account
    pub fn initialize_whitelist(ctx: Context<InitializeWhitelist>) -> Result<()> {
        ctx.accounts.initialize()
    }

    /// Add an address to the whitelist
    pub fn add_to_whitelist(ctx: Context<WhitelistOperations>, address: Pubkey) -> Result<()> {
        ctx.accounts.add_to_whitelist(address)
    }

    /// Remove an address from the whitelist
    pub fn remove_from_whitelist(ctx: Context<WhitelistOperations>, address: Pubkey) -> Result<()> {
        ctx.accounts.remove_from_whitelist(address)
    }
}
