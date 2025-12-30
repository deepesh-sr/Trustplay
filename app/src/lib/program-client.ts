import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";

export class ProgramClient<T extends Idl> {
  public program: Program<T>;
  public connection: Connection;

  constructor(connection: Connection, idl: any) {
    this.connection = connection;

    // Create a dummy provider for read-only operations
    const provider = new AnchorProvider(
      connection,
      {} as any,
      { commitment: "confirmed" }
    );

    const programId = new PublicKey(
      process.env.NEXT_PUBLIC_PROGRAM_ID as string
    );

    this.program = new Program<T>(idl as T, provider);
  }

  // Helper method to get PDAs
  getPda(seeds: (Buffer | Uint8Array)[]): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(seeds, this.program.programId);
  }
}
