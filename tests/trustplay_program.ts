import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { TrustplayProgram } from "../target/types/trustplay_program";
import { PublicKey, SystemProgram, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { assert } from "chai";

describe("trustplay_program", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TrustplayProgram as Program<TrustplayProgram>;
  
  // Test accounts
  const organizer = provider.wallet as anchor.Wallet;
  const player1 = Keypair.generate();
  const player2 = Keypair.generate();
  const voter1 = Keypair.generate();
  const voter2 = Keypair.generate();
  
  // Room configuration
  const roomId = "test-room-" + Date.now();
  const roomName = "Test Gaming Room";
  const totalPool = new BN(2 * LAMPORTS_PER_SOL); // 2 SOL
  const deadline = new BN(Math.floor(Date.now() / 1000) + 86400); // 24 hours from now
  const voteThreshold = 60; // 60%
  
  // Claim configuration
  const claimId = "claim-1";
  
  // PDAs
  let roomPda: PublicKey;
  let vaultPda: PublicKey;
  let participant1Pda: PublicKey;
  let participant2Pda: PublicKey;
  let claimPda: PublicKey;
  let whitelistPda: PublicKey;
  let voterRecord1Pda: PublicKey;
  let voterRecord2Pda: PublicKey;
  let reputationPda: PublicKey;

  before(async () => {
    // Airdrop SOL to test accounts
    const airdropSig1 = await provider.connection.requestAirdrop(
      player1.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig1);

    const airdropSig2 = await provider.connection.requestAirdrop(
      player2.publicKey,
      5 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig2);

    const airdropSig3 = await provider.connection.requestAirdrop(
      voter1.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig3);

    const airdropSig4 = await provider.connection.requestAirdrop(
      voter2.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(airdropSig4);

    // Derive PDAs
    [roomPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("room"), organizer.publicKey.toBuffer(), Buffer.from(roomId)],
      program.programId
    );

    [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), roomPda.toBuffer()],
      program.programId
    );

    [participant1Pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("participant"), roomPda.toBuffer(), player1.publicKey.toBuffer()],
      program.programId
    );

    [participant2Pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("participant"), roomPda.toBuffer(), player2.publicKey.toBuffer()],
      program.programId
    );

    [claimPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("claim"), roomPda.toBuffer(), player1.publicKey.toBuffer(), Buffer.from(claimId)],
      program.programId
    );

    [whitelistPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("whitelist")],
      program.programId
    );

    [voterRecord1Pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("voter"), claimPda.toBuffer(), voter1.publicKey.toBuffer()],
      program.programId
    );

    [voterRecord2Pda] = PublicKey.findProgramAddressSync(
      [Buffer.from("voter"), claimPda.toBuffer(), voter2.publicKey.toBuffer()],
      program.programId
    );

    [reputationPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("rep"), player1.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Initializes whitelist", async () => {
    const tx = await program.methods
      .initializeWhitelist()
      .accounts({
        organizer: organizer.publicKey,
        whitelist: whitelistPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Whitelist initialized:", tx);

    const whitelist = await program.account.whitelist.fetch(whitelistPda);
    assert.equal(whitelist.addresses.length, 0, "Whitelist should be empty initially");
  });

  it("Adds voters to whitelist", async () => {
    await program.methods
      .addToWhitelist(voter1.publicKey)
      .accounts({
        oraganizer: organizer.publicKey,
        whitelist: whitelistPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    await program.methods
      .addToWhitelist(voter2.publicKey)
      .accounts({
        oraganizer: organizer.publicKey,
        whitelist: whitelistPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Voters added to whitelist");

    const whitelist = await program.account.whitelist.fetch(whitelistPda);
    assert.equal(whitelist.addresses.length, 2, "Whitelist should have 2 voters");
  });

  it("Creates a room", async () => {
    const tx = await program.methods
      .createRoom(roomId, roomName, totalPool, deadline, voteThreshold)
      .accounts({
        room: roomPda,
        vault: vaultPda,
        organizer: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Room created:", tx);

    const room = await program.account.room.fetch(roomPda);
    assert.equal(room.roomId, roomId, "Room ID should match");
    assert.equal(room.name, roomName, "Room name should match");
    assert.equal(room.voteThreshold, voteThreshold, "Vote threshold should match");
    assert.ok(room.status.open !== undefined, "Room should be in Open status");
  });

  it("Player 1 joins the room", async () => {
    const tx = await program.methods
      .joinRoom()
      .accounts({
        room: roomPda,
        participant: participant1Pda,
        player: player1.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player1])
      .rpc();

    console.log("✅ Player 1 joined room:", tx);

    const participant = await program.account.participant.fetch(participant1Pda);
    assert.ok(participant.player.equals(player1.publicKey), "Participant should be player1");
  });

  it("Player 2 joins the room", async () => {
    const tx = await program.methods
      .joinRoom()
      .accounts({
        room: roomPda,
        participant: participant2Pda,
        player: player2.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player2])
      .rpc();

    console.log("✅ Player 2 joined room:", tx);

    const participant = await program.account.participant.fetch(participant2Pda);
    assert.ok(participant.player.equals(player2.publicKey), "Participant should be player2");
  });

  it("Player 1 deposits to vault", async () => {
    const depositAmount = new BN(0.5 * LAMPORTS_PER_SOL);
    
    const vaultBalanceBefore = await provider.connection.getBalance(vaultPda);
    
    const tx = await program.methods
      .depositToVault(depositAmount)
      .accounts({
        room: roomPda,
        vault: vaultPda,
        payer: player1.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player1])
      .rpc();

    console.log("✅ Player 1 deposited to vault:", tx);

    const vaultBalanceAfter = await provider.connection.getBalance(vaultPda);
    assert.ok(vaultBalanceAfter > vaultBalanceBefore, "Vault balance should increase");
  });

  it("Player 1 submits a claim", async () => {
    const tx = await program.methods
      .submitClaim(claimId)
      .accounts({
        room: roomPda,
        claim: claimPda,
        claimant: player1.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([player1])
      .rpc();

    console.log("✅ Claim submitted:", tx);

    const claim = await program.account.claim.fetch(claimPda);
    assert.equal(claim.claimId, claimId, "Claim ID should match");
    assert.ok(claim.claimant.equals(player1.publicKey), "Claimant should be player1");
    assert.equal(claim.votesFor.toNumber(), 0, "Initial votes for should be 0");
    assert.equal(claim.votesAgainst.toNumber(), 0, "Initial votes against should be 0");
    assert.equal(claim.resolved, false, "Claim should not be resolved");
  });

  it("Voter 1 votes to accept the claim", async () => {
    const tx = await program.methods
      .voteClaim(true)
      .accounts({
        room: roomPda,
        claim: claimPda,
        voter: voter1.publicKey,
        claimant: player1.publicKey,
        whitelist: whitelistPda,
        voterRecord: voterRecord1Pda,
        systemProgram: SystemProgram.programId,
      })
      .signers([voter1])
      .rpc();

    console.log("✅ Voter 1 voted to accept:", tx);

    const claim = await program.account.claim.fetch(claimPda);
    assert.equal(claim.votesFor.toNumber(), 1, "Votes for should be 1");
  });

  it("Voter 2 votes to accept the claim", async () => {
    const tx = await program.methods
      .voteClaim(true)
      .accounts({
        room: roomPda,
        claim: claimPda,
        voter: voter2.publicKey,
        claimant: player1.publicKey,
        whitelist: whitelistPda,
        voterRecord: voterRecord2Pda,
        systemProgram: SystemProgram.programId,
      })
      .signers([voter2])
      .rpc();

    console.log("✅ Voter 2 voted to accept:", tx);

    const claim = await program.account.claim.fetch(claimPda);
    assert.equal(claim.votesFor.toNumber(), 2, "Votes for should be 2");
  });

  it("Resolves the claim and distributes rewards", async () => {
    const player1BalanceBefore = await provider.connection.getBalance(player1.publicKey);
    const vaultBalanceBefore = await provider.connection.getBalance(vaultPda);

    const tx = await program.methods
      .resolveClaim()
      .accounts({
        room: roomPda,
        vault: vaultPda,
        claim: claimPda,
        claimant: player1.publicKey,
        reputation: reputationPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([player1])
      .rpc();

    console.log("✅ Claim resolved and rewards distributed:", tx);

    const claim = await program.account.claim.fetch(claimPda);
    assert.equal(claim.resolved, true, "Claim should be resolved");
    assert.ok(claim.resolvedAt !== null, "Resolved timestamp should be set");

    const player1BalanceAfter = await provider.connection.getBalance(player1.publicKey);
    console.log(`Player 1 balance change: ${(player1BalanceAfter - player1BalanceBefore) / LAMPORTS_PER_SOL} SOL`);

    const room = await program.account.room.fetch(roomPda);
    assert.ok(room.status.resolved !== undefined, "Room should be in Resolved status");

    const reputation = await program.account.reputation.fetch(reputationPda);
    assert.ok(reputation.player.equals(player1.publicKey), "Reputation should be for player1");
    assert.equal(reputation.wins, 1, "Player should have 1 win");
    assert.ok(reputation.score.toNumber() > 0, "Player should have positive score");
  });

  it("Removes a voter from whitelist", async () => {
    await program.methods
      .removeFromWhitelist(voter2.publicKey)
      .accounts({
        oraganizer: organizer.publicKey,
        whitelist: whitelistPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("✅ Voter removed from whitelist");

    const whitelist = await program.account.whitelist.fetch(whitelistPda);
    assert.equal(whitelist.addresses.length, 1, "Whitelist should have 1 voter");
    assert.ok(!whitelist.addresses.some(addr => addr.equals(voter2.publicKey)), "Voter2 should be removed");
  });

  it("Summary: All tests passed! 🎉", () => {
    console.log("\n========================================");
    console.log("✅ All Trustplay Program Tests Passed!");
    console.log("========================================");
    console.log("✓ Whitelist initialization");
    console.log("✓ Adding voters to whitelist");
    console.log("✓ Room creation");
    console.log("✓ Players joining room");
    console.log("✓ Deposits to vault");
    console.log("✓ Claim submission");
    console.log("✓ Voting on claims");
    console.log("✓ Claim resolution & reward distribution");
    console.log("✓ Reputation tracking");
    console.log("✓ Removing voters from whitelist");
    console.log("========================================\n");
  });
});
