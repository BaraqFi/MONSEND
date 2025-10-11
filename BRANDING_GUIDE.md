# MONSEND Branding & Graphics Guide

## 🎨 Required Images for Your App

### 1. **Feed/Embed Image** 📱
**File:** `public/images/feed.png`  
**Size:** 3:2 aspect ratio (recommended: 1200x800px)  
**Where it appears:** When someone shares your MONSEND app link in Farcaster feed or chat  
**Current status:** Generic placeholder

**What to create:**
- Eye-catching hero image with MONSEND branding
- Should show the app's purpose (sending MON tokens)
- Include tagline: "Send MON on Monad Testnet"
- Use your purple theme (#9333ea)
- Make it visually distinct and professional

**Design suggestions:**
```
┌─────────────────────────────────┐
│                                 │
│        💜 MONSEND 💜           │
│   Send MON tokens instantly     │
│                                 │
│   [Icon/Illustration]           │
│   Fast • Simple • Secure        │
│                                 │
└─────────────────────────────────┘
```

---

### 2. **Splash Screen Icon** 🚀
**File:** `public/images/splash.png`  
**Size:** 200x200px (square, transparent background)  
**Where it appears:** First thing users see when launching your Mini App  
**Current status:** Generic placeholder

**What to create:**
- Clean, simple icon/logo for MONSEND
- Should be recognizable at small sizes
- Transparent background (PNG)
- Consider: "M" lettermark, send arrow icon, or combination

**Design suggestions:**
- Option A: Stylized "M" with an arrow/send symbol
- Option B: Monad colors + send/transfer icon
- Option C: Envelope/package icon representing "send"
- Keep it simple - it's shown briefly during load

**Color palette:**
- Primary: Purple (#9333ea, #7e22ce)
- Accent: Blue gradient (#3b82f6)
- Background: Transparent

---

### 3. **App Icon** 📲
**File:** `public/images/icon.png`  
**Size:** 512x512px (square, can be rounded)  
**Where it appears:** When saved/bookmarked by users, various Farcaster UI elements  
**Current status:** Generic placeholder

**What to create:**
- Same design as splash screen but higher resolution
- Should work as a standalone app icon
- Can have subtle background color or gradient

---

### 4. **In-App Wallet Icon** 👛
**Current:** Emoji `👛`  
**Location:** `components/Home/Wallet.tsx` (lines 55, 120)  
**Recommendation:** Replace with custom MONSEND logo

**What to do:**
- Create SVG version of your logo
- Import and use instead of emoji
- Makes app feel more professional

**Example implementation:**
```tsx
// Instead of:
<span className="text-4xl">👛</span>

// Use:
<img src="/images/monsend-logo.svg" alt="MONSEND" className="w-12 h-12" />
```

---

## 🎯 Branding Checklist

### Critical (User-Facing):
- [ ] **Feed Image** - First impression in Farcaster
- [ ] **Splash Icon** - Loading screen logo
- [ ] **App Icon** - For bookmarks/saves

### Nice-to-Have:
- [ ] **In-App Logo** - Replace wallet emoji
- [ ] **Empty State Illustrations** - For no transactions/tokens
- [ ] **OG Image** - For web sharing (same as feed image)

---

## 🎨 MONSEND Brand Identity

### Current Theme:
- **Primary Color:** Purple (`#9333ea`, `#7e22ce`)
- **Background:** Dark Navy (`#0f0f23`, `#16162e`)
- **Accent:** Purple/Blue gradient
- **Typography:** Bold, modern, clean

### Logo Concept Ideas:

**Option 1: Text + Arrow**
```
MONSEND →
```
Simple wordmark with forward arrow

**Option 2: Lettermark**
```
┌───────┐
│   M   │  (Stylized M with arrow element)
│  →    │
└───────┘
```

**Option 3: Icon + Text**
```
[📤] MONSEND
```
Send icon + wordmark

**Option 4: Abstract**
- Circular shape representing Monad
- Arrow/send symbol integrated
- Modern, tech-forward feel

---

## 🛠️ How to Implement

### Step 1: Create Your Images
Use tools like:
- **Figma** (free, professional)
- **Canva** (easy templates)
- **Adobe Illustrator** (advanced)
- **Pixelmator** (Mac)

### Step 2: Export Correctly
```
feed.png     → 1200x800px, PNG
splash.png   → 200x200px, PNG with transparency
icon.png     → 512x512px, PNG
```

### Step 3: Replace Files
Just drop your new images into `public/images/` with the same names:
```bash
public/images/
  ├── feed.png      # Replace this
  ├── splash.png    # Replace this
  └── icon.png      # Replace this
```

### Step 4: Optional - Add Logo
If creating a custom logo:
```bash
public/images/
  └── monsend-logo.svg  # Add this
```

Then update `Wallet.tsx` to use it.

---

## 📐 Design Specifications

### Feed Image (1200x800px)
```
Background: Purple gradient
Foreground: MONSEND wordmark
Subtitle: "Send MON tokens on Monad Testnet"
Style: Clean, modern, professional
Format: PNG or JPG
```

### Splash/App Icon (200x200px & 512x512px)
```
Style: Minimal, iconic
Format: PNG with transparency
Colors: Purple primary, can use gradients
Must work at small sizes (look good as 32x32)
```

---

## 🎨 Quick Design Tips

1. **Keep It Simple**
   - Icons should be recognizable at any size
   - Avoid too much detail in small icons

2. **Consistent Colors**
   - Stick to purple theme (#9333ea)
   - Use Monad brand colors if possible

3. **Professional Look**
   - No clipart or generic stock images
   - Custom > Template, but template > nothing

4. **Test At Different Sizes**
   - Feed image: View on mobile
   - Splash icon: Test at 50px, 100px, 200px
   - Should be legible at all sizes

---

## 🌟 Brand Personality

**MONSEND should feel:**
- ✅ Fast & Efficient (it's about sending)
- ✅ Simple & Clean (not cluttered)
- ✅ Modern & Tech-forward (blockchain app)
- ✅ Trustworthy (handling money)
- ✅ Part of Monad ecosystem (purple theme)

**Avoid:**
- ❌ Too playful/casual (handling real value)
- ❌ Overly complex (defeats "simple send" purpose)
- ❌ Generic crypto symbols (BTC/ETH logos)

---

## 🔄 Update Splash Background Color

Currently your splash uses `#f7f7f7` (light gray). Consider updating to match your purple theme:

**Update in `app/page.tsx`:**
```typescript
splashBackgroundColor: '#16162e',  // Dark purple instead of gray
```

---

## 📱 Preview Your Changes

After updating images:
1. Clear browser cache
2. Restart dev server: `pnpm dev`
3. Test in Farcaster Embed tool
4. Check on actual mobile device if possible

---

## 🎁 Need Help?

### Design Resources:
- **Figma Community**: Search for "crypto app icon" templates
- **Flaticon**: Free icon resources
- **Undraw**: Free illustrations (if needed)
- **Noun Project**: Simple icon concepts

### Color Palette Generator:
- Use your purple (#9333ea) as base
- Generate complementary colors
- Keep it cohesive with existing UI

---

## 🚀 Priority Order

If you're creating images one at a time:

1. **Splash Icon** (200x200px) - Most visible, appears every launch
2. **Feed Image** (1200x800px) - Marketing/sharing
3. **App Icon** (512x512px) - Can reuse splash design
4. **In-App Logo** (SVG) - Nice polish

---

## 💡 Quick Start Option

**Can't design right now?** No problem!

Use a simple text-based approach:
1. Create purple background images with "MONSEND" text
2. Use free online tools like:
   - **Canva** → "Social Media Post" → Customize
   - **PlaceIt** → "App Icon Maker"
   - **Hatchful** (Shopify) → Free logo maker

Even a simple purple square with "MONSEND" text is better than generic placeholders!

---

## ✅ Summary

**What you need:**
- Feed image (1200x800px) - for sharing
- Splash icon (200x200px) - for loading screen  
- App icon (512x512px) - for bookmarks

**Style:**
- Purple theme (#9333ea)
- Simple and clean
- Professional but friendly

**Where to put them:**
- `public/images/` folder
- Replace existing placeholder files

Your MONSEND branding will make the app feel polished and professional! 🚀

