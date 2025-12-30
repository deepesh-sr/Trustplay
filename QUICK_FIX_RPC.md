# 🚨 Quick Fix for RPC 429 Error

## The Problem
`Server responded with 429` = Rate limit hit on public Solana RPC

## ⚡ Fastest Solution (5 minutes)

### 1. Sign up for Helius (FREE)
👉 https://www.helius.dev/

### 2. Get your API key from dashboard

### 3. Update `app/.env.local`:
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY_HERE
```

### 4. Restart server
```bash
cd app
npm run dev
```

## ✅ Done! No more rate limits

---

## Alternative: Use Setup Script

```bash
./setup-rpc.sh
```

The script will guide you through the setup.

---

## Why Helius?
- ✅ **100 requests/second** (vs 10 on public RPC)
- ✅ **3M credits/month** (more than enough for dev)
- ✅ **Free forever** for development
- ✅ **5-minute setup**
- ✅ **No credit card** required

---

## Other Free Options

| Provider | Signup | Requests/month | Setup Time |
|----------|--------|----------------|------------|
| **Helius** | [helius.dev](https://helius.dev) | 3M credits | 5 min ⭐ |
| **QuickNode** | [quicknode.com](https://quicknode.com) | 40M | 10 min |
| **Alchemy** | [alchemy.com](https://alchemy.com) | Good limits | 10 min |
| **Ankr** | [ankr.com](https://ankr.com) | Unlimited* | 5 min |

\* With restrictions

---

## 🆘 Need Help?

Read the full guide: [FIXING_RPC_ERRORS.md](./FIXING_RPC_ERRORS.md)
