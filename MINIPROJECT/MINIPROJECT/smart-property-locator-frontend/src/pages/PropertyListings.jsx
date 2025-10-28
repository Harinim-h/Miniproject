// src/pages/PropertyListings.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Container,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PropertyCard from "../components/Common/PropertyCard";
import properties from "../seed_data/properties"; // ✅ Import your static dataset

const PropertyListings = () => {
  const [searchParams, setSearchParams] = useState({
    location: "",
    min_price: "",
    max_price: "",
    property_type: "",
    bhk: "",
  });

  const [filteredProperties, setFilteredProperties] = useState(properties);

  // ✅ Handle search field change
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Apply filters
  const applyFilters = () => {
    let filtered = properties;

    if (searchParams.location) {
      filtered = filtered.filter((p) =>
        p.location?.toLowerCase().includes(searchParams.location.toLowerCase())
      );
    }

    if (searchParams.min_price) {
      filtered = filtered.filter(
        (p) => p.price >= Number(searchParams.min_price)
      );
    }

    if (searchParams.max_price) {
      filtered = filtered.filter(
        (p) => p.price <= Number(searchParams.max_price)
      );
    }

    if (searchParams.property_type) {
      filtered = filtered.filter(
        (p) =>
          p.property_type &&
          p.property_type
            .toLowerCase()
            .includes(searchParams.property_type.toLowerCase())
      );
    }

    if (searchParams.bhk) {
      filtered = filtered.filter(
        (p) => String(p.bhk) === String(searchParams.bhk)
      );
    }

    setFilteredProperties(filtered);
  };

  // ✅ Clear all filters
  const clearFilters = () => {
    setSearchParams({
      location: "",
      min_price: "",
      max_price: "",
      property_type: "",
      bhk: "",
    });
    setFilteredProperties(properties);
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ my: 4, fontWeight: "bold", color: "#800000" }}
      >
        Property Listings
      </Typography>

      {/* 🔍 Filter Section */}
      <Box
        sx={{
          mb: 6,
          p: 3,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Filter Properties
        </Typography>

        <Grid container spacing={2}>
          {/* 📍 Location */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={searchParams.location}
              onChange={handleSearchChange}
              size="small"
            />
          </Grid>

          {/* 💰 Min Price */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Min Price"
              name="min_price"
              type="number"
              value={searchParams.min_price}
              onChange={handleSearchChange}
              size="small"
              placeholder="Enter minimum price"
            />
          </Grid>

          {/* 💵 Max Price */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Max Price"
              name="max_price"
              type="number"
              value={searchParams.max_price}
              onChange={handleSearchChange}
              size="small"
              placeholder="Enter maximum price"
            />
          </Grid>

          {/* 🏠 Property Type */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Property Type</InputLabel>
              <Select
                name="property_type"
                value={searchParams.property_type}
                onChange={handleSearchChange}
                label="Property Type"
                sx={{ minWidth: "180px" }}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="Apartment">Apartment</MenuItem>
                <MenuItem value="House">House</MenuItem>
                <MenuItem value="Condo">Condo</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* 🛏️ BHK */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>BHK</InputLabel>
              <Select
                name="bhk"
                value={searchParams.bhk}
                onChange={handleSearchChange}
                label="BHK"
                sx={{ minWidth: "150px" }}
              >
                <MenuItem value="">All</MenuItem>
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} BHK
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* 🎛 Buttons */}
        <Box
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={applyFilters}
            
          >
            Apply Filters
          </Button>

          <Button
            variant="contained"
            onClick={clearFilters}
            
          >
            Clear Filters
          </Button>
        </Box>
      </Box>

      {/* 🏡 Property List */}
      <Grid container spacing={4} justifyContent="center">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
              <PropertyCard property={property} />
            </Grid>
          ))
        ) : (
          <Typography align="center" sx={{ width: "100%", mt: 4 }}>
            No properties found.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default PropertyListings;
