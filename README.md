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

## Repository Structure

This repository contains both the Solana program and a Next.js frontend application:

```
trustplay_program/
├── programs/              # Solana program (Rust)
├── tests/                # Program tests
├── app/                  # Next.js frontend application
├── target/               # Build artifacts
└── Anchor.toml           # Anchor configuration
```

## Prerequisites

### For Solana Program
- Rust 1.75+
- Solana CLI 1.18+
- Anchor 0.32.1+
- Node.js 16+
- Yarn

### For Frontend
- Node.js 20+
- npm/yarn/bun
- A Solana wallet (Phantom, Solflare, etc.)

## Installation

### Solana Program Setup

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

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env.local`:
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_FRONTEND_BASE_URL=http://localhost:3000
NEXT_PUBLIC_PROGRAM_ID=5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

**📚 For detailed frontend setup instructions, see [app/SETUP_GUIDE.md](./app/SETUP_GUIDE.md)**

## Development

### Program Development

#### Building

```bash
anchor build
```

#### Testing

```bash
anchor test
```

Or run tests with custom options:
```bash
yarn test
```

#### Deploying

Deploy to localnet:
```bash
anchor deploy
```

Deploy to devnet:
```bash
anchor deploy --provider.cluster devnet
```

### Frontend Development

#### Running Development Server
```bash
cd app
npm run dev
```

#### Building for Production
```bash
cd app
npm run build
npm run start
```

#### Adding Components
See [app/QUICK_REFERENCE.md](./app/QUICK_REFERENCE.md) for common patterns and examples.

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
├── app/                       # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js pages and API routes
│   │   ├── components/       # React components
│   │   ├── lib/              # Program client and utilities
│   │   ├── providers/        # React context providers
│   │   ├── types/            # TypeScript type definitions
│   │   └── idl/              # Program IDL
│   ├── package.json
│   ├── README.md
│   ├── SETUP_GUIDE.md
│   └── QUICK_REFERENCE.md
└── target/                    # Build artifacts
```

## Usage Examples

### Program Usage (TypeScript/Anchor)

#### Creating a Room

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

### Frontend Usage (React/Next.js)

The frontend provides a complete UI for interacting with the program. See the [app directory](./app) for:

- **CreateRoomForm**: UI component for creating rooms
- **RoomList**: Display and browse available rooms
- **WalletButton**: Connect Solana wallets
- **Program Client**: TypeScript client for program interactions

Example using the frontend:
```typescript
import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";

export function MyComponent() {
  const { programClient } = useProgram();
  const { publicKey } = useWallet();

  const rooms = await programClient.getAllRooms();
  // Use rooms in your UI
}
```

## Configuration

Configure network and wallet settings in `Anchor.toml`:

```toml
[provider]
cluster = "localnet"  # Change to "devnet" or "mainnet-beta" as needed
wallet = "~/.config/solana/id.json"
```

For frontend configuration, see [app/.env.local](./app/.env.local)

## Security Considerations

- All instructions use PDA (Program Derived Addresses) for secure account derivation
- Signer verification on all state-changing operations
- Vote threshold mechanisms to prevent manipulation
- Deadline enforcement for time-sensitive operations
- Reputation system to track and discourage malicious behavior

## Documentation

- **Program Documentation**: This README
- **Frontend Setup**: [app/SETUP_GUIDE.md](./app/SETUP_GUIDE.md)
- **Quick Reference**: [app/QUICK_REFERENCE.md](./app/QUICK_REFERENCE.md)
- **Frontend README**: [app/README.md](./app/README.md)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Links

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com/)

## Support

For issues and questions, please open an issue in the GitHub repository.
