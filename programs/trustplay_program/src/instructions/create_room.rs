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

    /// CHECK: it is safe.
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

impl<'info> CreateRoom<'info>{

    pub fn create_room(&mut self,room_id : String,name : String,total_pool : u64,deadline : i64, vote_threshold : u8)-> Result<()>{

        self.room.set_inner(Room { 
            organizer: self.organizer.key(), 
            room_id: room_id, 
            name: name, 
            vault: self.vault.key(), 
            total_pool: total_pool, 
            status: crate::RoomStatus::Open, 
            created_at: Clock::get()?.unix_timestamp, 
            deadline_ts: deadline, 
            vote_threshold: vote_threshold, 
            bump: self.room.bump 
        });
        Ok(())
    }
}