import React from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import BusinessIcon from '@mui/icons-material/Business';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const location = useLocation();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Employés', path: '/employees' },
    { label: 'Analytics', path: '/analytics' },
    { label: 'Admin', path: '/admin' },
  ];

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: darkMode 
          ? '0 1px 3px rgba(0,0,0,0.3)' 
          : '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: darkMode 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid #e2e8f0'
      }}
    >
      <Toolbar sx={{ minHeight: '64px' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
          <BusinessIcon sx={{ 
            fontSize: 28, 
            color: theme.palette.primary.main, 
            mr: 1.5 
          }} />
          <Box>
            <Typography variant="h6" sx={{ 
              fontWeight: 700, 
              color: theme.palette.text.primary,
              lineHeight: 1.2
            }}>
              Employee Management
            </Typography>
            <Typography variant="caption" sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 500
            }}>
              MongoDB Project
            </Typography>
          </Box>
        </Box>

        {/* Navigation */}
        <Box sx={{ display: 'flex', flex: 1 }}>
          {navItems.map((item) => (
            <Box
              key={item.label}
              component={Link}
              to={item.path}
              sx={{
                px: 3,
                py: 2,
                textDecoration: 'none',
                color: location.pathname === item.path 
                  ? theme.palette.primary.main 
                  : theme.palette.text.secondary,
                borderBottom: location.pathname === item.path 
                  ? `3px solid ${theme.palette.primary.main}` 
                  : '3px solid transparent',
                fontWeight: location.pathname === item.path ? 600 : 500,
                fontSize: '0.9rem',
                position: 'relative',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                  color: theme.palette.primary.main
                }
              }}
            >
              {item.label}
            </Box>
          ))}
        </Box>

        {/* Settings */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: theme.palette.action.hover
            }
          }}
        >
          <SettingsIcon />
        </IconButton>

        {/* Profile */}
        <Avatar
          sx={{
            width: 36,
            height: 36,
            bgcolor: theme.palette.primary.main,
            fontSize: '0.875rem',
            fontWeight: 600,
            ml: 2,
            cursor: 'pointer'
          }}
          onClick={handleMenuOpen}
        >
          U
        </Avatar>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              mt: 1.5,
              width: 200,
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              boxShadow: darkMode 
                ? '0 4px 20px rgba(0,0,0,0.4)' 
                : '0 4px 20px rgba(0,0,0,0.1)'
            }
          }}
        >
          <MenuItem 
            component={Link} 
            to="/settings" 
            onClick={handleMenuClose}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            Paramètres
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem 
            onClick={handleMenuClose}
            sx={{
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }}
          >
            Déconnexion
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;