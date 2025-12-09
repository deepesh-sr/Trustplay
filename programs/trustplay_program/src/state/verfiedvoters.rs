use anchor_lang::prelude::*;

#[account]
pub struct Whitelist{
    pub addresses : Vec<Pubkey>,
    pub bump : u8
}
