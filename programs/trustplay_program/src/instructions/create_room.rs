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

    #[account(mut)]
    pub organizer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateRoom<'info>{

    pub fn create_room(&mut self,room_id : String,name : String,total_pool : u64,deadline : i64, vote_threshold : u8)-> Result<()>{

        // Derive the vault PDA address
        let (vault_pda, _vault_bump) = Pubkey::find_program_address(
            &[b"vault", self.room.key().as_ref()],
            &crate::ID
        );

        self.room.set_inner(Room { 
            organizer: self.organizer.key(), 
            room_id: room_id, 
            name: name, 
            vault: vault_pda, 
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