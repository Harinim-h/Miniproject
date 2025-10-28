// src/components/Common/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const { isAuthenticated, user, handleLogout, isAdmin } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#800000' }}>
      <Toolbar>
        {/* Logo / Brand Name */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Property Locator
          </Link>
        </Typography>

        {/* -------- DESKTOP MENU -------- */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {/* Common links */}
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/properties">Properties</Button>

          {/* User-specific menu items */}
          {isAuthenticated && !isAdmin && (
            <Button color="inherit" component={Link} to="/favourites">
              Favourites
            </Button>
          )}

          {/* Contact Us only for non-admins */}
          {!isAdmin && (
            <Button color="inherit" component={Link} to="/contact">
              Contact Us
            </Button>
          )}

          {/* Unauthenticated users */}
          {!isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                variant="outlined"
                sx={{ ml: 1 }}
              >
                Register
              </Button>
            </>
          ) : isAdmin ? (
            // Admin menu
            <>
              <Button color="inherit" component={Link} to="/queries">
                Query
              </Button>
              <Button color="inherit" component={Link} to="/post-property">
                Post Properties
              </Button>
              <Typography variant="body1" sx={{ mx: 2 }}>
                Welcome, Admin
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                variant="outlined"
              >
                Logout
              </Button>
            </>
          ) : (
            // Normal user menu
            <>
              <Typography variant="body1" sx={{ mx: 2 }}>
                Welcome, {user?.username}
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                variant="outlined"
              >
                Logout
              </Button>
            </>
          )}
        </Box>

        {/* -------- MOBILE MENU -------- */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          {isAuthenticated && (
            <Typography variant="body1" sx={{ mr: 2 }}>
              Welcome, {isAdmin ? 'Admin' : user?.username}
            </Typography>
          )}

          <IconButton size="large" color="inherit" onClick={handleMenu}>
            <MenuIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            {/* Common Links */}
            <MenuItem onClick={handleClose} component={Link} to="/">
              Home
            </MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/properties">
              Properties
            </MenuItem>

            {/* Visitor menu */}
            {!isAuthenticated && (
              <>
                <MenuItem onClick={handleClose} component={Link} to="/contact">
                  Contact Us
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/login">
                  Login
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/register">
                  Register
                </MenuItem>
              </>
            )}

            {/* Normal user menu */}
            {isAuthenticated && !isAdmin && (
              <>
                <MenuItem onClick={handleClose} component={Link} to="/favourites">
                  Favourites
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/contact">
                  Contact Us
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleLogout();
                  }}
                >
                  Logout
                </MenuItem>
              </>
            )}

            {/* Admin menu */}
            {isAuthenticated && isAdmin && (
              <>
                <MenuItem onClick={handleClose} component={Link} to="/queries">
                  Query
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/post-property">
                  Post Properties
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleLogout();
                  }}
                >
                  Logout
                </MenuItem>
              </>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
