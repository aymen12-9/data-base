import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

const DashboardCards: React.FC = () => {
  const theme = useTheme();

  const stats = [
    {
      title: 'Effectif Total',
      value: '19',
      subtitle: 'Employés',
      icon: <PeopleIcon />,
      progress: 85
    },
    {
      title: 'Ancienneté Moyenne',
      value: '8.2 ans',
      subtitle: 'Moyenne générale',
      icon: <WorkIcon />,
      progress: 72
    },
    {
      title: 'Villes',
      value: '13',
      subtitle: 'Villes actives',
      icon: <LocationIcon />,
      progress: 65
    },
    {
      title: 'Budget Primes',
      value: '14.3K€',
      subtitle: 'Total annuel',
      icon: <MoneyIcon />,
      progress: 90
    }
  ];

  return (
    <Box>
      <Typography variant="h5" sx={{ 
        fontWeight: 600, 
        color: theme.palette.text.primary, 
        mb: 3 
      }}>
        Vue d'ensemble
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 25px rgba(0,0,0,0.4)'
                  : '0 8px 25px rgba(99, 102, 241, 0.12)'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 2,
                    bgcolor: theme.palette.primary.light + '20',
                    color: theme.palette.primary.main,
                    mr: 2
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700, 
                      color: theme.palette.text.primary 
                    }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: theme.palette.text.secondary 
                    }}>
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="caption" sx={{ 
                  color: theme.palette.primary.main, 
                  display: 'block', 
                  mb: 1,
                  fontWeight: 500
                }}>
                  {stat.subtitle}
                </Typography>

                <LinearProgress 
                  variant="determinate" 
                  value={stat.progress} 
                  sx={{ 
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: theme.palette.action.disabledBackground,
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 3
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardCards;