# Trustplay Frontend - Quick Reference

## 🚀 Quick Start
```bash
cd app
npm install
npm run dev
```

## 📦 Key Dependencies
```json
"@coral-xyz/anchor": "^0.32.1"
"@jup-ag/wallet-adapter": "^0.2.5"
"next": "16.0.1"
"react": "19.0.0"
"swr": "^2.3.6"
"sonner": "^2.0.7"
"tailwindcss": "^4"
```

## 🔌 Hooks

### useProgram()
```typescript
const { programClient } = useProgram();
```

### useWallet()
```typescript
const { publicKey, signTransaction, connect, disconnect } = useWallet();
```

### useSWR()
```typescript
const { data, error, isLoading } = useSWR('/api/endpoint');
```

## 🏗️ Program Client Methods

```typescript
// PDAs
getRoomPda(organizer, roomId)
getVaultPda(room)
getParticipantPda(room, player)
getClaimPda(room, claimant, claimId)

// Fetch
getRoom(roomPda)
getAllRooms()
getRoomsByOrganizer(organizer)
```

## 🎨 Component Pattern

```typescript
"use client";

import { useProgram } from "@/providers/ProgramProvider";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function MyComponent() {
  const { programClient } = useProgram();
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!publicKey || !signTransaction) {
      toast.error("Please connect your wallet");
      return;
    }

    setLoading(true);
    try {
      // Create instruction
      const ix = await programClient.program.methods
        .yourMethod(args)
        .accounts({ /* accounts */ })
        .instruction();

      // Create and sign transaction
      const tx = new Transaction().add(ix);
      tx.feePayer = publicKey;
      tx.recentBlockhash = (
        await programClient.connection.getLatestBlockhash()
      ).blockhash;

      const signed = await signTransaction(tx);
      const sig = await programClient.connection.sendRawTransaction(
        signed.serialize()
      );

      await programClient.connection.confirmTransaction(sig);
      toast.success("Success!");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleAction} disabled={loading}>
      {loading ? "Processing..." : "Action"}
    </Button>
  );
}
```

## 🛣️ API Route Pattern

```typescript
import { NextRequest, NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";

const connection = new Connection(
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL as string
);

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    // Logic here
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

## 🎯 Utility Functions

```typescript
import { cn, formatSol, shortenAddress, formatDate } from "@/lib/utils";

// Merge classes
cn("class1", "class2", condition && "class3")

// Format SOL
formatSol(1000000000) // "1.0000"

// Shorten address
shortenAddress("5iKkx...QSNAe") // "5iKk...NAe"

// Format date
formatDate(1704067200) // "Jan 1, 2024, 12:00:00 AM"
```

## 🎨 Tailwind Classes

```typescript
// Common patterns
className="flex items-center justify-between"
className="p-4 rounded-lg border bg-card"
className="text-sm text-muted-foreground"
className="hover:bg-accent transition-colors"
className="disabled:opacity-50 disabled:pointer-events-none"
```

## 🔐 Environment Variables

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_FRONTEND_BASE_URL=http://localhost:3000
NEXT_PUBLIC_PROGRAM_ID=5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
```

## 📝 Common Commands

```bash
# Development
npm run dev

# Build
npm run build
npm run start

# Lint
npm run lint

# Clean
rm -rf .next node_modules
npm install
```

## 🐛 Debug Checklist

- [ ] Dependencies installed?
- [ ] Environment variables set?
- [ ] Wallet connected?
- [ ] Correct network (devnet/mainnet)?
- [ ] Sufficient SOL in wallet?
- [ ] Program deployed?
- [ ] Check browser console
- [ ] Check terminal logs

## 📚 File Shortcuts

```
app/
├── src/app/page.tsx              # Home page
├── src/components/Providers.tsx   # Main provider wrapper
├── src/lib/trustplay-program-client.ts  # Program methods
├── src/providers/ProgramProvider.tsx    # Program context
└── .env.local                     # Environment vars
```

## 🎯 Common Tasks

### Add New Page
```typescript
// src/app/yourpage/page.tsx
export default function YourPage() {
  return <div>Content</div>;
}
```

### Add New Component
```typescript
// src/components/YourComponent.tsx
"use client";

export function YourComponent() {
  return <div>Content</div>;
}
```

### Add New API Route
```typescript
// src/app/api/your-route/route.ts
export async function GET() {
  return NextResponse.json({ data: "value" });
}
```

## 💡 Tips

1. Always check wallet connection before transactions
2. Use `toast` for user feedback
3. Handle loading states
4. Catch and display errors
5. Use TypeScript types from IDL
6. Test on devnet first
7. Keep components small and focused
8. Use SWR for data fetching

---

**Quick Links:**
- [Full Setup Guide](./SETUP_GUIDE.md)
- [README](./README.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Anchor Docs](https://www.anchor-lang.com/)
