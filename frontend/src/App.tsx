import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { 
  Box, 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Container 
} from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardCards from './components/DashboardCards';
import Home from './pages/Home';
import Employees from './pages/Employees';
import Analytics from './pages/Analytics';
import Admin from './pages/Admin';
import Settings from './pages/Settings';
import './styles/theme.css';

const drawerWidth = 240;

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('app-theme');
    return saved === 'dark';
  });

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('app-language');
    return saved || 'fr';
  });

 const theme = createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: darkMode ? '#6366f1' : '#4f46e5', // Indigo
      light: darkMode ? '#a5b4fc' : '#818cf8',
      dark: darkMode ? '#4338ca' : '#3730a3',
    },
    secondary: {
      main: darkMode ? '#10b981' : '#059669', // Émeraude
      light: darkMode ? '#34d399' : '#10b981',
      dark: darkMode ? '#047857' : '#065f46',
    },
    background: {
      default: darkMode ? '#0f172a' : '#f8fafc',
      paper: darkMode ? '#1e293b' : '#ffffff',
    },
    text: {
      primary: darkMode ? '#f1f5f9' : '#0f172a',
      secondary: darkMode ? '#cbd5e1' : '#475569',
    },
    action: {
      hover: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(99, 102, 241, 0.04)',
      selected: darkMode ? 'rgba(99, 102, 241, 0.16)' : 'rgba(99, 102, 241, 0.08)',
      disabledBackground: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(99, 102, 241, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: darkMode 
            ? '0 4px 20px rgba(0,0,0,0.3)' 
            : '0 4px 20px rgba(99, 102, 241, 0.08)',
          border: darkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid #e2e8f0',
        },
      },
    },
  },
});

  const handleThemeChange = (isDark: boolean) => {
    setDarkMode(isDark);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
  };

  // Appliquer les styles CSS pour les points de données
  useEffect(() => {
    const showDataPoints = localStorage.getItem('show-data-points') !== 'false';
    
    const style = document.createElement('style');
    style.id = 'chart-styles';
    
    if (showDataPoints) {
      style.textContent = `
        .recharts-dot {
          display: block !important;
        }
        .recharts-line-dots {
          display: block !important;
        }
      `;
    } else {
      style.textContent = `
        .recharts-dot {
          display: none !important;
        }
        .recharts-line-dots {
          display: none !important;
        }
      `;
    }
    
    document.head.appendChild(style);
    
    return () => {
      const existingStyle = document.getElementById('chart-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          minHeight: '100vh', 
          backgroundColor: darkMode ? '#121212' : '#ffffff' 
        }}>
          <Header />
          <Sidebar />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              mt: '64px',
              backgroundColor: darkMode ? '#121212' : '#ffffff',
              minHeight: 'calc(100vh - 64px)',
              transition: 'background-color 0.3s ease',
            }}
          >
            <Container maxWidth="xl" sx={{ py: 3 }}>
              <Routes>
                <Route path="/" element={
                  <Box>
                    <DashboardCards />
                    <Home />
                  </Box>
                } />
                <Route path="/employees" element={<Employees />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/admin" element={<Admin />} />
                <Route 
                  path="/settings" 
                  element={
                    <Settings 
                      onThemeChange={handleThemeChange}
                      onLanguageChange={handleLanguageChange}
                    />
                  } 
                />
              </Routes>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </Router>
  );
};

export default App;