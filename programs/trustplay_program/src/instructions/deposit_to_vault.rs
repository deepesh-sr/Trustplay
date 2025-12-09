use anchor_lang::{prelude::*, system_program::{Transfer, transfer}};

use crate::Room;

#[derive(Accounts)]
pub struct DepositToVault<'info> {
    #[account(mut, seeds = [b"room", room.organizer.as_ref(), room.room_id.as_bytes()], bump = room.bump)]
    pub room: Account<'info, Room>,

    /// vault PDA is the destination system account
    #[account(mut, seeds = [b"vault", room.key().as_ref()], bump)]
    pub vault: SystemAccount<'info>,

    /// payer (must sign)
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl <'info> DepositToVault<'info>{
    pub fn deposit_to_vault(&self, deposit_money : u64)->Result<()>{

        let min_rent = Rent::get()?.minimum_balance(0);
        let total_amount = min_rent + deposit_money;
        transfer(CpiContext::new(
            self.system_program.to_account_info(),
            Transfer{
                from : self.payer.to_account_info(),
                to : self.vault.to_account_info()
            }
         ), total_amount) 
    }
}