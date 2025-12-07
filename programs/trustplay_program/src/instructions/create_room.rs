use anchor_lang::prelude::*;

use crate::Room;

#[derive(Accounts)]
#[instruction(room_id : String)]

pub struct CreateRoom<'info>{

    #[account(
        init, 
        payer = organizer, 
        space = Room::LEN, 
        seeds = [b"room", organizer.key.as_ref(), room_id.as_bytes()], 
        bump
    )]
    
    pub room: Account<'info, Room>,

    /// Vault is a system account PDA which will hold lamports.
    /// We create it here as a system account (create_account).
    #[account(
        init,
        payer = organizer,
        seeds = [b"vault", room.key().as_ref()],
        bump,
        space = 8 // zero data; it's a system account used for lamports
    )]
    pub vault: UncheckedAccount<'info>,

    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
