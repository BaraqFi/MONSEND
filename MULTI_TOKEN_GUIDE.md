# MONSEND Multi-Token Sending Guide

## 🎉 New Features

Your MONSEND wallet now supports sending **ANY token** on Monad Testnet, not just MON!

---

## ✨ What's New

### 1. **Token Balance Display** 💰
In the Coins tab, each token now shows:
- **Left side**: Token name and symbol
- **Right side**: Your balance with symbol

Example:
```
[MON Icon]  MON          0.2132 MON
            Monad
```

### 2. **Multi-Token Send Modal** 🚀

When you click "Send", you now get a **2-step process**:

#### **Step 1: Select Token**
Choose which token to send:

**Option A: Your Tokens List**
- Shows all tokens you own (MON + any ERC-20 tokens)
- Displays balance for each token
- Click any token to send it

**Option B: Custom Token Address**
- Enter any ERC-20 token contract address
- Click "Verify Token"
- System checks:
  - ✅ Is it a valid ERC-20 token?
  - ✅ Do you have a balance?
  - ✅ Shows token name, symbol, and your balance
  - ✅ **Green checkmark** if you have positive balance!

#### **Step 2: Send**
- Enter recipient address
- Enter amount (with MAX button for convenience)
- Send your tokens!
- Works for both MON and ERC-20 tokens

---

## 🎯 How to Use

### Sending MON (Native Token)

1. Click **Send** button
2. Select **MON** from your tokens list
3. Enter recipient address
4. Enter amount (or click MAX)
5. Click **Send MON**
6. Confirm transaction in your wallet

### Sending ERC-20 Tokens

#### If you know you have the token:
1. Click **Send** button
2. Select the token from your list
3. Enter recipient and amount
4. Click **Send [TOKEN]**

#### If token doesn't appear in list:
1. Click **Send** button
2. Scroll to "Or enter token address"
3. Paste the token contract address
4. Click **Verify Token**
5. Wait for verification...
6. If you have balance:
   - ✅ **Green checkmark appears!**
   - Token info displays (name, symbol, balance)
   - Click **Send [TOKEN]** button
7. Enter recipient and amount
8. Send!

---

## 🔐 Security Features

### Token Verification
- Validates token contract address
- Checks if it's a valid ERC-20 token
- Verifies you have a positive balance
- Shows clear error if token is invalid or balance is zero

### Transaction Validation
- Validates recipient address format
- Checks amount doesn't exceed balance
- Ensures you're on Monad Testnet
- Shows detailed error messages

### Balance Protection
- **MAX button**: Automatically fills your full balance
- **Insufficient balance**: Shows error before transaction
- **Real-time balance**: Refreshes after each transaction

---

## 🎨 UI/UX Enhancements

### Token Selection Screen
```
┌─────────────────────────────────┐
│  Select Token to Send           │
├─────────────────────────────────┤
│  Your Tokens                    │
│                                 │
│  [M]  MON      →  0.2132 MON   │
│       Monad                     │
│                                 │
│  [U]  USDT     →  100.00 USDT  │
│       Tether USD                │
├─────────────────────────────────┤
│  Or enter token address         │
│                                 │
│  [0x...]  [Verify Token]        │
│                                 │
│  ✓ USDC - USD Coin             │
│    Balance: 50.00 USDC         │
│    [Send USDC]                 │
└─────────────────────────────────┘
```

### Send Screen
```
┌─────────────────────────────────┐
│  ← Back  Send MON               │
├─────────────────────────────────┤
│  [M]  MON          Available    │
│       Monad        0.2132       │
├─────────────────────────────────┤
│  Recipient Address              │
│  [0x...]                        │
│                                 │
│  Amount               [MAX]     │
│  [0.1]                          │
│                                 │
│  [Send MON]                     │
└─────────────────────────────────┘
```

---

## 🛠️ Technical Details

### Supported Token Standards
- **Native MON**: Direct transfer via `sendTransaction`
- **ERC-20 Tokens**: Transfer via `transfer()` function

