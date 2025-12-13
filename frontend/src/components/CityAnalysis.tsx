import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Grid, Card, CardContent,
  LinearProgress, Alert, Chip, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { employeeApi, getApiBaseUrl } from '../services/api';
import { VilleStats } from '../types/employee';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const CityAnalysis: React.FC = () => {
  const [stats, setStats] = useState<VilleStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      if (!getApiBaseUrl()) throw new Error('VITE_API_URL not configured; set it in public/config.json or in the build environment.');
      const response = await employeeApi.getVilleStats();
      setStats(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Préparer les données pour le graphique
  const chartData = stats.map(stat => ({
    ville: stat._id,
    moyenne: stat.value.avg.toFixed(1),
    variance: stat.value.variance.toFixed(2),
    seniors: (stat.value.senior_ratio * 100).toFixed(0),
    juniors: (stat.value.junior_ratio * 100).toFixed(0),
  }));

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        📊 Analyse par Ville - Mix Juniors/Seniors
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} md={6} lg={4} key={stat._id}>
            <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LocationCityIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="bold">
                    {stat._id}
                  </Typography>
                  <Chip
                    label={`${stat.value.count} employés`}
                    color="primary"
                    size="small"
                    sx={{ ml: 'auto' }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Ancienneté moyenne: <strong>{stat.value.avg.toFixed(1)} ans</strong>
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(stat.value.avg * 10, 100)} 
                    sx={{ mb: 1 }}
                  />
                </Box>

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Min
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {stat.value.min} ans
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={6}>
                    <Card variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        Max
                      </Typography>
                      <Typography variant="h6" color="error">
                        {stat.value.max} ans
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {stat.value.std_dev > 5 ? (
                    <>
                      <TrendingUpIcon color="warning" />
                      <Typography variant="body2" color="warning.main">
                        Forte variance ({stat.value.std_dev.toFixed(1)})
                      </Typography>
                    </>
                  ) : (
                    <>
                      <TrendingDownIcon color="success" />
                      <Typography variant="body2" color="success.main">
                        Variance stable ({stat.value.std_dev.toFixed(1)})
                      </Typography>
                    </>
                  )}
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${(stat.value.senior_ratio * 100).toFixed(0)}% Seniors`}
                    color="error"
                    size="small"
                  />
                  <Chip
                    icon={<PeopleIcon />}
                    label={`${(stat.value.junior_ratio * 100).toFixed(0)}% Juniors`}
                    color="info"
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        📈 Visualisation des Données
      </Typography>

      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Distribution de l'ancienneté par ville
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ville" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="moyenne" name="Ancienneté moyenne (ans)" fill="#8884d8" />
            <Bar dataKey="seniors" name="% Seniors" fill="#ff6b6b" />
            <Bar dataKey="juniors" name="% Juniors" fill="#4d96ff" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
        📋 Tableau des Statistiques Détailées
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ville</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Effectif</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Moyenne</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Min/Max</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Écart-type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Variance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((stat) => (
              <TableRow key={stat._id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationCityIcon color="action" />
                    <Typography fontWeight="medium">{stat._id}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={stat.value.count} color="primary" size="small" />
                </TableCell>
                <TableCell>
                  <Typography>{stat.value.avg.toFixed(1)} ans</Typography>
                </TableCell>
                <TableCell>
                  <Typography>
                    {stat.value.min} / {stat.value.max} ans
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={stat.value.std_dev.toFixed(2)}
                    color={stat.value.std_dev > 5 ? "warning" : "success"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography>{stat.value.variance.toFixed(2)}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CityAnalysis;