import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Card, CardContent, Alert,
  Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Collapse, LinearProgress
} from '@mui/material';
import { employeeApi, getApiBaseUrl } from '../services/api';
import { Doublon } from '../types/employee';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const DuplicateDetection: React.FC = () => {
  const [doublons, setDoublons] = useState<Doublon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDoublons();
  }, []);

  const fetchDoublons = async () => {
    try {
      setLoading(true);
      if (!getApiBaseUrl()) throw new Error('VITE_API_URL not configured; set it in public/config.json or in the build environment.');
      const response = await employeeApi.getDoublons();
      setDoublons(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la détection des doublons');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  if (loading) {
    return <LinearProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <WarningIcon color="warning" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            🔍 Détection de Doublons Possibles
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Employés avec même nom et prénom mais adresses différentes
          </Typography>
        </Box>
      </Box>

      {doublons.length === 0 ? (
        <Alert severity="success" sx={{ mb: 3 }}>
          Aucun doublon potentiel détecté dans la base de données.
        </Alert>
      ) : (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {doublons.length} groupe(s) de doublons potentiels détectés nécessitant vérification.
        </Alert>
      )}

      {doublons.map((doublon) => (
        <Card key={doublon._id} sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <PersonIcon color="primary" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {doublon.value.noms[0]} {doublon.value.prenoms[0]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {doublon.value.count} occurrences détectées
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {doublon.value.adresses_differentes ? (
                  <Chip
                    icon={<WarningIcon />}
                    label="Adresses différentes"
                    color="error"
                    size="small"
                  />
                ) : (
                  <Chip
                    label="Même adresse"
                    color="success"
                    size="small"
                  />
                )}
                <IconButton size="small" onClick={() => toggleRow(doublon._id)}>
                  {expandedRows.has(doublon._id) ? (
                    <KeyboardArrowUpIcon />
                  ) : (
                    <KeyboardArrowDownIcon />
                  )}
                </IconButton>
              </Box>
            </Box>

            <Collapse in={expandedRows.has(doublon._id)}>
              <Box sx={{ mt: 3, pl: 4 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main' }}>
                  Détails des occurrences:
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Adresse</TableCell>
                        <TableCell>Ville</TableCell>
                        <TableCell>Code Postal</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {doublon.value.adresses.map((adresse, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="caption" fontFamily="monospace">
                              {doublon.value.ids[index].substring(0, 8)}...
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <LocationOnIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {adresse?.rue || 'Non spécifiée'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {adresse?.ville || 'Non spécifiée'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {adresse?.codepostal || 'Non spécifié'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {doublon.value.adresses_differentes && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    ⚠️ Attention: Ces employés partagent le même nom et prénom mais ont des adresses différentes.
                    Cela pourrait indiquer des doublons dans la base de données.
                  </Alert>
                )}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default DuplicateDetection;