use anchor_lang::{
    prelude::*, 
    system_program
};

use crate::verfiedvoters::Whitelist;

/// Initialize the whitelist account
#[derive(Accounts)]
pub struct InitializeWhitelist<'info> {
    #[account(mut)]
    pub organizer: Signer<'info>,
    
    #[account(
        init,
        payer = organizer,
        space = 8 + 4 + 1, // discriminator + vec length + bump
        seeds = [b"whitelist"],
        bump,
    )]
    pub whitelist: Account<'info, Whitelist>,
    
    pub system_program: Program<'info, System>,
}

impl<'info> InitializeWhitelist<'info> {
    pub fn initialize(&mut self) -> Result<()> {
        self.whitelist.addresses = Vec::new();
        self.whitelist.bump = self.whitelist.bump;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct WhitelistOperations<'info> {
    #[account(
        mut,
        //address = 
    )]
    pub oraganizer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"whitelist"],
        bump,
    )]
    pub whitelist: Account<'info, Whitelist>,
    pub system_program: Program<'info, System>,
}

impl<'info> WhitelistOperations<'info> {
    pub fn add_to_whitelist(&mut self, address: Pubkey) -> Result<()> {
        if !self.whitelist.addresses.contains(&address) {
            self.realloc_whitelist(true)?;
            self.whitelist.addresses.push(address);
        }
        Ok(())
    }

    pub fn remove_from_whitelist(&mut self, address: Pubkey) -> Result<()> {
        if let Some(pos) = self.whitelist.addresses.iter().position(|&x| x == address) {
            self.whitelist.addresses.remove(pos);
            self.realloc_whitelist(false)?;
        }
        Ok(())
    }

    pub fn realloc_whitelist(&self, is_adding: bool) -> Result<()> {
        // Get the account info for the whitelist
        let account_info = self.whitelist.to_account_info();

        if is_adding {  // Adding to whitelist
            let new_account_size = account_info.data_len() + std::mem::size_of::<Pubkey>();
            // Calculate rent required for the new account size
            let lamports_required = (Rent::get()?).minimum_balance(new_account_size);
            // Determine additional rent required
            let rent_diff = lamports_required - account_info.lamports();

            // Perform transfer of additional rent
            let cpi_program = self.system_program.to_account_info();
            let cpi_accounts = system_program::Transfer{
                from: self.oraganizer.to_account_info(), 
                to: account_info.clone(),
            };
            let cpi_context = CpiContext::new(cpi_program, cpi_accounts);
            system_program::transfer(cpi_context,rent_diff)?;

            // Reallocate the account
            account_info.resize(new_account_size)?;
            msg!("Account Size Updated: {}", account_info.data_len());

        } else {        // Removing from whitelist
            let new_account_size = account_info.data_len() - std::mem::size_of::<Pubkey>();
            // Calculate rent required for the new account size
            let lamports_required = (Rent::get()?).minimum_balance(new_account_size);
            // Determine additional rent to be refunded
            let rent_diff = account_info.lamports() - lamports_required;

            // Reallocate the account
            account_info.resize(new_account_size)?;
            msg!("Account Size Downgraded: {}", account_info.data_len());

            // Perform transfer to refund additional rent
            **self.oraganizer.to_account_info().try_borrow_mut_lamports()? += rent_diff;
            **self.whitelist.to_account_info().try_borrow_mut_lamports()? -= rent_diff;
        }

        Ok(())
    }
}