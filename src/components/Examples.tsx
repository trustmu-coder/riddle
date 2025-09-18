import React from 'react'
import { Box, Typography, Button, Chip } from '@mui/material'
import ScienceIcon from '@mui/icons-material/Science'
import CreateIcon from '@mui/icons-material/Create'
import AnalyticsIcon from '@mui/icons-material/Analytics'

const Examples: React.FC = () => {
  const examples = [
    {
      id: 'quantum',
      title: 'Quantum Computing',
      description: 'Explain quantum computing basics',
      icon: <ScienceIcon />,
      color: 'primary' as const,
      storageKey: 'ai_step_a',
      storageValue: 'qx7f'
    },
    {
      id: 'creative',
      title: 'Creative Writing',
      description: 'Help with creative writing',
      icon: <CreateIcon />,
      color: 'secondary' as const,
      storageKey: 'ai_step_b',
      storageValue: 'm9k2'
    },
    {
      id: 'data',
      title: 'Data Analysis',
      description: 'Analyze data patterns',
      icon: <AnalyticsIcon />,
      color: 'success' as const,
      storageKey: 'ai_step_c',
      storageValue: 'p3n8'
    }
  ]

  const handleExampleClick = (example: typeof examples[0]) => {
    // Set the localStorage key
    localStorage.setItem(example.storageKey, example.storageValue)
    
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'))
    
    // Simulate clicking in the chat
    const chatInput = document.querySelector('textarea') as HTMLTextAreaElement
    if (chatInput) {
      chatInput.value = example.description
      chatInput.focus()
      
      // Trigger the send button click after a short delay
      setTimeout(() => {
        const sendButton = document.querySelector('[aria-label="send"]') as HTMLButtonElement
        if (sendButton) {
          sendButton.click()
        }
      }, 100)
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Try These Examples
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Click any example to get started
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {examples.map((example) => (
          <Button
            key={example.id}
            variant="outlined"
            color={example.color}
            startIcon={example.icon}
            onClick={() => handleExampleClick(example)}
            sx={{
              p: 2,
              textAlign: 'left',
              justifyContent: 'flex-start',
              textTransform: 'none',
              '&:hover': {
                transform: 'translateY(-2px)',
                transition: 'transform 0.2s ease'
              }
            }}
          >
            <Box>
              <Typography variant="subtitle2" component="div">
                {example.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {example.description}
              </Typography>
            </Box>
          </Button>
        ))}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Status Indicators
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip 
            label="System Ready" 
            color="success" 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            label="AI Online" 
            color="primary" 
            size="small" 
            variant="outlined" 
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Examples