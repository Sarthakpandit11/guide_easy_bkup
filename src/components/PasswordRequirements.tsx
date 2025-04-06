import React from 'react';
import { Paper, Typography, List, ListItem, ListItemIcon, ListItemText, LinearProgress } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LockIcon from '@mui/icons-material/Lock';

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const requirements = [
    {
      text: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      text: 'At least one uppercase letter',
      met: /[A-Z]/.test(password),
    },
    {
      text: 'At least one lowercase letter',
      met: /[a-z]/.test(password),
    },
    {
      text: 'At least one number',
      met: /[0-9]/.test(password),
    },
    {
      text: 'At least one special character (!@#$%^&*)',
      met: /[!@#$%^&*]/.test(password),
    },
  ];

  const metCount = requirements.filter(req => req.met).length;
  const progress = (metCount / requirements.length) * 100;

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        mt: 2,
        border: '1px solid',
        borderColor: progress === 100 ? 'success.main' : 'grey.300',
        bgcolor: progress === 100 ? 'success.light' : 'background.paper',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <LockIcon color={progress === 100 ? 'success' : 'action'} />
        <Typography variant="subtitle2" color={progress === 100 ? 'success' : 'textSecondary'}>
          Password Requirements {progress === 100 ? '(All met!)' : `(${metCount}/${requirements.length})`}
        </Typography>
      </div>
      
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ 
          height: 6, 
          borderRadius: 3,
          bgcolor: 'grey.200',
          '& .MuiLinearProgress-bar': {
            bgcolor: progress === 100 ? 'success.main' : 'primary.main',
          }
        }} 
      />

      <List dense sx={{ mt: 1 }}>
        {requirements.map((req, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              {req.met ? (
                <CheckCircleIcon color="success" fontSize="small" />
              ) : (
                <ErrorIcon color="error" fontSize="small" />
              )}
            </ListItemIcon>
            <ListItemText 
              primary={req.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '0.875rem',
                  color: req.met ? 'success.main' : 'text.secondary',
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default PasswordRequirements; 