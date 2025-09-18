import React, { useState, useRef, useEffect } from 'react'
import { 
  Box, 
  TextField, 
  IconButton, 
  Typography, 
  Paper,
  Avatar
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'

interface Message {
  id: string
  text: string
  sender: 'user' | 'assistant'
  timestamp: Date
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI assistant. Try one of the examples on the right, or ask me anything!',
      sender: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    
    // Process the input for hidden triggers
    processUserInput(input)
    
    // Generate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(input),
        sender: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)

    setInput('')
  }

  const processUserInput = (text: string) => {
    const lowerText = text.toLowerCase()
    
    // Hidden triggers that set localStorage keys
    if (lowerText.includes('explain quantum') || lowerText.includes('quantum computing')) {
      localStorage.setItem('ai_step_a', 'qx7f')
      window.dispatchEvent(new Event('storage'))
    }
    
    if (lowerText.includes('creative writing') || lowerText.includes('write a story')) {
      localStorage.setItem('ai_step_b', 'm9k2')
      window.dispatchEvent(new Event('storage'))
    }
    
    if (lowerText.includes('data analysis') || lowerText.includes('analyze data')) {
      localStorage.setItem('ai_step_c', 'p3n8')
      window.dispatchEvent(new Event('storage'))
    }
  }

  const generateResponse = (input: string): string => {
    const responses = [
      "That's a fascinating question! Let me think about that...",
      "I'd be happy to help you with that. Here's what I think...",
      "Great question! Based on my knowledge...",
      "Interesting! Let me break that down for you...",
      "I understand what you're asking. Here's my perspective...",
    ]
    
    const specificResponses: Record<string, string> = {
      'quantum': 'Quantum computing leverages quantum mechanical phenomena like superposition and entanglement to process information in ways classical computers cannot. It\'s a revolutionary field!',
      'creative': 'Creative writing is the art of crafting original stories, poems, and narratives. It allows us to explore imagination and express ideas in unique ways.',
      'data': 'Data analysis involves examining datasets to discover patterns, trends, and insights. It\'s essential for making informed decisions in our data-driven world.',
    }

    const lowerInput = input.toLowerCase()
    for (const [key, response] of Object.entries(specificResponses)) {
      if (lowerInput.includes(key)) {
        return response
      }
    }

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Chat with Assistant
      </Typography>
      
      <Box 
        className="chat-container"
        sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          mb: 2,
          pr: 1
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            className="fade-in"
            sx={{
              display: 'flex',
              mb: 2,
              justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%' }}>
              {message.sender === 'assistant' && (
                <Avatar sx={{ mr: 1, bgcolor: 'primary.main', width: 32, height: 32 }}>
                  <SmartToyIcon fontSize="small" />
                </Avatar>
              )}
              
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'grey.100',
                  color: message.sender === 'user' ? 'white' : 'text.primary',
                  borderRadius: 2,
                  maxWidth: '100%'
                }}
              >
                <Typography variant="body2">
                  {message.text}
                </Typography>
              </Paper>
              
              {message.sender === 'user' && (
                <Avatar sx={{ ml: 1, bgcolor: 'secondary.main', width: 32, height: 32 }}>
                  <PersonIcon fontSize="small" />
                </Avatar>
              )}
            </Box>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          variant="outlined"
          size="small"
        />
        <IconButton 
          onClick={handleSend}
          disabled={!input.trim()}
          color="primary"
          sx={{ alignSelf: 'flex-end' }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default Chat