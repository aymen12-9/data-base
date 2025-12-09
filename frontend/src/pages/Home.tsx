import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SearchIcon from '@mui/icons-material/Search';
import BarChartIcon from '@mui/icons-material/BarChart';

const Home: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          px: 4,
          borderRadius: 2,
          mb: 6,
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
          🏢 MongoDB Employees Manager
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          Master SSII - Gestion et Analyse des Données Employés avec MongoDB
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
          Application complète pour la gestion, l'analyse et la visualisation des données employés
          avec des fonctionnalités avancées de MapReduce et d'analytics.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          size="large"
          component={Link}
          to="/employees"
          sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
        >
          Commencer l'Exploration
        </Button>
      </Box>

      {/* Features Grid */}
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', fontWeight: 'bold' }}>
        Fonctionnalités Principales
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <PeopleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Gestion Employés
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Visualisez, ajoutez et gérez tous les employés avec leurs informations complètes
                (nom, prénom, ancienneté, prime, adresse).
              </Typography>
              <Button
                component={Link}
                to="/employees"
                variant="outlined"
                color="primary"
                fullWidth
              >
                Voir les Employés
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <AnalyticsIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Analytics Avancés
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Analysez les données avec nos algorithmes MapReduce : statistiques par ville,
                détection de doublons, et mesures robustes.
              </Typography>
              <Button
                component={Link}
                to="/analytics"
                variant="outlined"
                color="success"
                fullWidth
              >
                Explorer Analytics
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <SearchIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Requêtes MongoDB
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Exécutez toutes les requêtes MongoDB demandées : filtrage par nom, ancienneté,
                regroupement par ville, et plus encore.
              </Typography>
              <Button
                component={Link}
                to="/admin"
                variant="outlined"
                color="warning"
                fullWidth
              >
                Exécuter Requêtes
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <BarChartIcon sx={{ fontSize: 60, color: 'info.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom fontWeight="bold">
                Visualisations
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Graphiques interactifs et tableaux de bord pour une analyse visuelle des données
                et des tendances.
              </Typography>
              <Button
                component={Link}
                to="/analytics"
                variant="outlined"
                color="info"
                fullWidth
              >
                Voir Graphiques
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* MapReduce Section */}
      <Box sx={{ bgcolor: 'grey.50', p: 4, borderRadius: 2, mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          🚀 Algorithmes MapReduce Implémentés
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom fontWeight="bold">
                  1. Statistiques par Ville
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Objectif :</strong> Identifier les villes avec une forte variance d'ancienneté
                  (mix juniors/seniors).
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Mesures calculées :</strong> Count, Sum, Average, Min, Max, Variance,
                  Écart-type, Ratio Seniors/Juniors.
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  Cet algorithme permet d'analyser la distribution de l'ancienneté par ville
                  et d'identifier les équipes équilibrées vs. déséquilibrées.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" color="error" gutterBottom fontWeight="bold">
                  2. Détection de Doublons
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Objectif :</strong> Détecter les employés avec même nom+prénom mais
                  adresses différentes.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Fonctionnalités :</strong> Regroupement par nom complet, comparaison
                  des adresses, alertes visuelles pour les incohérences.
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  Cet algorithme aide à nettoyer la base de données et à maintenir l'intégrité
                  des informations.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Home;