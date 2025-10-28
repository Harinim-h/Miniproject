import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import axiosInstance from '../api/axios';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const propertyTypes = [
  'Apartment',
  'Villa',
  'Independent House',
  'Plot',
  'Commercial Space',
];

const PostPropertyPage = () => {
  const [form, setForm] = useState({
    title: '',
    location: '',
    price: '',
    property_type: '',
    bhk: '',
    latitude: '',
    longitude: '',
    owner_name: '',
    owner_email: '',
    owner_phone: '',
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.location || !form.price) {
      setSnackbar({
        open: true,
        message: 'Please fill all required fields.',
        severity: 'error',
      });
      return;
    }

    setLoading(true);
    const data = new FormData();

    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    images.forEach((file) => data.append('images', file));

    try {
      await axiosInstance.post('/properties/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSnackbar({
        open: true,
        message: 'Property posted successfully!',
        severity: 'success',
      });

      setForm({
        title: '',
        location: '',
        price: '',
        property_type: '',
        bhk: '',
        latitude: '',
        longitude: '',
        owner_name: '',
        owner_email: '',
        owner_phone: '',
      });

      setImages([]);
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: 'Failed to post property.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <Typography variant="h4" color="primary" gutterBottom align="center">
          Post a New Property
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Property Title */}
          <TextField
            label="Property Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          {/* Location */}
          <TextField
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          {/* Price */}
          <TextField
            label="Price (₹)"
            name="price"
            value={form.price}
            onChange={handleChange}
            type="number"
            fullWidth
            required
            margin="normal"
          />

          {/* Property Type */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Property Type</InputLabel>
            <Select
              name="property_type"
              value={form.property_type}
              onChange={handleChange}
              label="Property Type"
            >
              {propertyTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* BHK */}
          <TextField
            label="BHK"
            name="bhk"
            value={form.bhk}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Latitude */}
          <TextField
            label="Latitude"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            fullWidth
            placeholder="Optional"
            margin="normal"
          />

          {/* Longitude */}
          <TextField
            label="Longitude"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            fullWidth
            placeholder="Optional"
            margin="normal"
          />

          {/* Seller Details */}
          <Typography variant="h6" sx={{ mt: 4 }}>
            Seller Details
          </Typography>

          <TextField
            label="Owner Name"
            name="owner_name"
            value={form.owner_name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Owner Email"
            name="owner_email"
            value={form.owner_email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Owner Phone"
            name="owner_phone"
            value={form.owner_phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          {/* Image Upload */}
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ py: 1.5, mt: 2 }}
          >
            Upload Property Images
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {/* Preview */}
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {images.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt={`preview-${idx}`}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 8,
                  objectFit: 'cover',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                }}
              />
            ))}
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            Submit Property
          </Button>
        </form>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PostPropertyPage;
