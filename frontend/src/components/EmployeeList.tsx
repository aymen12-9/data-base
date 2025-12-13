import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Chip, IconButton, Tooltip, Box, Typography, Alert
} from '@mui/material';
// Importez tout depuis le module
import * as EmployeeTypes from '../types/employee';

// Puis utilisez
type Employee = EmployeeTypes.Employee;
import { employeeApi, getApiBaseUrl } from '../services/api';
import PersonIcon from '@mui/icons-material/Person';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import PaymentsIcon from '@mui/icons-material/Payments';

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      if (!getApiBaseUrl()) {
        throw new Error('VITE_API_URL not configured; set VITE_API_URL in public/config.json or in build environment.');
      }
      const response = await employeeApi.getAllEmployees();
      setEmployees(response.data);
      setError(null);
    } catch (err: any) {
      const msg = err?.message || 'Erreur lors du chargement des employés';
      setError(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Chargement...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          📋 Liste des Employés ({employees.length})
        </Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nom</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prénom</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ancienneté</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prime</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Adresse</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.map((employee) => (
              <TableRow
                key={employee._id}
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                  transition: 'background-color 0.2s'
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    <Typography fontWeight="medium">{employee.nom}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography>{employee.prenom}</Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    icon={<WorkHistoryIcon />}
                    label={`${employee.anciennete || 0} ans`}
                    color={employee.anciennete && employee.anciennete > 10 ? "error" : "primary"}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {employee.prime ? (
                    <Chip
                      icon={<PaymentsIcon />}
                      label={`${employee.prime} €`}
                      color="success"
                      variant="outlined"
                      size="small"
                    />
                  ) : (
                    <Typography color="text.secondary" variant="body2">
                      Aucune
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationCityIcon color="action" fontSize="small" />
                    <Typography variant="body2">
                      {employee.adresse ? 
                        `${employee.adresse.numero || ''} ${employee.adresse.rue || ''}, ${employee.adresse.codepostal || ''} ${employee.adresse.ville || ''}` :
                        'Non renseignée'
                      }
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EmployeeList;