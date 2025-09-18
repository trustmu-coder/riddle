import React, { useState, useEffect } from 'react'
import { Box, Chip, Tooltip, Typography } from '@mui/material'
import SecurityIcon from '@mui/icons-material/Security'
import { secretReveal } from '../utils/reveal'

const SecretDashboard: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<string>('pending')
  const [badgeText, setBadgeText] = useState<string>('0x00')
  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    const checkStorageKeys = () => {
      const stepA = localStorage.getItem('ai_step_a')
      const stepB = localStorage.getItem('ai_step_b')
      const stepC = localStorage.getItem('ai_step_c')

      if (stepA && stepB && stepC) {
        // All keys present - trigger the secret reveal
        try {
          const result = secretReveal()
          setBadgeText(result.slice(0, 8)) // Show first 8 chars as hex-like
          setSyncStatus('active')
          setIsActive(true)
          
          // Log the full result to console for debugging (hidden from UI)
          console.log('🔐 Secret revealed:', result)
        } catch (error) {
          console.error('Reveal error:', error)
          setBadgeText('0xERR')
          setSyncStatus('error')
        }
      } else {
        // Calculate partial progress
        const keys = [stepA, stepB, stepC].filter(Boolean)
        if (keys.length > 0) {
          setBadgeText(`0x${keys.length}${keys.length}`)
          setSyncStatus('syncing')
          setIsActive(false)
        } else {
          setBadgeText('0x00')
          setSyncStatus('pending')
          setIsActive(false)
        }
      }
    }

    // Check on mount
    checkStorageKeys()

    // Listen for storage changes
    const handleStorageChange = () => {
      checkStorageKeys()
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Also listen for custom events (for same-tab changes)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'active': return 'success'
      case 'syncing': return 'warning'
      case 'error': return 'error'
      default: return 'default'
    }
  }

  const getTooltipText = () => {
    switch (syncStatus) {
      case 'active': return 'Secret sync complete - all systems operational'
      case 'syncing': return 'Secret sync in progress - partial data received'
      case 'error': return 'Secret sync error - check console for details'
      default: return 'Secret sync pending - awaiting initialization'
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
      <Tooltip title={getTooltipText()} arrow>
        <Chip
          icon={<SecurityIcon />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" component="span">
                {badgeText}
              </Typography>
              <Typography variant="caption" component="span" sx={{ opacity: 0.7 }}>
                sync
              </Typography>
            </Box>
          }
          color={getStatusColor()}
          variant={isActive ? 'filled' : 'outlined'}
          className={isActive ? 'pulse-glow' : ''}
          sx={{
            fontFamily: 'monospace',
            '& .MuiChip-label': {
              fontWeight: 500
            }
          }}
        />
      </Tooltip>
    </Box>
  )
}

export default SecretDashboard