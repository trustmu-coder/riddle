import { Container, Box, Typography, Paper } from '@mui/material'
import Chat from './components/Chat'
import Examples from './components/Examples'
import SecretDashboard from './components/SecretDashboard'

function App() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Assistant Lab
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Explore our AI assistant demo - try the examples below or ask your own questions
        </Typography>
        <SecretDashboard />
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, height: '500px' }}>
            <Chat />
          </Paper>
        </Box>
        
        <Box sx={{ width: { xs: '100%', md: '300px' } }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Examples />
          </Paper>
        </Box>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Assistant Lab v1.0 - Powered by Advanced AI
        </Typography>
      </Box>
    </Container>
  )
}

export default App
