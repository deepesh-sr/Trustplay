# Trustplay Frontend Setup - Complete Guide

This guide will walk you through setting up the Trustplay frontend from scratch.

## ✅ What Has Been Created

The complete frontend structure has been set up following the Magic Roulette architecture:

### 1. **Configuration Files** ✓
- `package.json` - All dependencies configured
- `tsconfig.json` - TypeScript configuration
- `next.config.ts` - Next.js configuration with Solana webpack fixes
- `postcss.config.mjs` - PostCSS with Tailwind CSS 4
- `components.json` - shadcn/ui configuration
- `.env.local` - Environment variables template
- `.gitignore` - Git ignore rules

### 2. **Directory Structure** ✓
```
app/src/
├── app/
│   ├── api/
│   │   ├── accounts/
│   │   │   ├── rooms/
│   │   │   ├── claims/
│   │   │   └── participants/
│   │   └── transaction/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── CreateRoomForm.tsx
│   ├── RoomList.tsx
│   ├── WalletButton.tsx
│   └── Providers.tsx
├── idl/
│   └── trustplay_program.json
├── lib/
│   ├── utils.ts
│   ├── api.ts
│   ├── program-client.ts
│   └── trustplay-program-client.ts
├── providers/
│   ├── ThemeProvider.tsx
│   ├── SolanaProvider.tsx
│   └── ProgramProvider.tsx
└── types/
    └── trustplay-program.ts
```

### 3. **Core Files Created** ✓

#### Providers
- **ThemeProvider**: Dark/Light mode support
- **SolanaProvider**: Wallet adapter integration
- **ProgramProvider**: Anchor program client context

#### Program Client
- **ProgramClient**: Base class for Anchor programs
- **TrustplayProgramClient**: Trustplay-specific methods
  - PDA derivation helpers
  - Account fetching methods
  - Room, Participant, Claim management

#### Components
- **CreateRoomForm**: Form to create new gaming rooms
- **RoomList**: Display all available rooms
- **WalletButton**: Wallet connection interface
- **Button**: Base UI button component

#### API Routes
- `/api/transaction/send` - Transaction submission
- `/api/accounts/rooms` - Fetch single room
- `/api/accounts/rooms/all` - Fetch all rooms

#### Utilities
- `utils.ts` - Helper functions (formatting, addresses, dates)
- `api.ts` - API wrapper functions

### 4. **Type Definitions** ✓
- TypeScript types generated from IDL
- Type-safe program interactions
- Room, RoomStatus, and account types

## 🚀 Installation Steps

### Step 1: Navigate to the App Directory
```bash
cd app
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- **Core**: Next.js 16, React 19, TypeScript
- **Solana**: @coral-xyz/anchor, @jup-ag/wallet-adapter
- **UI**: Radix UI components, Tailwind CSS 4
- **Utilities**: SWR, sonner, lucide-react
- **Dev Tools**: ESLint, TypeScript compiler

### Step 3: Verify Environment Variables

Check that `.env.local` contains:
```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_FRONTEND_BASE_URL=http://localhost:3000
NEXT_PUBLIC_PROGRAM_ID=5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
```

### Step 4: Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 🎯 Key Features Implemented

### 1. Wallet Integration
- Jupiter wallet adapter for universal wallet support
- Auto-connect functionality
- Toast notifications for connection status
- Wallet button component

### 2. Program Client
```typescript
const { programClient } = useProgram();

// Get Room PDA
const [roomPda] = programClient.getRoomPda(organizer, roomId);

// Fetch Room Data
const room = await programClient.getRoom(roomPda);

// Get All Rooms
const rooms = await programClient.getAllRooms();
```

### 3. Transaction Handling
- Client-side transaction signing
- Server-side RPC calls via API routes
- Error handling with user-friendly messages
- Transaction confirmation tracking

### 4. UI Components
- Responsive design with Tailwind CSS
- Dark/Light mode support
- Loading states
- Error states
- Success notifications

## 📝 Usage Examples

### Creating a Room

```typescript
import { CreateRoomForm } from "@/components/CreateRoomForm";

export default function CreatePage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create Gaming Room</h1>
      <CreateRoomForm />
    </div>
  );
}
```

### Displaying Rooms

```typescript
import { RoomList } from "@/components/RoomList";

