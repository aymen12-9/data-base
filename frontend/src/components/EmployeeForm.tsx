import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Alert,
  IconButton,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EuroIcon from '@mui/icons-material/Euro';
import { employeeApi, getApiBaseUrl } from '../services/api';

const EmployeeForm: React.FC = () => {
  const [employee, setEmployee] = useState({
    nom: '',
    prenom: '',
    anciennete: 0,
    prime: 0,
    adresse: {
      numero: '',
      rue: '',
      codepostal: '',
      ville: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEmployee(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setEmployee(prev => ({
        ...prev,
        [name]: name === 'anciennete' || name === 'prime' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validation
      if (!employee.nom || !employee.prenom) {
        throw new Error('Le nom et le prénom sont obligatoires');
      }
      if (!getApiBaseUrl()) {
        throw new Error('VITE_API_URL not configured; set it in public/config.json or in the build environment.');
      }
      await employeeApi.addEmployee(employee);
      setSuccess(true);
      setEmployee({
        nom: '',
        prenom: '',
        anciennete: 0,
        prime: 0,
        adresse: {
          numero: '',
          rue: '',
          codepostal: '',
          ville: ''
        }
      });
      
      // Recharger la liste après 2 secondes
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'ajout de l\'employé');
    } finally {
      setLoading(false);
    }
  };

  const villesFrance = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux',
    'Lille', 'Nantes', 'Strasbourg', 'Montpellier', 'Nice',
    'Rennes', 'Grenoble', 'Rouen', 'Toulon', 'Dijon'
  ];

  return (
    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
        <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            👤 Ajouter un Nouvel Employé
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Remplissez le formulaire pour ajouter un employé à la base de données
          </Typography>
        </Box>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          ✅ Employé ajouté avec succès à la base de données !
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          ❌ {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Informations personnelles */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" />
                  Informations Personnelles
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nom *"
                      name="nom"
                      value={employee.nom}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Prénom *"
                      name="prenom"
                      value={employee.prenom}
                      onChange={handleChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Informations professionnelles */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkIcon color="primary" />
                  Informations Professionnelles
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Ancienneté (années)"
                      name="anciennete"
                      type="number"
                      value={employee.anciennete}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <WorkIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Prime (€)"
                      name="prime"
                      type="number"
                      value={employee.prime}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EuroIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Adresse */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOnIcon color="primary" />
                  Adresse
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Numéro"
                      name="adresse.numero"
                      value={employee.adresse.numero}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={9}>
                    <TextField
                      fullWidth
                      label="Rue"
                      name="adresse.rue"
                      value={employee.adresse.rue}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Code Postal"
                      name="adresse.codepostal"
                      value={employee.adresse.codepostal}
                      onChange={handleChange}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={8}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Ville</InputLabel>
                      <Select
                        label="Ville"
                        name="adresse.ville"
                        value={employee.adresse.ville}
                        onChange={(e) => handleChange({ target: { name: 'adresse.ville', value: e.target.value } } as any)}
                      >
                        <MenuItem value="">
                          <em>Sélectionner une ville</em>
                        </MenuItem>
                        {villesFrance.map((ville) => (
                          <MenuItem key={ville} value={ville}>
                            {ville}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Boutons */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  setEmployee({
                    nom: '',
                    prenom: '',
                    anciennete: 0,
                    prime: 0,
                    adresse: {
                      numero: '',
                      rue: '',
                      codepostal: '',
                      ville: ''
                    }
                  });
                  setError(null);
                  setSuccess(false);
                }}
                startIcon={<ClearIcon />}
              >
                Effacer
              </Button>
              
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={<AddIcon />}
                sx={{ px: 4, py: 1.5 }}
              >
                {loading ? 'Ajout en cours...' : 'Ajouter l\'Employé'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>

      {/* Aperçu */}
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon color="action" />
        Aperçu de l'Employé
      </Typography>
      
      <Card variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Nom complet:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {employee.prenom} {employee.nom || 'Non spécifié'}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Ancienneté:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {employee.anciennete} ans
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Prime:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {employee.prime} €
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Adresse:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {employee.adresse.numero} {employee.adresse.rue}, {employee.adresse.codepostal} {employee.adresse.ville}
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Paper>
  );
};

export default EmployeeForm;