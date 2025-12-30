use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};

use crate::Room;

#[derive(Accounts)]
pub struct DepositToVault<'info> {
    #[account(mut)]
    pub room: Account<'info, Room>,

    /// vault PDA is the destination - must be initialized already
    /// CHECK: vault is a PDA, we just check it exists
    #[account(mut)]
    pub vault: UncheckedAccount<'info>,

    /// payer (must sign)
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

impl<'info> DepositToVault<'info> {
    pub fn deposit_to_vault(&self, deposit_money: u64) -> Result<()> {
        let min_rent = Rent::get()?.minimum_balance(0);
        let total_amount = min_rent.checked_add(deposit_money).unwrap();
        
        transfer(
            CpiContext::new(
                self.system_program.to_account_info(),
                Transfer {
                    from: self.payer.to_account_info(),
                    to: self.vault.to_account_info()
                }
            ), 
            total_amount
        )
    }
}