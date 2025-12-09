import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Alert,
  Grid,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import StatsDashboard from '../components/StatsDashboard';
import CityAnalysis from '../components/CityAnalysis';
import DuplicateDetection from '../components/DuplicateDetection';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import MapIcon from '@mui/icons-material/Map';
import WarningIcon from '@mui/icons-material/Warning';
import BarChartIcon from '@mui/icons-material/BarChart';

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
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
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

const Analytics: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const tabs = [
    {
      label: 'Tableau de Bord',
      icon: <BarChartIcon />,
      component: <StatsDashboard />
    },
    {
      label: 'Analyse par Ville',
      icon: <MapIcon />,
      component: <CityAnalysis />
    },
    {
      label: 'Détection Doublons',
      icon: <WarningIcon />,
      component: <DuplicateDetection />
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
          📈 Analytics Avancés
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
          Utilisez les algorithmes MapReduce pour analyser vos données employés.
          Identifiez les tendances, détectez les anomalies et prenez des décisions éclairées.
        </Typography>
      </Box>

      {/* Info Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'primary.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <AnalyticsIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  Algorithmes MapReduce
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Deux algorithmes puissants implémentés pour analyser vos données MongoDB
                en temps réel.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'success.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MapIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  Analyse par Ville
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Statistiques robustes par ville : moyenne, variance, min/max,
                et analyse seniors/juniors.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: 'warning.main',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <WarningIcon sx={{ color: 'white' }} />
                </Box>
                <Typography variant="h6" fontWeight="bold">
                  Qualité des Données
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Détection automatique des doublons potentiels pour maintenir
                l'intégrité de votre base.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Algorithm Info */}
      <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          ℹ️ À propos des algorithmes MapReduce
        </Typography>
        <Typography variant="body2">
          Les algorithmes MapReduce s'exécutent directement sur MongoDB pour traiter de grandes quantités de données.
          Ils permettent des analyses complexes comme le calcul de statistiques par ville et la détection de doublons
          avec une performance optimale.
        </Typography>
      </Alert>

      {/* Loading State */}
      {loading && (
        <Box sx={{ mb: 3 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
            Chargement des données d'analyse...
          </Typography>
        </Box>
      )}

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
            {tab.component}
          </TabPanel>
        ))}
      </Paper>

      {/* Footer Note */}
      <Alert severity="success" sx={{ mt: 4, borderRadius: 2 }}>
        <Typography variant="body2">
          <strong>💡 Conseil :</strong> Utilisez ces analyses pour identifier les villes avec un bon équilibre
          juniors/seniors, détecter les doublons dans votre base de données, et prendre des décisions
          stratégiques basées sur des données.
        </Typography>
      </Alert>
    </Box>
  );
};

export default Analytics;