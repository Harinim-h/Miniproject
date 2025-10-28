import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Snackbar,
  Button,
  Link as MuiLink,
} from '@mui/material';
import {
  Home as HomeIcon,
  LocationOn as LocationOnIcon,
  AttachMoney as AttachMoneyIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getFirstPropertyImage, DEFAULT_FALLBACK_IMAGE } from '../utils/images';
import { isFavorite, toggleFavorite } from '../utils/favorites';
import localProperties from '../seed_data/properties';

// Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      const localId = Number(id);
      const localEntry = localProperties.find((p) => p.id === localId);

      try {
        const res = await axiosInstance.get(`/properties/${id}/`);
        const apiData = res.data;

        const merged = {
          ...apiData,
          bhk: localEntry?.bhk || apiData?.bhk || 'N/A',
          owner: localEntry?.owner || {
            username: 'N/A',
            email: 'N/A',
            contact_no: 'N/A',
          },
        };

        if (!apiData) setProperty(localEntry);
        else setProperty(merged);
      } catch (err) {
        console.warn('API fetch failed, using local data.', err);
        setProperty(localEntry);
      }

      setLoading(false);
    };

    fetchProperty();
    setFav(isFavorite(id));
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!property)
    return <Typography align="center" sx={{ mt: 4 }}>Property not found.</Typography>;

  const images = Array.isArray(property.images) ? property.images : [];
  const coords = property.latitude && property.longitude
    ? [property.latitude, property.longitude]
    : [51.505, -0.09];

  const handleToggleFavorite = () => {
    const newState = toggleFavorite(id);
    setFav(newState);
    setSnackbarMsg(newState ? 'Added to favourites' : 'Removed from favourites');
    setSnackbarOpen(true);
  };

  const handleDeleteProperty = async () => {
    try {
      await axiosInstance.delete(`/properties/${id}/`).catch(() => {
        console.warn('Backend deletion failed, fallback to local delete.');
      });

      let storedProps = JSON.parse(localStorage.getItem('properties')) || [];
      storedProps = storedProps.filter((p) => p.id !== Number(id));
      localStorage.setItem('properties', JSON.stringify(storedProps));

      setSnackbarMsg('Property removed successfully');
      setSnackbarOpen(true);
      setTimeout(() => navigate('/properties'), 1200);
    } catch (err) {
      console.error('Failed to delete property:', err);
      setSnackbarMsg('Error removing property');
      setSnackbarOpen(true);
    }
  };

  const owner = property.owner || {};
  const ownerName = owner.username || 'N/A';
  const ownerEmail = owner.email || 'N/A';
  const ownerPhone = owner.contact_no || 'N/A';

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ color: '#800000', fontWeight: 'bold' }}>
            {property.title}
          </Typography>

          <Box>
            {/* ✅ Only show favourites for normal users */}
            {!isAdmin && (
              <IconButton onClick={handleToggleFavorite} size="large">
                {fav ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
              </IconButton>
            )}

            {/* ✅ Show delete button only if admin */}
            {isAdmin && (
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteProperty}
                sx={{
                  ml: 2,
                  backgroundColor: '#800000',
                  '&:hover': { backgroundColor: '#660000' },
                  textTransform: 'none'
                }}
              >
                Remove Property
              </Button>
            )}
          </Box>
        </Box>

        {/* Location */}
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          <LocationOnIcon sx={{ mr: 1, color: '#800000' }} />
          {property.location}
        </Typography>

        {/* Images */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {images.length > 0 ? images.map((img, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={getFirstPropertyImage({ images: [img] })}
                  alt={`${property.title}-${i}`}
                  onError={(e) => { e.target.src = DEFAULT_FALLBACK_IMAGE; }}
                />
              </Card>
            </Grid>
          )) : (
            <Grid item xs={12}>
              <Card>
                <CardMedia component="img" height="300" image={DEFAULT_FALLBACK_IMAGE} />
              </Card>
            </Grid>
          )}
        </Grid>

        {/* Details */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ color: '#800000' }}>
              Property Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><AttachMoneyIcon sx={{ color: '#800000' }} /></ListItemIcon>
                <ListItemText primary={`Price: $${property.price?.toLocaleString() || 'N/A'}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon><HomeIcon sx={{ color: '#800000' }} /></ListItemIcon>
                <ListItemText primary={`Type: ${property.property_type || 'N/A'}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon><StarIcon sx={{ color: '#800000' }} /></ListItemIcon>
                <ListItemText primary={`BHK: ${property.bhk}`} />
              </ListItem>
            </List>
          </Grid>

          {/* Owner Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom sx={{ color: '#800000' }}>
              Owner Details
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon><PersonIcon sx={{ color: '#800000' }} /></ListItemIcon>
                <ListItemText primary={`Name: ${ownerName}`} />
              </ListItem>
              <ListItem>
                <ListItemIcon><EmailIcon sx={{ color: '#800000' }} /></ListItemIcon>
                <ListItemText
                  primary="Email:"
                  secondary={
                    ownerEmail !== 'N/A'
                      ? <MuiLink href={`mailto:${ownerEmail}`} underline="hover">{ownerEmail}</MuiLink>
                      : 'N/A'
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemIcon><PhoneIcon sx={{ color: '#800000' }} /></ListItemIcon>
                <ListItemText
                  primary="Contact:"
                  secondary={
                    ownerPhone !== 'N/A'
                      ? <MuiLink href={`tel:${ownerPhone}`} underline="hover">{ownerPhone}</MuiLink>
                      : 'N/A'
                  }
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        {/* Map */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ color: '#800000' }}>
            Location on Map
          </Typography>
          <Box sx={{ height: 400, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
            <MapContainer center={coords} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={coords}>
                <Popup>
                  <Typography variant="subtitle1">{property.title}</Typography>
                  <Typography variant="body2">{property.location}</Typography>
                </Popup>
              </Marker>
            </MapContainer>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMsg}
      />
    </Container>
  );
};

export default PropertyDetail;         