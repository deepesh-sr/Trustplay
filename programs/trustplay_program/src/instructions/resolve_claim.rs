use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct ResolveClaim<'info> {
    #[account(mut, seeds = [b"room", room.organizer.as_ref(), room.room_id.as_bytes()], bump = room.bump)]
    pub room: Account<'info, Room>,

    #[account(mut, seeds = [b"vault", room.key().as_ref()], bump)]
    pub vault: SystemAccount<'info>,

    #[account(mut, seeds = [b"claim", room.key().as_ref(), claimant.key.as_ref(), claim.claim_id.as_bytes()], bump = claim.bump)]
    pub claim: Account<'info, Claim>,

    /// claimant to receive funds
    #[account(mut)]
    pub claimant: AccountInfo<'info>,

    /// reputation PDA for claimant (init if needed)
    #[account(mut, seeds = [b"rep", claimant.key.as_ref()], bump)]
    pub reputation: Account<'info, Reputation>,

    /// participants_count is a trivial loader storing the current number of participants
    /// For simplicity we use an AccountLoader<u64> to store the count on-chain (could be improved)
    // pub participants_count: AccountLoader<'info, u64>,

    pub system_program: Program<'info, System>,
}
