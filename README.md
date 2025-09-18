# Assistant Lab - CTF Challenge

A React-based CTF challenge that combines frontend reverse-engineering with light cryptography. Players must explore the client bundle, inspect runtime state, and perform decoding to recover the flag.

## 🎯 Challenge Overview

**Assistant Lab** appears to be a simple AI assistant demo where users can interact with a chat interface. However, hidden beneath the surface is a multi-step puzzle that requires:

1. **Static Analysis** - Inspecting the bundled JavaScript code
2. **Dynamic Debugging** - Using browser DevTools to understand runtime behavior  
3. **Cryptographic Decoding** - Reversing XOR + Base64 + ROT13 encoding
4. **Logical Reasoning** - Connecting UI interactions to hidden state changes

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Deployment
The built files can be deployed to any static hosting service (Netlify, Vercel, etc.)

## 🕵️ Player Journey

### Phase 1: Discovery
- Interact with the chat interface
- Try the example prompts: "Quantum Computing", "Creative Writing", "Data Analysis"
- Notice the mysterious badge that changes from `0x00` to other hex values
- Observe localStorage updates in DevTools

### Phase 2: Static Analysis
- Inspect the bundled JavaScript files
- Search for the `secretReveal` function in `src/utils/reveal.ts`
- Identify the obfuscated constants and encoding algorithm
- Find the encoded flag string in the reveal function

### Phase 3: Dynamic Debugging
- Use browser console to call `secretReveal()` directly
- Set breakpoints to inspect the decoding process
- Extract the XOR key (0x42) and understand the algorithm

### Phase 4: Decryption
The encoding process is: `plaintext` → XOR(0x42) → Base64 → ROT13

To decode:
1. ROT13 decode the encoded flag → Base64 string
2. Base64 decode → XOR-encoded bytes  
3. XOR decode with 0x42 → `react_ai_riddle`

**Final Flag**: `CSA{react_ai_riddle}`

## 🔧 Technical Details

### Hidden Triggers
- **Quantum Computing**: Sets `localStorage.ai_step_a = "qx7f"`
- **Creative Writing**: Sets `localStorage.ai_step_b = "m9k2"`  
- **Data Analysis**: Sets `localStorage.ai_step_c = "p3n8"`

### Secret Dashboard
- Monitors localStorage keys and displays progress
- Shows hex-like badge that updates as keys are set
- Triggers `secretReveal()` when all three keys are present

### Obfuscation Techniques
- XOR key split across variables (`xk1 = 0x42`, `xk2 = 0x00`)
- Multi-step encoding (XOR → Base64 → ROT13)
- Intentionally complex reveal function with helper methods
- Misleading variable names and comments

## 💡 Hints for Players

**Beginner**: "localStorage and DevTools are your friends"

**Intermediate**: "Search the bundle for uncommon UI strings like 'secret sync'"

**Advanced**: "The encoding uses one-byte XOR, then Base64, then ROT13"

## 🛡️ Security Lessons

This challenge demonstrates why:
- Secrets should never be stored in client-side code
- Client-side validation cannot be trusted for security
- Obfuscation is not encryption
- Browser DevTools make client-side "hiding" ineffective

## 📁 Project Structure

```
src/
├── components/
│   ├── Chat.tsx           # Main chat interface with hidden triggers
│   ├── Examples.tsx       # Example buttons that set localStorage
│   └── SecretDashboard.tsx # Badge that monitors progress
├── utils/
│   └── reveal.ts          # Obfuscated decoding logic
├── App.tsx               # Main application component
└── main.tsx              # React entry point
```

## 🎮 Difficulty Variants

### Easy Mode (Current)
- Clear function names in bundle
- Visible constants and algorithm
- Minimal obfuscation

### Hard Mode (Suggestions)
- Minify the bundle heavily
- Split constants across multiple modules
- Add red herring functions
- Use webpack aliases to obscure imports

## 🏆 Scoring

- **Discovery (25%)**: Finding the localStorage triggers
- **Static Analysis (35%)**: Locating the reveal function and algorithm
- **Dynamic Analysis (25%)**: Successfully calling the function
- **Decryption (15%)**: Correctly decoding the final flag

---

**Flag**: `CSA{react_ai_riddle}`

Good luck, and happy hacking! 🔍