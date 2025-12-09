import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Divider,
  Button,
  Grid,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormHelperText
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

interface SettingsProps {
  onThemeChange: (isDark: boolean) => void;
  onLanguageChange: (lang: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ onThemeChange, onLanguageChange }) => {
  // États initiaux depuis localStorage ou valeurs par défaut
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('app-language');
    return saved || 'fr';
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('app-theme');
    return saved === 'dark';
  });

  const [showDataPoints, setShowDataPoints] = useState(() => {
    const saved = localStorage.getItem('show-data-points');
    return saved ? saved === 'true' : true;
  });

  const [cursorStyle, setCursorStyle] = useState(() => {
    const saved = localStorage.getItem('cursor-style');
    return saved || 'default';
  });

  // États pour les notifications
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Effet pour mettre à jour le thème quand darkMode change
  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('app-theme', theme);
    onThemeChange(darkMode);
    
    // Appliquer le thème au body
    document.body.style.backgroundColor = darkMode ? '#121212' : '#ffffff';
    document.body.style.color = darkMode ? '#ffffff' : '#000000';
  }, [darkMode, onThemeChange]);

  // Effet pour mettre à jour la langue
  useEffect(() => {
    localStorage.setItem('app-language', language);
    onLanguageChange(language);
  }, [language, onLanguageChange]);

  // Sauvegarder toutes les préférences
  const handleSave = () => {
    // Sauvegarder toutes les préférences
    const settings = {
      theme: darkMode ? 'dark' : 'light',
      language,
      showDataPoints,
      cursorStyle,
      lastUpdated: new Date().toISOString()
    };

    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    // Appliquer les paramètres de curseur
    applyCursorStyle(cursorStyle);
    applyDataPoints(showDataPoints);

    // Afficher notification
    setSnackbarMessage('Paramètres sauvegardés avec succès !');
    setSnackbarOpen(true);

    // Log pour le débogage
    console.log('Paramètres sauvegardés:', settings);
  };

  // Appliquer le style de curseur
  const applyCursorStyle = (style: string) => {
    localStorage.setItem('cursor-style', style);
    
    // Appliquer le style CSS
    const styleElement = document.getElementById('cursor-style') || document.createElement('style');
    styleElement.id = 'cursor-style';
    
    let css = '';
    switch (style) {
      case 'pointer':
        css = `
          .chart-container * {
            cursor: pointer !important;
          }
          .recharts-wrapper {
            cursor: pointer !important;
          }
        `;
        break;
      case 'crosshair':
        css = `
          .chart-container * {
            cursor: crosshair !important;
          }
          .recharts-wrapper {
            cursor: crosshair !important;
          }
        `;
        break;
      default:
        css = `
          .chart-container * {
            cursor: default !important;
          }
          .recharts-wrapper {
            cursor: default !important;
          }
        `;
    }
    
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
  };

  // Appliquer l'affichage des points de données
  const applyDataPoints = (show: boolean) => {
    localStorage.setItem('show-data-points', show.toString());
    
    // Ajouter/retirer la classe pour les points de données
    if (show) {
      document.body.classList.add('show-data-points');
      document.body.classList.remove('hide-data-points');
    } else {
      document.body.classList.add('hide-data-points');
      document.body.classList.remove('show-data-points');
    }
  };

  // Réinitialiser aux valeurs par défaut
  const handleReset = () => {
    setLanguage('fr');
    setDarkMode(false);
    setShowDataPoints(true);
    setCursorStyle('default');
    
    setSnackbarMessage('Paramètres réinitialisés aux valeurs par défaut');
    setSnackbarOpen(true);
  };

  // Charger les paramètres depuis localStorage
  const loadSettings = () => {
    try {
      const saved = localStorage.getItem('app-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        setLanguage(settings.language || 'fr');
        setDarkMode(settings.theme === 'dark');
        setShowDataPoints(settings.showDataPoints !== false);
        setCursorStyle(settings.cursorStyle || 'default');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
    }
  };

  // Charger les paramètres au montage
  useEffect(() => {
    loadSettings();
  }, []);

  // Traductions selon la langue
  const translations = {
    fr: {
      title: 'Paramètres',
      language: 'Langue',
      languageHelp: 'Sélectionnez votre langue préférée',
      appearance: 'Apparence',
      darkMode: 'Mode sombre',
      darkModeHelp: 'Basculer entre les thèmes clair et sombre',
      chartSettings: 'Paramètres graphiques',
      cursorStyle: 'Style de curseur',
      cursorStyleHelp: 'Style du curseur dans les graphiques',
      showDataPoints: 'Afficher les points de données',
      dataPointsHelp: 'Afficher les points individuels sur les courbes',
      save: 'Sauvegarder',
      reset: 'Réinitialiser',
      saved: 'Paramètres sauvegardés avec succès !',
      resetConfirmation: 'Paramètres réinitialisés'
    },
    en: {
      title: 'Settings',
      language: 'Language',
      languageHelp: 'Select your preferred language',
      appearance: 'Appearance',
      darkMode: 'Dark mode',
      darkModeHelp: 'Toggle between light and dark themes',
      chartSettings: 'Chart Settings',
      cursorStyle: 'Cursor style',
      cursorStyleHelp: 'Cursor style in charts',
      showDataPoints: 'Show data points',
      dataPointsHelp: 'Display individual data points on curves',
      save: 'Save',
      reset: 'Reset',
      saved: 'Settings saved successfully!',
      resetConfirmation: 'Settings reset'
    },
    es: {
      title: 'Configuración',
      language: 'Idioma',
      languageHelp: 'Seleccione su idioma preferido',
      appearance: 'Apariencia',
      darkMode: 'Modo oscuro',
      darkModeHelp: 'Cambiar entre temas claro y oscuro',
      chartSettings: 'Configuración de Gráficos',
      cursorStyle: 'Estilo del cursor',
      cursorStyleHelp: 'Estilo del cursor en los gráficos',
      showDataPoints: 'Mostrar puntos de datos',
      dataPointsHelp: 'Mostrar puntos individuales en las curvas',
      save: 'Guardar',
      reset: 'Restablecer',
      saved: '¡Configuración guardada con éxito!',
      resetConfirmation: 'Configuración restablecida'
    }
  };

  const t = translations[language as keyof typeof translations] || translations.fr;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#1a237e', mb: 4 }}>
        {t.title}
      </Typography>

      <Grid container spacing={3}>
        {/* Langue */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
              {t.language}
            </Typography>
            
            <FormControl component="fieldset" fullWidth>
              <FormLabel component="legend" sx={{ color: '#5c6bc0', mb: 2, fontWeight: 500 }}>
                {t.languageHelp}
              </FormLabel>
              <RadioGroup
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <FormControlLabel 
                  value="fr" 
                  control={<Radio />} 
                  label="Français" 
                  sx={{ mb: 1 }}
                />
                <FormControlLabel 
                  value="en" 
                  control={<Radio />} 
                  label="English" 
                  sx={{ mb: 1 }}
                />
                <FormControlLabel 
                  value="es" 
                  control={<Radio />} 
                  label="Español" 
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>

        {/* Apparence */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
              {t.appearance}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                    color="primary"
                  />
                }
                label={t.darkMode}
              />
              <FormHelperText sx={{ color: '#7986cb', mt: 1 }}>
                {t.darkModeHelp}
              </FormHelperText>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a237e', mb: 3 }}>
              {t.chartSettings}
            </Typography>

            {/* Style de curseur */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="cursor-style-label">{t.cursorStyle}</InputLabel>
              <Select
                labelId="cursor-style-label"
                value={cursorStyle}
                label={t.cursorStyle}
                onChange={(e) => setCursorStyle(e.target.value)}
              >
                <MenuItem value="default">Défaut</MenuItem>
                <MenuItem value="pointer">Pointeur</MenuItem>
                <MenuItem value="crosshair">Reticule</MenuItem>
              </Select>
              <FormHelperText sx={{ color: '#7986cb' }}>
                {t.cursorStyleHelp}
              </FormHelperText>
            </FormControl>

            {/* Points de données */}
            <FormControlLabel
              control={
                <Switch
                  checked={showDataPoints}
                  onChange={(e) => setShowDataPoints(e.target.checked)}
                  color="primary"
                />
              }
              label={t.showDataPoints}
            />
            <FormHelperText sx={{ color: '#7986cb', mt: 1 }}>
              {t.dataPointsHelp}
            </FormHelperText>
          </Paper>
        </Grid>
      </Grid>

      {/* Boutons d'action */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          onClick={handleReset}
          sx={{
            color: '#1a237e',
            borderColor: '#1a237e',
            '&:hover': {
              borderColor: '#000051',
              backgroundColor: '#f5f7ff'
            }
          }}
        >
          {t.reset}
        </Button>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{
            bgcolor: '#1a237e',
            '&:hover': {
              bgcolor: '#000051'
            }
          }}
        >
          {t.save}
        </Button>
      </Box>

      {/* Informations système */}
      <Paper sx={{ mt: 4, p: 3, borderRadius: 2, border: '1px solid #e0e0e0', bgcolor: '#f8f9fa' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1a237e', mb: 2 }}>
          Informations de configuration
        </Typography>
        <Typography variant="body2" sx={{ color: '#5c6bc0', fontFamily: 'monospace', fontSize: '0.8rem' }}>
          Thème: {darkMode ? 'Sombre' : 'Clair'} | 
          Langue: {language === 'fr' ? 'Français' : language === 'en' ? 'Anglais' : 'Espagnol'} | 
          Curseur: {cursorStyle} | 
          Points de données: {showDataPoints ? 'Activés' : 'Désactivés'}
        </Typography>
      </Paper>

      {/* Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Settings;