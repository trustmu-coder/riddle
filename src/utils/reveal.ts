// Secret reveal function - obfuscated for CTF challenge
// This function combines localStorage keys and decodes them to reveal the flag

const k1 = 'ai_step_a'
const k2 = 'ai_step_b' 
const k3 = 'ai_step_c'

// XOR key split across variables to make it less obvious
const xk1 = 0x42
const xk2 = 0x00
const xorKey = xk1 ^ xk2 // Results in 0x42 (66 in decimal)

// Base64 decode helper
const b64decode = (str: string): string => {
  try {
    return atob(str)
  } catch {
    return ''
  }
}

// ROT13 decode helper  
const rot13decode = (str: string): string => {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const start = char <= 'Z' ? 65 : 97
    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start)
  })
}

// XOR decode helper
const xorDecode = (data: Uint8Array, key: number): Uint8Array => {
  return data.map(byte => byte ^ key)
}

// String to bytes
const strToBytes = (str: string): Uint8Array => {
  return new Uint8Array([...str].map(c => c.charCodeAt(0)))
}

// Bytes to string
const bytesToStr = (bytes: Uint8Array): string => {
  return String.fromCharCode(...bytes)
}

// Main reveal function - intentionally obfuscated
export const secretReveal = (): string => {
  // Get the three localStorage keys
  const v1 = localStorage.getItem(k1) || ''
  const v2 = localStorage.getItem(k2) || ''
  const v3 = localStorage.getItem(k3) || ''
  
  if (!v1 || !v2 || !v3) {
    throw new Error('Missing required keys')
  }
  
  // Concatenate the values
  const combined = v1 + v2 + v3 // "qx7fm9k2p3n8"
  
  // The encoded flag is hidden here - this would be the result of encoding "react_ai_riddle"
  // Process: "react_ai_riddle" -> XOR with 0x42 -> Base64 encode -> ROT13
  // Working backwards: ROT13 decode -> Base64 decode -> XOR decode with 0x42
  
  // This is the pre-encoded flag (ROT13 of Base64 of XOR-encoded "react_ai_riddle")
  // Let's calculate this step by step:
  // "react_ai_riddle" XOR 0x42 = [0x10, 0x25, 0x23, 0x21, 0x20, 0x6b, 0x23, 0x27, 0x6b, 0x10, 0x27, 0x24, 0x24, 0x2c, 0x25]
  // Base64 encode those bytes = "ECUjISBrIydrECckJCwl"  
  // ROT13 encode = "RPHwVFOeVlkeRPxxWPjy"
  
  // Actually, let's encode it properly:
  const plaintext = 'react_ai_riddle'
  const xorEncoded = [...plaintext].map(c => c.charCodeAt(0) ^ 0x42)
  const base64Encoded = btoa(String.fromCharCode(...xorEncoded))
  const rot13Encoded = base64Encoded.replace(/[a-zA-Z]/g, (char) => {
    const start = char <= 'Z' ? 65 : 97
    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start)
  })
  
  const encodedFlag = rot13Encoded
  
  // Check if we have the right combination (simple validation)
  if (combined === 'qx7fm9k2p3n8') {
    try {
      // Step 1: ROT13 decode
      const rot13Decoded = rot13decode(encodedFlag)
      
      // Step 2: Base64 decode
      const base64Decoded = b64decode(rot13Decoded)
      
      // Step 3: XOR decode with key 0x42
      const xorDecoded = xorDecode(strToBytes(base64Decoded), xorKey)
      
      // Convert back to string
      const finalResult = bytesToStr(xorDecoded)
      
      return finalResult
    } catch (error) {
      console.error('Decoding failed:', error)
      return 'decode_error'
    }
  }
  
  // Return obfuscated partial result for wrong combinations
  return combined.split('').reverse().join('').toUpperCase()
}