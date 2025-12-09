import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Paper,
  Alert,
  Button,
  IconButton,
  Tooltip,
  LinearProgress
} from '@mui/material';
import EmployeeList from '../components/EmployeeList';
import EmployeeForm from '../components/EmployeeForm';
import StatsDashboard from '../components/StatsDashboard';
import RefreshIcon from '@mui/icons-material/Refresh';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { employeeApi } from '../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`employees-tabpanel-${index}`}
      aria-labelledby={`employees-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Employees: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Simuler un rafraîchissement
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Données rafraîchies avec succès !');
      
      // Cacher le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError('Erreur lors du rafraîchissement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleIncrementPrime = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await employeeApi.incrementPrime(200);
      setSuccess(`Prime incrémentée pour ${response.data.message.split(' ').pop()} employés !`);
      
      // Cacher le message de succès après 3 secondes
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError('Erreur lors de l\'incrémentation des primes');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      label: 'Liste des Employés',
      icon: <PeopleIcon />,
      component: <EmployeeList />
    },
    {
      label: 'Ajouter un Employé',
      icon: <PersonAddIcon />,
      component: <EmployeeForm />
    },
    {
      label: 'Statistiques',
      icon: <AnalyticsIcon />,
      component: <StatsDashboard />
    }
  ];

  return (
    <Box>
      {/* Header avec actions */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
              👥 Gestion des Employés
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
              Gérez votre base de données d'employés, ajoutez de nouveaux membres,
              visualisez les statistiques et effectuez des opérations de maintenance.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Rafraîchir les données">
              <IconButton 
                onClick={handleRefresh} 
                color="primary"
                disabled={loading}
                sx={{ 
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' }
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="contained"
              color="secondary"
              onClick={handleIncrementPrime}
              disabled={loading}
              startIcon={<AnalyticsIcon />}
              sx={{ px: 3 }}
            >
              Incrémenter Primes
            </Button>
          </Box>
        </Box>

        {/* Messages d'état */}
        {loading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
          </Box>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            ✅ {success}
          </Alert>
        )}

        {/* Quick Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'primary.light', color: 'white' }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Requêtes MongoDB Implémentées
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                13
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'success.light', color: 'white' }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Algorithmes MapReduce
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                2
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2, bgcolor: 'warning.light', color: 'white' }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Opérations Disponibles
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                15+
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2,
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '& .MuiSvgIcon-root': {
                    color: 'white'
                  }
                }
              }}
            />
          ))}
        </Tabs>

        {/* Tab Content */}
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={tabValue} index={index}>
            <Box sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
              {tab.component}
            </Box>
          </TabPanel>
        ))}
      </Paper>

      {/* Informations supplémentaires */}
      <Alert severity="info" sx={{ mt: 4, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          📋 Liste des Requêtes MongoDB Disponibles
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Toutes les requêtes demandées sont implémentées : Afficher collections, compter documents,
          filtrer par prénom (commence par D, 6 caractères), filtrer par ancienneté ({'>'}10 ans),
          trouver avec attribut rue, incrémenter primes, regrouper par ville (Toulouse),
          rechercher par prénom (M) et ville (Bordeaux/Paris), et plus encore.
        </Typography>
      </Alert>
    </Box>
  );
};

export default Employees;