# Trustplay Program - Frontend Integration Guide

## Overview

The Trustplay Program frontend has been fully integrated with all smart contract instructions. Users can now interact with all program features through the UI.

## Deployed Program Details

- **Program ID**: `5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe`
- **Network**: Solana Devnet
- **Cluster URL**: `https://api.devnet.solana.com`
- **IDL Account**: `2UmwNzsZj5cwXmQ9jX5RHZAvkwUaBF6VV7LaE1o4zTUr`

## Features Implemented

### 1. **Create Room** ✅
- **Location**: Home page (`/`)
- **Component**: `CreateRoomForm`
- **Functionality**: Create a new gaming room with prize pool, deadline, and vote threshold

### 2. **Join Room** ✅
- **Location**: Room details page (`/rooms/[roomId]`)
- **Component**: `JoinRoomButton`
- **Functionality**: Join an existing room as a participant
- **Requirements**: User must not already be a participant

### 3. **Deposit to Vault** ✅
- **Location**: Room details page (`/rooms/[roomId]`)
- **Component**: `DepositToVault`
- **Functionality**: Deposit SOL to the room's vault to contribute to prize pool
- **Requirements**: User must be a participant

### 4. **Submit Claim** ✅
- **Location**: Room details page (`/rooms/[roomId]`)
- **Component**: `SubmitClaim`
- **Functionality**: Submit a claim for achievements in the room
- **Requirements**: User must be a participant
- **Note**: Claims are identified by a unique claim ID

### 5. **Vote on Claim** ✅
- **Location**: Room details page (`/rooms/[roomId]`)
- **Component**: `VoteClaim`
- **Functionality**: Vote to accept or reject a claim
- **Requirements**: User must be whitelisted as a voter
- **Note**: Each voter can only vote once per claim

### 6. **Resolve Claim** ✅
- **Location**: Room details page (`/rooms/[roomId]`)
- **Component**: `ResolveClaim`
- **Functionality**: Resolve a claim and distribute rewards if approved
- **Requirements**: User must be the claimant
- **Note**: Automatically updates reputation on successful resolution

### 7. **View Participants** ✅
- **Location**: Room details page (`/rooms/[roomId]`)
- **Functionality**: View all participants who have joined the room

### 8. **View Claims** ✅
- **Location**: Room details page (`/rooms/[roomId]`)
- **Functionality**: View all claims submitted for the room with voting status

## Program Client Methods

The `TrustplayProgramClient` class provides the following methods:

### PDA Derivation
- `getRoomPda(organizer, roomId)` - Get Room PDA
- `getVaultPda(room)` - Get Vault PDA
- `getParticipantPda(room, player)` - Get Participant PDA
- `getClaimPda(room, claimant, claimId)` - Get Claim PDA
- `getWhitelistPda()` - Get Whitelist PDA
- `getVoterRecordPda(claim, voter)` - Get Voter Record PDA
- `getReputationPda(player)` - Get Reputation PDA

### Data Fetching
- `getRoom(roomPda)` - Fetch Room account
- `getAllRooms()` - Fetch all Rooms
- `getRoomsByOrganizer(organizer)` - Fetch Rooms by organizer
- `getParticipant(participantPda)` - Fetch Participant account
- `getParticipantsByRoom(room)` - Fetch all Participants for a room
- `getClaim(claimPda)` - Fetch Claim account
- `getClaimsByRoom(room)` - Fetch all Claims for a room
- `getWhitelist()` - Fetch Whitelist account
- `getReputation(player)` - Fetch Reputation account

## User Workflow

### For Room Organizers:
1. **Create a Room**: Set up a new gaming room with prize pool and rules
2. **Monitor Participants**: Track who joins your room
3. **View Claims**: See all submitted claims and voting progress

### For Participants:
1. **Browse Rooms**: View all available rooms on the dashboard
2. **Join Room**: Become a participant in a room
3. **Deposit Funds**: Contribute to the prize pool (optional)
4. **Submit Claims**: Submit claims for your achievements
5. **Resolve Claims**: Resolve your own claims once voting threshold is met
6. **Track Reputation**: Your reputation score increases with successful claims

### For Whitelisted Voters:
1. **Vote on Claims**: Accept or reject claims submitted by participants
2. **Track Voting**: See how many votes each claim has received

## Technical Details

### Transaction Flow
All interactions with the program follow this pattern:
1. Build instruction with program methods
2. Derive necessary PDAs
3. Create transaction with instruction
4. Sign transaction with wallet
5. Send and confirm transaction
6. Update UI with new data

### Error Handling
- Wallet connection errors
- Transaction simulation errors
- Program errors (e.g., "Voter not whitelisted", "Already resolved")
- Network errors

### State Management
- Real-time data fetching on page load
- Automatic UI updates after successful transactions
- Loading states for all async operations
- Toast notifications for user feedback

## Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_PROGRAM_ID=5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
```

## Running the Frontend

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

4. Connect your Solana wallet (make sure it's set to Devnet)

5. Get some devnet SOL:
```bash
solana airdrop 2
```

## Testing Checklist

- [x] Create room
- [x] Join room
- [x] Deposit to vault
- [x] Submit claim
- [x] Vote on claim (requires whitelist setup)
- [x] Resolve claim
- [x] View participants
- [x] View claims
- [x] View room details

## Notes

- **Whitelist Setup**: The whitelist feature (initialize_whitelist, add_to_whitelist, remove_from_whitelist) is implemented in the program but not yet exposed in the UI. You can interact with these instructions programmatically using the Anchor CLI if needed.

- **Claim Structure**: Claims are intentionally simple - they only track the claim ID and voting results. Additional metadata (descriptions, proof, amounts) should be stored off-chain and referenced by the claim ID.

- **Reputation System**: Successfully resolved claims automatically update the player's reputation score (+10 points) and win count (+1).

## Support

For issues or questions, please refer to the Trustplay Program documentation or create an issue in the repository.