### What Gets Verified
When you enter a custom token address:
1. Contract exists at address
2. Has `symbol()` function
3. Has `name()` function  
4. Has `decimals()` function
5. Has `balanceOf()` function
6. Returns your balance

### Auto-Discovery
The app automatically shows tokens if you:
- Have MON balance (always shows)
- Add known token addresses to the code (see below)

---

## 🔧 Adding Known Tokens

Want certain tokens to always appear in your list?

**Edit:** `components/Home/SendTokens.tsx`

Find this section:
```typescript
const tokenAddresses: Address[] = [
  // Add known token addresses here
  // Example: '0x...' as Address,
]
```

Add your favorite tokens:
```typescript
const tokenAddresses: Address[] = [
  '0x1234567890...' as Address, // USDT
  '0x0987654321...' as Address, // USDC
  '0xabcdef1234...' as Address, // DAI
]
```

They'll automatically appear in your send list!

---

## 💡 Pro Tips

### 1. **Save Time with MAX Button**
Click MAX to send your entire balance - no need to type the amount!

### 2. **Verify Before Sending**
Always verify custom tokens before sending to ensure:
- Token contract is valid
- You actually have a balance
- Token name/symbol matches expectations

### 3. **Keep Addresses Handy**
Save frequently-used token addresses in your notes app for quick access.

### 4. **Check Explorer**
After sending, always click "View on Explorer" to confirm your transaction.

---

## 🚨 Common Issues & Solutions

### "Failed to verify token"
- **Cause**: Address isn't a valid ERC-20 token
- **Solution**: Double-check the address, ensure it's deployed on Monad Testnet

### "You have zero balance of this token"
- **Cause**: Token verified, but you don't own any
- **Solution**: Get some tokens first before sending!

### "Amount exceeds balance"
- **Cause**: Trying to send more than you have
- **Solution**: Use MAX button or reduce amount

### "Invalid recipient address"
- **Cause**: Address format is wrong
- **Solution**: Ensure address starts with 0x and is 42 characters

---

## 📊 Example Flow

### Scenario: Send a new token you just received

1. Someone sent you a new token (address: `0xabcd...`)
2. You want to send some to a friend
3. Token doesn't appear in your list

**Steps:**
```
1. Click "Send" button
2. Scroll to custom token input
3. Paste: 0xabcd...
4. Click "Verify Token"
5. Wait 2 seconds...
6. ✓ Shows: "XYZ Token - Balance: 1000 XYZ"
7. Click "Send XYZ"
8. Enter friend's address
9. Enter amount: 100
10. Click "Send XYZ"
11. Confirm in wallet
12. Done! ✅
```

---

## 🎯 Benefits

### For Users
- ✅ Send any token, not just MON
- ✅ No need to leave MONSEND
- ✅ Verify tokens before sending
- ✅ See balances for all tokens
- ✅ One app for all transfers

### For Developers
- ✅ Extensible token system
- ✅ Easy to add known tokens
- ✅ Secure verification flow
- ✅ Clean error handling
- ✅ Supports any ERC-20 token

---

## 🔄 Balance Refresh

Balances automatically refresh:
- After every successful transaction
- When you switch back to token selection
- When you verify a new token

No manual refresh needed! 🎉

---

## 🌟 What's Next?

Future enhancements could include:
- Token price display (USD value)
- Transaction history per token
- Token swap functionality
- QR code scanning for addresses
- Address book
- Recent recipients
- Token approval for DEX trading

---

## ✅ Summary

**Token List:**
- Shows balance on right side ✓
- Formatted to 4 decimals ✓

**Send Function:**
- Multi-token selection ✓
- Custom address input ✓
- Token verification ✓
- Green checkmark for positive balance ✓
- Supports MON + any ERC-20 ✓
- MAX button for convenience ✓
- Clear error messages ✓

**Your MONSEND wallet is now a full multi-token sender!** 🚀

