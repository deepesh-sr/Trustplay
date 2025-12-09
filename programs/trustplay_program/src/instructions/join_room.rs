use anchor_lang::prelude::*;

use crate::{Participant, Room};

#[derive(Accounts)]
pub struct JoinRoom<'info> {
    #[account(mut, seeds = [b"room", room.organizer.as_ref(), room.room_id.as_bytes()], bump = room.bump)]
    pub room: Account<'info, Room>,

    #[account(
        init, 
        payer = player, 
        space =8 + Participant::INIT_SPACE, 
        seeds = [b"participant", room.key().as_ref(), player.key.as_ref()], bump)]
    pub participant: Account<'info, Participant>,

    #[account(mut)]
    pub player: Signer<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> JoinRoom<'info> {
    pub fn join_room( &mut self )-> Result<()>{
    self.participant.set_inner(Participant { player: self.player.key(), joined_at: Clock::get()?.unix_timestamp, bump: self.participant.bump });
    Ok(())
    }
}