# ✅ Trustplay Frontend Setup Checklist

## 🎯 Quick Start (Do This First!)

```bash
cd app
npm install
npm run dev
```

Then open: http://localhost:3000

---

## 📋 Setup Verification Checklist

### ✅ Files Created
- [ ] `app/package.json` - Dependencies configured
- [ ] `app/tsconfig.json` - TypeScript config
- [ ] `app/next.config.ts` - Next.js config
- [ ] `app/.env.local` - Environment variables
- [ ] `app/src/app/layout.tsx` - Root layout
- [ ] `app/src/app/page.tsx` - Home page
- [ ] `app/src/app/globals.css` - Styles

### ✅ Providers Created
- [ ] `app/src/providers/ThemeProvider.tsx` - Dark/Light mode
- [ ] `app/src/providers/SolanaProvider.tsx` - Wallet adapter
- [ ] `app/src/providers/ProgramProvider.tsx` - Program client
- [ ] `app/src/components/Providers.tsx` - Provider wrapper

### ✅ Program Client Created
- [ ] `app/src/lib/program-client.ts` - Base client
- [ ] `app/src/lib/trustplay-program-client.ts` - Trustplay client
- [ ] `app/src/lib/utils.ts` - Utility functions
- [ ] `app/src/lib/api.ts` - API helpers

### ✅ Components Created
- [ ] `app/src/components/ui/button.tsx` - Button component
- [ ] `app/src/components/CreateRoomForm.tsx` - Create room form
- [ ] `app/src/components/RoomList.tsx` - Display rooms
- [ ] `app/src/components/WalletButton.tsx` - Wallet connection

### ✅ API Routes Created
- [ ] `app/src/app/api/transaction/send/route.ts` - Send transaction
- [ ] `app/src/app/api/accounts/rooms/route.ts` - Fetch room
- [ ] `app/src/app/api/accounts/rooms/all/route.ts` - Fetch all rooms

### ✅ Types & IDL
- [ ] `app/src/types/trustplay-program.ts` - TypeScript types
- [ ] `app/src/idl/trustplay_program.json` - Program IDL

### ✅ Documentation
- [ ] `app/README.md` - Frontend documentation
- [ ] `app/SETUP_GUIDE.md` - Detailed setup guide
- [ ] `app/QUICK_REFERENCE.md` - Quick reference
- [ ] `FRONTEND_SETUP_COMPLETE.md` - Completion summary

---

## 🔧 Installation Checklist

### Step 1: Navigate to App Directory
```bash
cd app
```
- [ ] Confirmed in `app` directory

### Step 2: Install Dependencies
```bash
npm install
```
- [ ] `node_modules` folder created
- [ ] No error messages
- [ ] All packages installed

### Step 3: Configure Environment
- [ ] `.env.local` file exists
- [ ] `NEXT_PUBLIC_SOLANA_RPC_URL` is set
- [ ] `NEXT_PUBLIC_PROGRAM_ID` is correct
- [ ] `NEXT_PUBLIC_SOLANA_CLUSTER` is set (devnet/mainnet)

### Step 4: Start Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] Accessible at http://localhost:3000
- [ ] No compilation errors

---

## 🔌 Wallet Setup Checklist

- [ ] Phantom/Solflare/other wallet extension installed
- [ ] Wallet configured for correct network (devnet/mainnet)
- [ ] Wallet has some SOL for transaction fees
- [ ] Can connect wallet to the app
- [ ] Wallet address displays correctly

---

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Home page loads correctly
- [ ] Wallet connect button appears
- [ ] Can connect wallet successfully
- [ ] Wallet address displays after connection
- [ ] Can disconnect wallet

### Room Features
- [ ] Can view CreateRoomForm
- [ ] Form fields accept input
- [ ] Can view RoomList
- [ ] Rooms display correctly (if any exist)
- [ ] Room status shows correctly

### Developer Tools
- [ ] Browser console has no critical errors
- [ ] React DevTools show component tree
- [ ] Network tab shows API calls
- [ ] Hot reload works when editing files

---

## 📦 Dependencies Checklist

