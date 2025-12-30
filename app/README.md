# Trustplay Frontend

A Next.js 16 frontend application for the Trustplay Solana program with wallet integration and blockchain interaction capabilities.

## 🎯 Overview

This frontend application provides a user interface for interacting with the Trustplay Solana program, enabling users to:
- Create gaming rooms with prize pools
- Join rooms and participate
- Submit claims for rewards
- Vote on claims
- View room status and history

## 🏗️ Architecture

This project follows the Magic Roulette architecture pattern with:
- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Solana Wallet Adapter** (Jupiter wallet adapter)
- **React 19** with modern hooks
- **Tailwind CSS 4** for styling
- **SWR** for data fetching and caching
- **Provider-based** state management
- **API routes** for server-side operations

## 📁 Project Structure

```
app/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── accounts/           # Account fetching endpoints
│   │   │   │   ├── rooms/         # Room account queries
│   │   │   │   ├── claims/        # Claim account queries
│   │   │   │   └── participants/  # Participant queries
│   │   │   └── transaction/       # Transaction handling
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Home page
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   ├── CreateRoomForm.tsx     # Room creation form
│   │   ├── RoomList.tsx           # Display all rooms
│   │   ├── WalletButton.tsx       # Wallet connection
│   │   └── Providers.tsx          # Provider wrapper
│   ├── idl/
│   │   └── trustplay_program.json # Program IDL
│   ├── lib/
│   │   ├── utils.ts               # Utility functions
│   │   ├── api.ts                 # API helpers
│   │   ├── program-client.ts      # Base program client
│   │   └── trustplay-program-client.ts  # Trustplay client
│   ├── providers/
│   │   ├── ThemeProvider.tsx      # Theme management
│   │   ├── SolanaProvider.tsx     # Solana/Wallet setup
│   │   └── ProgramProvider.tsx    # Program client context
│   └── types/
│       └── trustplay-program.ts   # TypeScript types
├── .env.local                      # Environment variables
├── components.json                 # shadcn/ui config
├── next.config.ts                  # Next.js configuration
├── package.json                    # Dependencies
├── postcss.config.mjs              # PostCSS config
└── tsconfig.json                   # TypeScript config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm, yarn, or bun
- A Solana wallet (Phantom, Solflare, etc.)

### Installation

1. Navigate to the app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
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
# or
yarn dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## 🔑 Key Features

### Provider Architecture

The application uses a layered provider architecture:

1. **SWRConfig**: Data fetching and caching
2. **ThemeProvider**: Dark/Light mode management
3. **SolanaProvider**: Wallet adapter and connection
4. **ProgramProvider**: Anchor program client

### Program Client

The `TrustplayProgramClient` provides methods for:

```typescript
// Get PDAs
getRoomPda(organizer, roomId)
getVaultPda(room)
getParticipantPda(room, player)
getClaimPda(room, claimant, claimId)

// Fetch accounts
getRoom(roomPda)
getAllRooms()
getRoomsByOrganizer(organizer)
```

### API Routes

- `/api/transaction/send` - Send signed transactions
- `/api/accounts/rooms` - Fetch single room
- `/api/accounts/rooms/all` - Fetch all rooms

## 🎨 Components

### CreateRoomForm

Component for creating new gaming rooms:
- Room ID and name input
- Prize pool configuration
- Deadline setting
- Vote threshold selection

### RoomList

Displays all available rooms with:
- Room status (Open, In Progress, Resolved, Cancelled)
- Prize pool amount
- Deadline and creation date
- Vote threshold

### WalletButton

Wallet connection interface:
- Connect wallet button
- Display connected address
- Disconnect functionality

## 🛠️ Development

### Building for Production

```bash
npm run build
npm run start
```

### Linting

```bash
npm run lint
```

### Adding New Components

1. Create component in `src/components/`
2. Use the `useProgram()` hook to access the program client
3. Use `useWallet()` for wallet interactions
4. Handle errors with `toast` notifications

Example:
```typescript
"use client";

import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";
import { toast } from "sonner";

export function MyComponent() {
  const { programClient } = useProgram();
  const { publicKey, signTransaction } = useWallet();

  const handleAction = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      // Your logic here
      toast.success("Success!");
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    }
  };

  return (
    // Your JSX
  );
}
```

## 🔐 Security

- All transactions are signed client-side by the user's wallet
- Private keys never leave the wallet
- Environment variables for sensitive configuration
- Server-side API routes for RPC calls

## 📚 Utility Functions

### `utils.ts`

- `cn()` - Merge Tailwind classes
- `v0TxToBase64()` - Convert transaction to base64
- `getExplorerLink()` - Generate Solana Explorer links
- `formatSol()` - Format lamports to SOL
- `shortenAddress()` - Truncate wallet addresses
- `formatDate()` - Format Unix timestamps

### `api.ts`

- `wrappedFetch()` - Fetch with error handling
- `sendTx()` - Send transactions via API

## 🎯 Next Steps

1. **Install Dependencies**:
   ```bash
   cd app && npm install
   ```

2. **Configure Environment**:
   - Set up `.env.local` with your RPC URL and program ID

3. **Start Development**:
   ```bash
   npm run dev
   ```

4. **Connect Wallet**:
   - Open the app and connect your Solana wallet

5. **Test Features**:
   - Create a test room
   - View available rooms
   - Interact with the program

## 🐛 Troubleshooting

### Wallet Not Connecting
- Ensure wallet extension is installed
- Check network settings (devnet/mainnet)
- Clear browser cache

### Transaction Failures
- Verify wallet has sufficient SOL
- Check program is deployed correctly
- Review transaction logs in console

### Build Errors
- Delete `.next` folder and rebuild
- Clear `node_modules` and reinstall
- Check TypeScript errors

## 📖 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [Anchor Framework](https://www.anchor-lang.com/)
- [Jupiter Wallet Adapter](https://station.jup.ag/docs/additional-topics/wallet-list)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC

---

**Built with ❤️ for the Trustplay decentralized gaming platform**
