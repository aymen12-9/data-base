import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/'
    },
    {
      text: 'Employés',
      icon: <PeopleIcon />,
      path: '/employees'
    },
    {
      text: 'Analytics',
      icon: <AnalyticsIcon />,
      path: '/analytics'
    },
    {
      text: 'Admin',
      icon: <AdminIcon />,
      path: '/admin'
    }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: darkMode 
            ? '1px solid rgba(255, 255, 255, 0.1)' 
            : '1px solid #e2e8f0'
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle1" sx={{ 
          fontWeight: 600, 
          color: theme.palette.primary.main, 
          mb: 3 
        }}>
          Navigation
        </Typography>
        
        <List>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                mb: 1,
                borderRadius: 8,
                textDecoration: 'none',
                color: location.pathname === item.path 
                  ? theme.palette.primary.main 
                  : theme.palette.text.secondary,
                backgroundColor: location.pathname === item.path 
                  ? theme.palette.action.selected 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path 
                  ? theme.palette.primary.main 
                  : theme.palette.text.secondary
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: location.pathname === item.path ? 600 : 500
                }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;