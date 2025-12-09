use anchor_lang::prelude::*;

#[account]
pub struct Whitelist{
    pub addresses : Vec<Pubkey>,
    pub bump : u8
}

impl Whitelist {
    pub fn set_voters(&mut self, address : Pubkey)-> Result<()>{
        self.addresses.push(address);
        Ok(())
    }
}