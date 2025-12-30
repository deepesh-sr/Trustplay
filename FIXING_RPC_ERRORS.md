# Fixing RPC Rate Limit Error (429)

## Problem
You're seeing "Server responded with 429. Retrying after 500ms delay..." because the public Solana devnet RPC endpoint (`https://api.devnet.solana.com`) has strict rate limits.

## Solutions (Choose One)

### ⭐ Solution 1: Use Helius (Recommended - Best Free Tier)

Helius offers the best free tier for developers:

1. **Sign up**: Go to https://www.helius.dev/
2. **Create API key**: Get your free API key from the dashboard
3. **Update `.env.local`**:
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY_HERE
```
4. **Restart dev server**: `npm run dev`

**Free Tier Limits**: 
- 100 requests per second
- 3M credits per month
- Perfect for development

---

### 🚀 Solution 2: Use QuickNode

QuickNode offers reliable RPC services:

1. **Sign up**: Go to https://www.quicknode.com/
2. **Create endpoint**: Create a Solana Devnet endpoint
3. **Update `.env.local`**:
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://your-name.solana-devnet.quiknode.pro/YOUR_TOKEN/
```
4. **Restart dev server**: `npm run dev`

**Free Tier Limits**:
- 40M requests per month
- Good for small to medium projects

---

### 🌐 Solution 3: Use Alchemy

Alchemy provides enterprise-grade infrastructure:

1. **Sign up**: Go to https://www.alchemy.com/
2. **Create app**: Create a new Solana Devnet app
3. **Update `.env.local`**:
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-devnet.g.alchemy.com/v2/YOUR_API_KEY
```
4. **Restart dev server**: `npm run dev`

---

### 🔄 Solution 4: Use Multiple RPC Endpoints with Fallback

Already implemented! Just update your `.env.local`:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_FALLBACK_RPC_URLS=https://rpc.ankr.com/solana_devnet,https://devnet.sonic.game
```

The app will automatically switch to fallback endpoints when rate limited.

---

### 💻 Solution 5: Run Local Validator (For Heavy Development)

Best for intensive development work:

```bash
# Start local validator
solana-test-validator

# In another terminal, configure Solana CLI
solana config set --url http://localhost:8899

# Update .env.local
NEXT_PUBLIC_SOLANA_RPC_URL=http://localhost:8899
NEXT_PUBLIC_SOLANA_CLUSTER=localnet

# Add localnet program deployment in Anchor.toml
[programs.localnet]
trustplay_program = "5iKkxpwybyU7ReYKvwwzMtqw5zP9VFTe52KhvXuQSNAe"

# Deploy to local validator
anchor deploy --provider.cluster localnet
```

**Pros**: 
- Unlimited requests
- Fastest response times
- No network delays

**Cons**:
- Need to run validator locally
- Uses ~2GB RAM
- Fresh state on each restart

---

## Quick Fix (Temporary)

If you need a quick temporary fix, reduce the number of simultaneous requests:

### Option A: Reduce Polling Frequency

Add debouncing to your data fetching:

```typescript
// In your component
import { debounce } from 'lodash';

const debouncedFetchData = useMemo(
  () => debounce(fetchData, 1000), // Wait 1 second between fetches
  []
);
```

### Option B: Add Request Caching

The connection utility I created already includes retry logic with exponential backoff. It's located at:
- `app/src/lib/connection.ts`

This helps handle rate limits gracefully.

---

## Recommended Setup for Development

**Best Practice**: Use Helius for development (free, reliable) and consider upgrading or running your own RPC node for production.

1. Sign up for Helius (free): https://www.helius.dev/
2. Get your API key
3. Update `.env.local`:
```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY
```
4. For production, consider:
   - Paid tier on Helius/QuickNode/Alchemy
   - Running your own RPC node
   - Using Triton or other enterprise providers

---

## Testing Your Fix

After updating the RPC endpoint:

1. Restart the dev server: `npm run dev`
2. Clear browser cache or open incognito
3. Test room creation and interactions
4. Monitor console for any remaining errors

---

## Additional Optimization Tips

1. **Batch Requests**: Group multiple account fetches together
2. **Use WebSockets**: For real-time updates instead of polling
3. **Cache Data**: Store frequently accessed data in memory
4. **Lazy Load**: Only fetch data when components are visible
5. **Use `skipPrefetch`**: Disable prefetching on inactive pages

---

## Support

If you continue experiencing issues:
1. Check your API key is correct
2. Verify your free tier limits haven't been exceeded
3. Try a different RPC provider
4. Consider the local validator option for development
