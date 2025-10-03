import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  Add,
  Home,
  Person,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getInitials } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate(ROUTES.LOGIN);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" elevation={0} className="bg-white dark:bg-gray-900 shadow-sm">
      <Toolbar className="justify-between">
        <Box className="flex items-center space-x-4">
          <Typography
            variant="h6"
            className="font-bold text-blue-600 dark:text-blue-400 cursor-pointer"
            onClick={() => navigate(ROUTES.HOME)}
          >
            TurnThePage
          </Typography>
          
          {user && (
            <Box className="hidden md:flex space-x-2">
              <Button
                startIcon={<Home />}
                onClick={() => navigate(ROUTES.HOME)}
                className={isActive(ROUTES.HOME) ? 'bg-blue-50 dark:bg-blue-900' : ''}
              >
                Home
              </Button>
              <Button
                startIcon={<Add />}
                onClick={() => navigate(ROUTES.ADD_BOOK)}
                className={isActive(ROUTES.ADD_BOOK) ? 'bg-blue-50 dark:bg-blue-900' : ''}
              >
                Add Book
              </Button>
            </Box>
          )}
        </Box>

        <Box className="flex items-center space-x-2">
          <IconButton onClick={toggleTheme} className="text-gray-600 dark:text-gray-300">
            {theme === 'light' ? <DarkMode /> : <LightMode />}
          </IconButton>

          {user ? (
            <>
              <Avatar
                onClick={handleProfileMenuOpen}
                className="cursor-pointer bg-blue-600 text-white w-8 h-8 text-sm"
              >
                {getInitials(user.name)}
              </Avatar>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={() => { navigate(ROUTES.PROFILE); handleMenuClose(); }}>
                  <Person className="mr-2" />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box className="space-x-2">
              <Button
                variant="outlined"
                onClick={() => navigate(ROUTES.LOGIN)}
                className="text-blue-600 border-blue-600"
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate(ROUTES.SIGNUP)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;