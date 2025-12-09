import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  LinearProgress,
  Alert,
  TextField,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { employeeApi } from '../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ErrorIcon from '@mui/icons-material/Error';

const Admin: React.FC = () => {
  // États pour la gestion des employés
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // États pour les dialogues
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  // États pour le formulaire d'édition/ajout
  const [formData, setFormData] = useState({
    _id: '',
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

  // Charger les employés
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeApi.getAllEmployees();
      setEmployees(response.data);
      setError(null);
    } catch (err: any) {
      setError('Erreur lors du chargement des employés');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Gestion des employés - CRUD
  const handleAddEmployee = async () => {
    setLoading(true);
    try {
      // Préparer les données (sans _id pour l'ajout)
      const { _id, ...employeeData } = formData;
      
      // Convertir les champs numériques
      const dataToSend = {
        ...employeeData,
        anciennete: parseFloat(formData.anciennete.toString()) || 0,
        prime: parseFloat(formData.prime.toString()) || 0,
        adresse: {
          ...formData.adresse,
          numero: formData.adresse.numero || undefined,
          codepostal: formData.adresse.codepostal || undefined
        }
      };

      await employeeApi.addEmployee(dataToSend);
      setSuccess('Employé ajouté avec succès !');
      setAddDialogOpen(false);
      resetForm();
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async () => {
    setLoading(true);
    try {
      // Préparer les données pour la mise à jour
      const dataToSend = {
        nom: formData.nom,
        prenom: formData.prenom,
        anciennete: parseFloat(formData.anciennete.toString()) || 0,
        prime: parseFloat(formData.prime.toString()) || 0,
        adresse: {
          numero: formData.adresse.numero || undefined,
          rue: formData.adresse.rue || undefined,
          codepostal: formData.adresse.codepostal || undefined,
          ville: formData.adresse.ville || undefined
        }
      };

      // Utiliser l'API réelle pour mettre à jour
      await employeeApi.updateEmployee(formData._id, dataToSend);
      setSuccess('Employé mis à jour avec succès !');
      setEditDialogOpen(false);
      resetForm();
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async () => {
    setLoading(true);
    try {
      // Utiliser l'API réelle pour supprimer
      await employeeApi.deleteEmployee(selectedEmployee._id);
      setSuccess(`Employé ${selectedEmployee.nom} ${selectedEmployee.prenom} supprimé avec succès !`);
      setDeleteDialogOpen(false);
      fetchEmployees();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      _id: '',
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
    setSelectedEmployee(null);
  };

  const openEditDialog = (employee: any) => {
    setSelectedEmployee(employee);
    setFormData({
      _id: employee._id,
      nom: employee.nom,
      prenom: employee.prenom,
      anciennete: employee.anciennete || 0,
      prime: employee.prime || 0,
      adresse: {
        numero: employee.adresse?.numero || '',
        rue: employee.adresse?.rue || '',
        codepostal: employee.adresse?.codepostal || '',
        ville: employee.adresse?.ville || ''
      }
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (employee: any) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const openAddDialog = () => {
    resetForm();
    setAddDialogOpen(true);
  };

  // Villes pour le sélecteur
  const villesFrance = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Bordeaux',
    'Lille', 'Nantes', 'Strasbourg', 'Montpellier', 'Nice',
    'Rennes', 'Grenoble', 'Rouen', 'Toulon', 'Dijon'
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
        ⚙️ Administration - Gestion des Employés
      </Typography>

      {/* Messages d'état */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* En-tête avec actions */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
              📋 Liste des Employés
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Gérez votre base de données d'employés : ajoutez, modifiez ou supprimez des employés.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
              sx={{ px: 3 }}
            >
              Ajouter un Employé
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchEmployees}
            >
              Rafraîchir
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Tableau des employés */}
      <Paper sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        {loading && <LinearProgress />}

        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }}>Nom</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }}>Prénom</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '15%' }}>Ancienneté</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '15%' }}>Prime</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }}>Ville</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '10%' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => (
                <TableRow 
                  key={employee._id} 
                  hover
                  sx={{ 
                    '&:hover': { backgroundColor: 'action.hover' },
                    transition: 'background-color 0.2s'
                  }}
                >
                  <TableCell>
                    <Typography fontWeight="medium">{employee.nom}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{employee.prenom}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={`${employee.anciennete || 0} ans`}
                      color={employee.anciennete > 10 ? "error" : "primary"}
                      size="small"
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
                  <TableCell>
                    {employee.prime ? (
                      <Chip
                        label={`${employee.prime} €`}
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Aucune
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2">
                        {employee.adresse?.ville || 'Non spécifiée'}
                      </Typography>
                      {employee.adresse?.codepostal && (
                        <Typography variant="caption" color="text.secondary">
                          ({employee.adresse.codepostal})
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Modifier">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => openEditDialog(employee)}
                          sx={{ 
                            border: '1px solid',
                            borderColor: 'primary.main',
                            '&:hover': { backgroundColor: 'primary.light', color: 'white' }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openDeleteDialog(employee)}
                          sx={{ 
                            border: '1px solid',
                            borderColor: 'error.main',
                            '&:hover': { backgroundColor: 'error.light', color: 'white' }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {employees.length === 0 && !loading && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Aucun employé trouvé. Cliquez sur "Ajouter un Employé" pour commencer.
            </Typography>
          </Box>
        )}

        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            {employees.length} employé(s) au total
          </Typography>
        </Box>
      </Paper>

      {/* Dialogue Ajout */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon color="primary" />
            <Typography variant="h6">Ajouter un Nouvel Employé</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom *"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prénom *"
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  required
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ancienneté (années)"
                  type="number"
                  value={formData.anciennete}
                  onChange={(e) => setFormData({...formData, anciennete: parseFloat(e.target.value) || 0})}
                  margin="normal"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prime (€)"
                  type="number"
                  value={formData.prime}
                  onChange={(e) => setFormData({...formData, prime: parseFloat(e.target.value) || 0})}
                  margin="normal"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0, step: 10 } }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Numéro"
                  value={formData.adresse.numero}
                  onChange={(e) => setFormData({
                    ...formData,
                    adresse: {...formData.adresse, numero: e.target.value}
                  })}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Rue"
                  value={formData.adresse.rue}
                  onChange={(e) => setFormData({
                    ...formData,
                    adresse: {...formData.adresse, rue: e.target.value}
                  })}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Code Postal"
                  value={formData.adresse.codepostal}
                  onChange={(e) => setFormData({
                    ...formData,
                    adresse: {...formData.adresse, codepostal: e.target.value}
                  })}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Ville</InputLabel>
                  <Select
                    label="Ville"
                    value={formData.adresse.ville}
                    onChange={(e) => setFormData({
                      ...formData,
                      adresse: {...formData.adresse, ville: e.target.value}
                    })}
                  >
                    <MenuItem value=""><em>Sélectionner une ville</em></MenuItem>
                    {villesFrance.map((ville) => (
                      <MenuItem key={ville} value={ville}>{ville}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setAddDialogOpen(false)} 
            startIcon={<CancelIcon />}
            variant="outlined"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleAddEmployee} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            disabled={!formData.nom || !formData.prenom || loading}
            sx={{ px: 3 }}
          >
            {loading ? 'Ajout en cours...' : 'Ajouter'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue Édition */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon color="primary" />
            <Typography variant="h6">Modifier l'Employé</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary" fontFamily="monospace">
                  ID: {selectedEmployee?._id}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nom *"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  required
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prénom *"
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  required
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Ancienneté (années)"
                  type="number"
                  value={formData.anciennete}
                  onChange={(e) => setFormData({...formData, anciennete: parseFloat(e.target.value) || 0})}
                  margin="normal"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0, step: 0.5 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Prime (€)"
                  type="number"
                  value={formData.prime}
                  onChange={(e) => setFormData({...formData, prime: parseFloat(e.target.value) || 0})}
                  margin="normal"
                  variant="outlined"
                  InputProps={{ inputProps: { min: 0, step: 10 } }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Numéro"
                  value={formData.adresse.numero}
                  onChange={(e) => setFormData({
                    ...formData,
                    adresse: {...formData.adresse, numero: e.target.value}
                  })}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={9}>
                <TextField
                  fullWidth
                  label="Rue"
                  value={formData.adresse.rue}
                  onChange={(e) => setFormData({
                    ...formData,
                    adresse: {...formData.adresse, rue: e.target.value}
                  })}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Code Postal"
                  value={formData.adresse.codepostal}
                  onChange={(e) => setFormData({
                    ...formData,
                    adresse: {...formData.adresse, codepostal: e.target.value}
                  })}
                  margin="normal"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <FormControl fullWidth margin="normal" variant="outlined">
                  <InputLabel>Ville</InputLabel>
                  <Select
                    label="Ville"
                    value={formData.adresse.ville}
                    onChange={(e) => setFormData({
                      ...formData,
                      adresse: {...formData.adresse, ville: e.target.value}
                    })}
                  >
                    <MenuItem value=""><em>Sélectionner une ville</em></MenuItem>
                    {villesFrance.map((ville) => (
                      <MenuItem key={ville} value={ville}>{ville}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)} 
            startIcon={<CancelIcon />}
            variant="outlined"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleUpdateEmployee} 
            variant="contained" 
            color="primary"
            startIcon={<SaveIcon />}
            disabled={!formData.nom || !formData.prenom || loading}
            sx={{ px: 3 }}
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogue Suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ErrorIcon color="error" />
            <Typography variant="h6">Confirmer la Suppression</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Êtes-vous sûr de vouloir supprimer définitivement l'employé{' '}
            <strong>{selectedEmployee?.nom} {selectedEmployee?.prenom}</strong> ?
          </Typography>
          
          {selectedEmployee && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Ancienneté:</strong> {selectedEmployee.anciennete || 0} ans
              </Typography>
              <Typography variant="body2">
                <strong>Ville:</strong> {selectedEmployee.adresse?.ville || 'Non spécifiée'}
              </Typography>
              {selectedEmployee.prime && (
                <Typography variant="body2">
                  <strong>Prime:</strong> {selectedEmployee.prime} €
                </Typography>
              )}
            </Box>
          )}
          
          <Alert severity="warning">
            ⚠️ Cette action est irréversible. L'employé sera définitivement supprimé de la base de données.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Annuler
          </Button>
          <Button 
            onClick={handleDeleteEmployee} 
            variant="contained" 
            color="error"
            startIcon={<DeleteIcon />}
            disabled={loading}
            sx={{ px: 3 }}
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;