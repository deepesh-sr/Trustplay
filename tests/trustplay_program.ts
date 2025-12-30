import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { TrustplayProgram } from "../target/types/trustplay_program";

describe("trustplay_program", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.trustplayProgram as Program<TrustplayProgram>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.createRoom()
    .accounts({
      organizer : 
    })
    .rpc();
    console.log("Your transaction signature", tx);
  });
});
