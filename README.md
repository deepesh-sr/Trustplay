# Trustplay Program

A Solana program built with Anchor framework for managing decentralized gaming rooms with claim-based reward distribution and community voting.

## Overview

Trustplay is a smart contract system that enables:
- **Gaming Rooms**: Organizers can create rooms with prize pools and deadlines
- **Participant Management**: Players can join rooms and participate in gameplay
- **Claim System**: Players can submit claims for rewards based on their performance
- **Community Voting**: Verified voters can vote on claims to ensure fair distribution
- **Reputation System**: Track participant behavior and voting patterns
- **Vault Management**: Secure handling of deposits and prize pool distribution

## Program ID

```
5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe
```

## Features

### Core Instructions

- **create_room**: Create a new gaming room with prize pool and parameters
- **join_room**: Allow players to join an active room
- **deposit_to_vault**: Deposit funds into the room's vault
- **submit_claim**: Submit a claim for rewards
- **vote_claim**: Cast votes on submitted claims
- **resolve_claim**: Finalize claims and distribute rewards
- **whitelist_operation**: Manage verified voters

### State Accounts

- **Room**: Main room configuration and status
- **Participant**: Player participation records
- **Claim**: Individual reward claims
- **VoteRecord**: Voting history
- **Reputation**: User reputation scores
- **VerifiedVoters**: Whitelist of trusted voters

## Prerequisites

- Rust 1.75+
- Solana CLI 1.18+
- Anchor 0.32.1+
- Node.js 16+
- Yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trustplay_program
```

2. Install dependencies:
```bash
yarn install
```

3. Build the program:
```bash
anchor build
```

## Development

### Building

```bash
anchor build
```

### Testing

```bash
anchor test
```

Or run tests with custom options:
```bash
yarn test
```

### Deploying

Deploy to localnet:
```bash
anchor deploy
```

Deploy to devnet:
```bash
anchor deploy --provider.cluster devnet
```

## Project Structure

```
trustplay_program/
├── programs/trustplay_program/
│   └── src/
│       ├── lib.rs              # Program entry point
│       ├── constants.rs        # Program constants
│       ├── error.rs           # Custom error codes
│       ├── instructions/      # Instruction handlers
│       │   ├── create_room.rs
│       │   ├── join_room.rs
│       │   ├── deposit_to_vault.rs
│       │   ├── submit_claim.rs
│       │   ├── vote_claim.rs
│       │   ├── resolve_claim.rs
│       │   └── whitelist_operation.rs
│       └── state/             # Account structures
│           ├── room.rs
│           ├── participant.rs
│           ├── claim.rs
│           ├── voterecord.rs
│           ├── reputation.rs
│           └── verfiedvoters.rs
├── tests/                     # Integration tests
├── app/                       # Client application
└── target/                    # Build artifacts
```

## Usage Example

### Creating a Room

```typescript
await program.methods
  .createRoom(
    roomId,
    roomName,
    totalPool,
    deadline,
    voteThreshold
  )
  .accounts({
    organizer: organizerKeypair.publicKey,
    room: roomPda,
    systemProgram: SystemProgram.programId,
  })
  .signers([organizerKeypair])
  .rpc();
```

### Joining a Room

```typescript
await program.methods
  .joinRoom()
  .accounts({
    room: roomPda,
    participant: participantPda,
    player: playerKeypair.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([playerKeypair])
  .rpc();
```

### Submitting a Claim

```typescript
await program.methods
  .submitClaim(claimId)
  .accounts({
    room: roomPda,
    claim: claimPda,
    claimant: claimantKeypair.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .signers([claimantKeypair])
  .rpc();
```

## Configuration

Configure network and wallet settings in `Anchor.toml`:

```toml
[provider]
cluster = "localnet"  # Change to "devnet" or "mainnet-beta" as needed
wallet = "~/.config/solana/id.json"
```

## Security Considerations

- All instructions use PDA (Program Derived Addresses) for secure account derivation
- Signer verification on all state-changing operations
- Vote threshold mechanisms to prevent manipulation
- Deadline enforcement for time-sensitive operations
- Reputation system to track and discourage malicious behavior

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Links

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com/)

## Support

For issues and questions, please open an issue in the GitHub repository.
