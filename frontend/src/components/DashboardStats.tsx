import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  alpha
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  WorkHistory,
  LocationCity,
  AttachMoney,
  Timeline,
  Refresh
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  subtitle?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend, subtitle }) => (
  <Card sx={{ 
    height: '100%',
    borderRadius: 3,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    }
  }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderRadius: 2,
            backgroundColor: alpha(color, 0.1),
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
      </Box>
      
      {trend !== undefined && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          {trend > 0 ? (
            <TrendingUp fontSize="small" color="success" />
          ) : (
            <TrendingDown fontSize="small" color="error" />
          )}
          <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
            {trend > 0 ? '+' : ''}{trend}%
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            vs mois dernier
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const DashboardStats: React.FC = () => {
  const stats = [
    {
      title: 'Total Employés',
      value: '156',
      icon: <People />,
      color: '#2196F3',
      trend: 12,
      subtitle: '+15 ce mois'
    },
    {
      title: 'Ancienneté Moy.',
      value: '8.2',
      icon: <WorkHistory />,
      color: '#4CAF50',
      trend: 5,
      subtitle: 'années'
    },
    {
      title: 'Villes Actives',
      value: '13',
      icon: <LocationCity />,
      color: '#FF9800',
      trend: 8,
      subtitle: 'dont 5 principales'
    },
    {
      title: 'Prime Totale',
      value: '45.2K€',
      icon: <AttachMoney />,
      color: '#9C27B0',
      trend: 18,
      subtitle: 'moyenne: 290€'
    }
  ];

  const distributionData = [
    { label: 'Paris', value: 45, color: '#2196F3' },
    { label: 'Lyon', value: 25, color: '#4CAF50' },
    { label: 'Toulouse', value: 15, color: '#FF9800' },
    { label: 'Bordeaux', value: 10, color: '#9C27B0' },
    { label: 'Autres', value: 5, color: '#607D8B' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          📊 Aperçu Global
        </Typography>
        <Tooltip title="Actualiser les données">
          <IconButton size="small" color="primary">
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Cartes de statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Distribution par ville */}
      <Card sx={{ 
        borderRadius: 3, 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        mb: 4 
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Timeline color="primary" />
            Distribution par Ville
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              {distributionData.map((item, index) => (
                <Grid item xs={12} sm={6} md={2.4} key={index}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Box sx={{ 
                      width: 60, 
                      height: 60, 
                      borderRadius: '50%', 
                      bgcolor: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 8px',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1.2rem'
                    }}>
                      {item.value}%
                    </Box>
                    <Typography variant="body2" fontWeight="medium">
                      {item.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {distributionData.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: item.color }} />
                <Typography variant="caption">{item.label}</Typography>
                <Chip label={`${item.value}%`} size="small" />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Performance */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 3, 
            height: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Performance par Service
              </Typography>
              
              {[
                { label: 'IT', value: 85, color: '#2196F3' },
                { label: 'RH', value: 70, color: '#4CAF50' },
                { label: 'Commercial', value: 60, color: '#FF9800' },
                { label: 'Marketing', value: 45, color: '#9C27B0' }
              ].map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography variant="body2" fontWeight="bold">{item.value}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.value} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      backgroundColor: alpha(item.color, 0.2),
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: item.color,
                        borderRadius: 4
                      }
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ 
            borderRadius: 3, 
            height: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Tendance d'Embauche
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                {['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'].map((month, index) => (
                  <Box key={index} sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary">{month}</Typography>
                    <Typography variant="h6" fontWeight="bold">{[12, 18, 15, 22, 25, 30][index]}</Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ 
                height: 100, 
                display: 'flex', 
                alignItems: 'flex-end',
                gap: 1,
                mt: 2
              }}>
                {[30, 45, 40, 60, 70, 85].map((height, index) => (
                  <Box
                    key={index}
                    sx={{
                      flex: 1,
                      height: `${height}%`,
                      bgcolor: 'primary.main',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease',
                      position: 'relative',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      }
                    }}
                  >
                    <Tooltip title={`${height} employés`}>
                      <Box sx={{ 
                        position: 'absolute', 
                        top: -25, 
                        width: '100%', 
                        textAlign: 'center' 
                      }}>
                        <Typography variant="caption" fontWeight="bold">{height}</Typography>
                      </Box>
                    </Tooltip>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardStats;