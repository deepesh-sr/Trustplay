import { Connection, PublicKey } from "@solana/web3.js";
import { ProgramClient } from "./program-client";
import trustplayProgramIdl from "@/idl/trustplay_program.json";
import { TrustplayProgram, Room } from "@/types/trustplay-program";
import { BN } from "@coral-xyz/anchor";

export class TrustplayProgramClient extends ProgramClient<TrustplayProgram> {
  constructor(connection: Connection) {
    super(connection, trustplayProgramIdl);
  }

  // Get Room PDA
  getRoomPda(organizer: PublicKey, roomId: string): [PublicKey, number] {
    return this.getPda([
      Buffer.from("room"),
      organizer.toBuffer(),
      Buffer.from(roomId),
    ]);
  }

  // Get Vault PDA
  getVaultPda(room: PublicKey): [PublicKey, number] {
    return this.getPda([Buffer.from("vault"), room.toBuffer()]);
  }

  // Get Participant PDA
  getParticipantPda(room: PublicKey, player: PublicKey): [PublicKey, number] {
    return this.getPda([
      Buffer.from("participant"),
      room.toBuffer(),
      player.toBuffer(),
    ]);
  }

  // Get Claim PDA
  getClaimPda(
    room: PublicKey,
    claimant: PublicKey,
    claimId: string
  ): [PublicKey, number] {
    return this.getPda([
      Buffer.from("claim"),
      room.toBuffer(),
      claimant.toBuffer(),
      Buffer.from(claimId),
    ]);
  }

  // Fetch Room account
  async getRoom(roomPda: PublicKey): Promise<Room | null> {
    try {
      // @ts-ignore - IDL type mismatch
      const room = await this.program.account.room.fetch(roomPda);
      return room as any as Room;
    } catch (error) {
      console.error("Error fetching room:", error);
      return null;
    }
  }

  // Fetch all Rooms
  async getAllRooms(): Promise<Array<{ publicKey: PublicKey; account: Room }>> {
    try {
      // @ts-ignore - IDL type mismatch
      const rooms = await this.program.account.room.all();
      return rooms.map((r) => ({
        publicKey: r.publicKey,
        account: r.account as any as Room,
      }));
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return [];
    }
  }

  // Fetch Rooms by organizer
  async getRoomsByOrganizer(
    organizer: PublicKey
  ): Promise<Array<{ publicKey: PublicKey; account: Room }>> {
    try {
      // @ts-ignore - IDL type mismatch
      const rooms = await this.program.account.room.all([
        {
          memcmp: {
            offset: 8, // Discriminator
            bytes: organizer.toBase58(),
          },
        },
      ]);
      return rooms.map((r) => ({
        publicKey: r.publicKey,
        account: r.account as any as Room,
      }));
    } catch (error) {
      console.error("Error fetching rooms by organizer:", error);
      return [];
    }
  }

  // Helper to convert number to BN
  toBN(value: number | string): BN {
    return new BN(value);
  }
}