### Core Dependencies Installed
- [ ] next@16.0.1
- [ ] react@19.0.0
- [ ] react-dom@19.0.0
- [ ] typescript@^5

### Solana Dependencies Installed
- [ ] @coral-xyz/anchor@^0.32.1
- [ ] @jup-ag/wallet-adapter@^0.2.5
- [ ] @solana/wallet-adapter-react@^0.15.39
- [ ] @solana/web3.js (peer dependency)

### UI Dependencies Installed
- [ ] tailwindcss@^4
- [ ] @radix-ui packages
- [ ] lucide-react@^0.553.0
- [ ] sonner@^2.0.7 (toast notifications)
- [ ] next-themes@^0.4.6

### Utility Dependencies Installed
- [ ] swr@^2.3.6
- [ ] clsx@^2.1.1
- [ ] tailwind-merge@^3.3.1
- [ ] class-variance-authority@^0.7.1

---

## 🎨 Styling Checklist

- [ ] Tailwind CSS configured
- [ ] `globals.css` has theme variables
- [ ] Dark mode works
- [ ] Light mode works
- [ ] Colors match design
- [ ] Responsive design works

---

## 🚀 Production Readiness Checklist

### Before Building
- [ ] All TypeScript errors resolved
- [ ] All linting errors fixed
- [ ] Environment variables configured for production
- [ ] RPC URL points to production endpoint
- [ ] Program ID is correct for mainnet (if deploying to mainnet)

### Build Process
```bash
npm run build
```
- [ ] Build completes successfully
- [ ] No build errors
- [ ] `.next` folder created
- [ ] Can run `npm run start`
- [ ] Production build works correctly

### Deployment
- [ ] Choose hosting provider (Vercel, Netlify, etc.)
- [ ] Configure environment variables on host
- [ ] Deploy build
- [ ] Test deployed version
- [ ] SSL certificate configured
- [ ] Custom domain configured (optional)

---

## 🐛 Troubleshooting Checklist

### If Nothing Works
- [ ] Deleted `node_modules` and reinstalled
- [ ] Deleted `.next` folder
- [ ] Checked Node.js version (20+)
- [ ] Verified all files were created
- [ ] Checked for typos in file names

### If Wallet Won't Connect
- [ ] Wallet extension installed
- [ ] Wallet configured for correct network
- [ ] Browser allows popup windows
- [ ] Cleared browser cache
- [ ] Tried different wallet

### If Transactions Fail
- [ ] Wallet has sufficient SOL
- [ ] Connected to correct network
- [ ] Program is deployed
- [ ] Program ID is correct
- [ ] Checked browser console for errors

### If Styles Don't Load
- [ ] Tailwind CSS installed
- [ ] `globals.css` imported in layout
- [ ] PostCSS configured
- [ ] Restarted dev server

---

## ✅ Final Verification

Run through this quick test:

1. [ ] `cd app && npm install` - Installs successfully
2. [ ] `npm run dev` - Server starts
3. [ ] Open http://localhost:3000 - Page loads
4. [ ] Click "Connect Wallet" - Wallet connects
5. [ ] Navigate to room creation - Form appears
6. [ ] Fill out form - All fields work
7. [ ] Check room list - Displays correctly

---

## 🎉 Success Criteria

You're ready to develop when:

- [x] All files created
- [x] Dependencies installed
- [x] Dev server runs
- [x] Wallet connects
- [x] Components render
- [x] No critical errors

---

## 📚 Next Steps After Setup

1. [ ] Read through `SETUP_GUIDE.md`
2. [ ] Review `QUICK_REFERENCE.md`
3. [ ] Explore existing components
4. [ ] Create your first custom component
5. [ ] Add a new feature
6. [ ] Test on devnet
7. [ ] Deploy to production

---

## 🆘 If You're Stuck

1. Check `SETUP_GUIDE.md` troubleshooting section
2. Review `QUICK_REFERENCE.md` for examples
3. Check browser console for errors
4. Verify environment variables
5. Try deleting `.next` and `node_modules`, then reinstall

---

**Status**: ✅ Frontend Setup Complete!

**Ready to code?** Run:
```bash
cd app
npm install
npm run dev
```

Then start building! 🚀