export default function RoomsPage() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Available Rooms</h1>
      <RoomList />
    </div>
  );
}
```

### Using Program Client

```typescript
"use client";

import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useEffect, useState } from "react";

export function MyComponent() {
  const { programClient } = useProgram();
  const { publicKey } = useWallet();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!publicKey) return;
      
      const rooms = await programClient.getAllRooms();
      setData(rooms);
    }
    
    fetchData();
  }, [programClient, publicKey]);

  return <div>{/* Render your data */}</div>;
}
```

## 🔧 Customization

### Adding New Instructions

1. Add method to `TrustplayProgramClient`:
```typescript
// In trustplay-program-client.ts
async joinRoom(roomPda: PublicKey, playerPda: PublicKey) {
  return await this.program.methods
    .joinRoom()
    .accounts({
      room: roomPda,
      participant: playerPda,
      player: this.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .instruction();
}
```

2. Create component:
```typescript
// In JoinRoomButton.tsx
export function JoinRoomButton({ roomPda }: { roomPda: PublicKey }) {
  const { programClient } = useProgram();
  const { publicKey, signTransaction } = useWallet();

  const handleJoin = async () => {
    // Implementation
  };

  return <Button onClick={handleJoin}>Join Room</Button>;
}
```

### Styling

Modify `globals.css` to customize:
- Color scheme (primary, secondary, accent)
- Border radius
- Font families
- Dark mode colors

### Adding API Routes

Create new route in `src/app/api/`:
```typescript
// src/app/api/custom/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // Implementation
  return NextResponse.json({ data: "response" });
}
```

## 🐛 Common Issues & Solutions

### Issue: Dependencies Not Installing
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Errors
**Solution**: The errors shown are expected until dependencies are installed. Run:
```bash
npm install
```

### Issue: Wallet Not Connecting
**Solution**:
- Install a Solana wallet extension (Phantom, Solflare)
- Ensure you're on the correct network (devnet)
- Check browser console for errors

### Issue: RPC Rate Limiting
**Solution**:
- Use a private RPC endpoint (QuickNode, Alchemy, Helius)
- Update `NEXT_PUBLIC_SOLANA_RPC_URL` in `.env.local`

### Issue: Transaction Failing
**Solution**:
- Check wallet has sufficient SOL
- Verify program is deployed to the correct network
- Check program ID matches deployed program
- Review browser console for error details

## 📚 Next Steps

### 1. **Install and Test** (Immediate)
```bash
cd app
npm install
npm run dev
```

### 2. **Add More Components** (Short-term)
- Participant list component
- Claim submission form
- Voting interface
- Room details page

### 3. **Enhance UI** (Medium-term)
- Add more shadcn/ui components
- Implement data tables for claims
- Add charts for statistics
- Create admin dashboard

### 4. **Deploy** (Long-term)
```bash
npm run build
# Deploy to Vercel, Netlify, or your preferred host
```

## 🎓 Learning Resources

- **Next.js**: https://nextjs.org/docs
- **Anchor**: https://www.anchor-lang.com/
- **Solana**: https://docs.solana.com/
- **Wallet Adapter**: https://github.com/solana-labs/wallet-adapter
- **Tailwind CSS**: https://tailwindcss.com/docs

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Review the TypeScript errors
3. Verify environment variables are set
4. Ensure wallet is connected
5. Check network connectivity to RPC

## ✨ Features to Add

Consider implementing:
- [ ] Room details page
- [ ] Join room functionality
- [ ] Deposit to vault
- [ ] Submit claim form
- [ ] Vote on claims interface
- [ ] Reputation display
- [ ] Transaction history
- [ ] User profile page
- [ ] Search and filter rooms
- [ ] Pagination for large datasets
- [ ] Real-time updates (WebSocket)
- [ ] Mobile responsive design improvements

---

## 🎉 You're Ready!

Your Trustplay frontend is now set up and ready for development. Start by:

1. Installing dependencies: `npm install`
2. Starting the dev server: `npm run dev`
3. Connecting your wallet
4. Testing the room creation
5. Building out additional features

Happy coding! 🚀
