use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Number overflow")]
    NumericalOverflow,
    #[msg("Already Resolved")]
    AlreadyResolved,
    #[msg("No Votes")]
    NoVotes,
    #[msg("No Participant")]
    NoParticipants,
    #[msg("Insufficient Funds")]
    InsufficientFunds,
}
