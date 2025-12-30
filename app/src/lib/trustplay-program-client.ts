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

  // Get Whitelist PDA
  getWhitelistPda(): [PublicKey, number] {
    return this.getPda([Buffer.from("whitelist")]);
  }

  // Get Voter Record PDA
  getVoterRecordPda(claim: PublicKey, voter: PublicKey): [PublicKey, number] {
    return this.getPda([
      Buffer.from("voter"),
      claim.toBuffer(),
      voter.toBuffer(),
    ]);
  }

  // Get Reputation PDA
  getReputationPda(player: PublicKey): [PublicKey, number] {
    return this.getPda([Buffer.from("rep"), player.toBuffer()]);
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

  // Fetch Participant account
  async getParticipant(participantPda: PublicKey) {
    try {
      // @ts-ignore
      return await this.program.account.participant.fetch(participantPda);
    } catch (error) {
      console.error("Error fetching participant:", error);
      return null;
    }
  }

  // Fetch all Participants for a room
  async getParticipantsByRoom(room: PublicKey) {
    try {
      // @ts-ignore
      const participants = await this.program.account.participant.all([
        {
          memcmp: {
            offset: 8, // Discriminator
            bytes: room.toBase58(),
          },
        },
      ]);
      return participants;
    } catch (error) {
      console.error("Error fetching participants:", error);
      return [];
    }
  }

  // Fetch Claim account
  async getClaim(claimPda: PublicKey) {
    try {
      // @ts-ignore
      return await this.program.account.claim.fetch(claimPda);
    } catch (error) {
      console.error("Error fetching claim:", error);
      return null;
    }
  }

  // Fetch all Claims for a room
  async getClaimsByRoom(room: PublicKey) {
    try {
      // @ts-ignore
      const claims = await this.program.account.claim.all([
        {
          memcmp: {
            offset: 8, // Discriminator
            bytes: room.toBase58(),
          },
        },
      ]);
      return claims;
    } catch (error) {
      console.error("Error fetching claims:", error);
      return [];
    }
  }

  // Fetch Whitelist account
  async getWhitelist() {
    try {
      const [whitelistPda] = this.getWhitelistPda();
      // @ts-ignore
      return await this.program.account.whitelist.fetch(whitelistPda);
    } catch (error) {
      console.error("Error fetching whitelist:", error);
      return null;
    }
  }

  // Fetch Reputation account
  async getReputation(player: PublicKey) {
    try {
      const [reputationPda] = this.getReputationPda(player);
      // @ts-ignore
      return await this.program.account.reputation.fetch(reputationPda);
    } catch (error) {
      console.error("Error fetching reputation:", error);
      return null;
    }
  }

  // Helper to convert number to BN
  toBN(value: number | string): BN {
    return new BN(value);
  }
}
