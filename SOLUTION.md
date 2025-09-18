# Assistant Lab CTF - Complete Solution

## 🎯 Challenge Solution Walkthrough

### Step 1: Initial Exploration
1. Visit the Assistant Lab application
2. Notice the "Secret Dashboard" badge showing `0x00 sync`
3. Try interacting with the chat and example buttons

### Step 2: Discover Hidden Triggers
1. Click the three example buttons or type the prompts:
   - "Explain quantum computing basics" → Sets `ai_step_a = "qx7f"`
   - "Help with creative writing" → Sets `ai_step_b = "m9k2"`  
   - "Analyze data patterns" → Sets `ai_step_c = "p3n8"`

2. Watch the badge change as you trigger each one:
   - After 1st: `0x11 sync`
   - After 2nd: `0x22 sync` 
   - After 3rd: Badge glows and shows first 8 chars of decoded result

### Step 3: Inspect localStorage
Open DevTools → Application → Local Storage:
```
ai_step_a: "qx7f"
ai_step_b: "m9k2"
ai_step_c: "p3n8"
```

### Step 4: Find the Reveal Function
1. Open DevTools → Sources
2. Look for bundled JS files (usually `assets/index-[hash].js`)
3. Search for "secretReveal" or "reveal" or unique strings like "Missing required keys"
4. Find the `secretReveal` function in the bundle

### Step 5: Static Analysis
Examine the reveal function code:
```typescript
// XOR key split across variables
const xk1 = 0x42
const xk2 = 0x00  
const xorKey = xk1 ^ xk2 // Results in 0x42

// The encoded flag (dynamically calculated)
const encodedFlag = rot13Encoded // Calculated from "react_ai_riddle"
```

### Step 6: Call the Function
In the browser console:
```javascript
// Import and call the function
import('./src/utils/reveal.js').then(module => {
  console.log(module.secretReveal())
})

// Or if already loaded:
secretReveal()
```

### Step 7: Manual Decoding (Alternative)
If you want to decode manually:

```javascript
// Step 1: ROT13 decode
function rot13(str) {
  return str.replace(/[a-zA-Z]/g, char => {
    const start = char <= 'Z' ? 65 : 97
    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start)
  })
}

// Step 2: Base64 decode  
function b64decode(str) {
  return atob(str)
}

// Step 3: XOR decode
function xorDecode(str, key) {
  return str.split('').map(char => 
    String.fromCharCode(char.charCodeAt(0) ^ key)
  ).join('')
}

// Full decode process - get the encoded flag from the reveal function first
// Then decode it step by step:
// const rot13Decoded = rot13(encodedFlag)        
// const base64Decoded = b64decode(rot13Decoded) 
// const final = xorDecode(base64Decoded, 0x42)  // "react_ai_riddle"

console.log('Flag:', `CSA{${final}}`)
```

## 🔍 Key Discovery Points

### localStorage Triggers
- **Quantum prompt**: `ai_step_a = "qx7f"`
- **Creative prompt**: `ai_step_b = "m9k2"`
- **Data prompt**: `ai_step_c = "p3n8"`

### Encoding Algorithm
1. **Plaintext**: `react_ai_riddle`
2. **XOR with 0x42**: `[0x10, 0x25, 0x23, 0x21, 0x20, 0x6b, ...]`
3. **Base64 encode**: `ECUjISBrIydrECckJCwl`
4. **ROT13 encode**: `RPHwVFOeVlkeRPxxWPjy`

### Decoding Process
1. **ROT13 decode**: encoded flag → Base64 string
2. **Base64 decode**: Base64 string → XOR-encoded bytes
3. **XOR decode (key=0x42)**: XOR-encoded bytes → `react_ai_riddle`

## 🏁 Final Answer

**Flag**: `CSA{react_ai_riddle}`

## 🛠️ Tools Used
- Browser DevTools (Application, Console, Sources)
- JavaScript console for function calls
- Static analysis of bundled code
- localStorage inspection

## 💡 Learning Outcomes
- Client-side secrets are never truly hidden
- Browser DevTools are powerful for reverse engineering
- Multiple encoding layers don't provide real security
- Static analysis combined with dynamic testing is effective

## 🎓 Advanced Techniques
- Setting breakpoints in the reveal function
- Modifying localStorage values directly
- Using browser debugger to step through code
- Network tab analysis for understanding app structure