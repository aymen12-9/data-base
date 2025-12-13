import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PeopleIcon from '@mui/icons-material/People';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import InsightsIcon from '@mui/icons-material/Insights';
import { employeeApi, getApiBaseUrl } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatsDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    averageSeniority: 0,
    totalCities: 0,
    totalPrime: 0,
    employeesWithPrime: 0,
    seniorEmployees: 0,
    cityDistribution: [] as any[],
    seniorityDistribution: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      if (!getApiBaseUrl()) {
        throw new Error('VITE_API_URL not configured; set it in public/config.json or in the build environment (netlify.toml).');
      }
      const employeesResponse = await employeeApi.getAllEmployees();
      const employees = employeesResponse.data;
      
      // Calcul des statistiques
      const totalEmployees = employees.length;
      const totalSeniority = employees.reduce((sum: number, emp: any) => sum + (emp.anciennete || 0), 0);
      const averageSeniority = totalEmployees > 0 ? totalSeniority / totalEmployees : 0;
      
      const cities = new Set(employees.map((emp: any) => emp.adresse?.ville).filter(Boolean));
      const totalCities = cities.size;
      
      const totalPrime = employees.reduce((sum: number, emp: any) => sum + (emp.prime || 0), 0);
      const employeesWithPrime = employees.filter((emp: any) => emp.prime > 0).length;
      const seniorEmployees = employees.filter((emp: any) => emp.anciennete > 10).length;
      
      // Distribution par ville
      const cityCounts: { [key: string]: number } = {};
      employees.forEach((emp: any) => {
        const city = emp.adresse?.ville || 'Non spécifiée';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      });
      
      const cityDistribution = Object.entries(cityCounts).map(([name, value]) => ({
        name: name,
        value: value,
        percentage: Math.round((value / totalEmployees) * 100)
      })).sort((a, b) => b.value - a.value).slice(0, 5);
      
      // Distribution par ancienneté
      const seniorityRanges = [
        { range: '0-2 ans', min: 0, max: 2 },
        { range: '3-5 ans', min: 3, max: 5 },
        { range: '6-10 ans', min: 6, max: 10 },
        { range: '11-15 ans', min: 11, max: 15 },
        { range: '15+ ans', min: 16, max: Infinity }
      ];
      
      const seniorityDistribution = seniorityRanges.map(range => {
        const count = employees.filter((emp: any) => 
          emp.anciennete >= range.min && emp.anciennete <= range.max
        ).length;
        return {
          name: range.range,
          value: count,
          percentage: Math.round((count / totalEmployees) * 100)
        };
      });
      
      setStats({
        totalEmployees,
        averageSeniority,
        totalCities,
        totalPrime,
        employeesWithPrime,
        seniorEmployees,
        cityDistribution,
        seniorityDistribution
      });
      
      setError(null);
    } catch (err: any) {
      const msg = err?.message || 'Erreur lors du chargement des statistiques';
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          📊 Tableau de Bord des Statistiques
        </Typography>
        <Tooltip title="Rafraîchir les données">
          <IconButton onClick={fetchStats} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Total Employés
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {stats.totalEmployees}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                dans la base de données
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkHistoryIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Ancienneté Moy.
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                {stats.averageSeniority.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                années d'expérience
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationCityIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Villes
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                {stats.totalCities}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                villes différentes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoneyIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Prime Totale
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                {stats.totalPrime.toLocaleString()}€
              </Typography>
              <Typography variant="body2" color="text.secondary">
                distribuée à {stats.employeesWithPrime} employés
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Distribution par ville */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationCityIcon color="primary" />
                Top 5 Villes par Effectif
              </Typography>
              
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.cityDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stats.cityDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              
              <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Ville</TableCell>
                      <TableCell align="right">Effectif</TableCell>
                      <TableCell align="right">Pourcentage</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.cityDistribution.map((city, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                            {city.name}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Chip label={city.value} size="small" />
                        </TableCell>
                        <TableCell align="right">
                          <Typography color="primary" fontWeight="medium">
                            {city.percentage}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Distribution par ancienneté */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2, boxShadow: 3, height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkHistoryIcon color="primary" />
                Distribution par Ancienneté
              </Typography>
              
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.seniorityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="value" name="Nombre d'employés" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                {stats.seniorityDistribution.map((range, index) => (
                  <Grid item xs={6} key={index}>
                    <Card variant="outlined" sx={{ p: 1.5 }}>
                      <Typography variant="body2" color="text.secondary">
                        {range.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="h6" color="primary">
                          {range.value}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {range.percentage}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={range.percentage} 
                        sx={{ mt: 1 }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Stats détaillées */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <InsightsIcon color="primary" />
                Statistiques Détaillées
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Employés avec prime
                    </Typography>
                    <Typography variant="h4" color="success.main" sx={{ my: 1 }}>
                      {stats.employeesWithPrime}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {((stats.employeesWithPrime / stats.totalEmployees) * 100).toFixed(1)}% du total
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Employés seniors (10+ ans)
                    </Typography>
                    <Typography variant="h4" color="warning.main" sx={{ my: 1 }}>
                      {stats.seniorEmployees}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {((stats.seniorEmployees / stats.totalEmployees) * 100).toFixed(1)}% du total
                    </Typography>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Prime moyenne par employé
                    </Typography>
                    <Typography variant="h4" color="error.main" sx={{ my: 1 }}>
                      {stats.totalEmployees > 0 ? (stats.totalPrime / stats.totalEmployees).toFixed(0) : 0}€
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prime totale: {stats.totalPrime.toLocaleString()}€
                    </Typography>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsDashboard;