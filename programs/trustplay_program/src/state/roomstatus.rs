use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum RoomStatus {
    Open,
    InProgress,
    Resolved,
    Cancelled,
}