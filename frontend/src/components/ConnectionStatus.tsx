// frontend/src/components/ConnectionStatus.tsx
import React, { useState, useEffect } from 'react';
import { 
  Alert, 
  Button, 
  Box, 
  Typography, 
  Chip,
  Paper,
  CircularProgress 
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { employeeApi, getApiBaseUrl } from '../services/api';

const ConnectionStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [details, setDetails] = useState<any>(null);
  const [backendUrl, setBackendUrl] = useState('');

  useEffect(() => {
    checkConnection();
    // Récupérer l'URL actuelle via le runtime config
    const url = getApiBaseUrl() || '';
    setBackendUrl(url);
  }, []);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      console.log('🔍 Testing connection to:', backendUrl || 'no URL configured');

      if (!backendUrl) {
        throw new Error('VITE_API_URL not configured; set it in public/config.json or in the build environment.');
      }

      // Use the health check provided by employeeApi (calls root on backend)
      const healthResponse = await employeeApi.healthCheck();

      setDetails({
        healthData: healthResponse.data,
        timestamp: new Date().toISOString(),
      });
      
      setStatus('connected');
    } catch (error: any) {
      console.error('Connection test failed:', error);
      setStatus('error');
      setDetails({
        error: error.message,
        url: backendUrl || 'VITE_API_URL is missing',
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          🔗 Statut de Connexion Backend
        </Typography>
        
        <Chip
          icon={status === 'connected' ? <CheckCircleIcon /> : <ErrorIcon />}
          label={status === 'connected' ? 'Connecté' : status === 'error' ? 'Erreur' : 'Vérification...'}
          color={status === 'connected' ? 'success' : status === 'error' ? 'error' : 'warning'}
          sx={{ mr: 2 }}
        />
        
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={checkConnection}
          disabled={status === 'checking'}
        >
          Rafraîchir
        </Button>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          URL du backend:
        </Typography>
        <Typography variant="body1" fontFamily="monospace" sx={{ 
          bgcolor: 'grey.100', 
          p: 1, 
          borderRadius: 1,
          wordBreak: 'break-all'
        }}>
          {backendUrl}
        </Typography>
      </Box>

      {status === 'checking' && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CircularProgress size={20} />
          <Typography>Vérification de la connexion...</Typography>
        </Box>
      )}

      {status === 'connected' && details && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            ✅ Connexion établie avec succès
          </Typography>
          <Typography variant="caption" display="block">
            Backend: {details.healthData?.message || 'MongoDB API'}
          </Typography>
          <Typography variant="caption" display="block">
            Statut: {details.healthData?.status || 'unknown'}
          </Typography>
        </Alert>
      )}

      {status === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2" fontWeight="bold">
            ❌ Impossible de se connecter au backend
          </Typography>
          <Typography variant="caption" display="block">
            URL: {backendUrl}
          </Typography>
          <Typography variant="caption" display="block">
            Erreur: {details?.error || 'Connection refused'}
          </Typography>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" fontWeight="bold">
              Problèmes possibles:
            </Typography>
            <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
              <li>Le backend n'est pas démarré</li>
              <li>Problème de configuration CORS</li>
              <li>L'URL est incorrecte</li>
              <li>Le port est bloqué par le pare-feu</li>
            </ul>
          </Box>
        </Alert>
      )}
    </Paper>
  );
};

export default ConnectionStatus;