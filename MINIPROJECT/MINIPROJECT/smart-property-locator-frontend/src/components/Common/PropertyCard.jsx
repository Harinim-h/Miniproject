// src/components/Common/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button, CardActions } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { getFirstPropertyImage, DEFAULT_FALLBACK_IMAGE } from '../../utils/images';

const PropertyCard = ({ property }) => {
  // Get the proper image URL (from imageUrl, images array, or fallback)
  const finalImageUrl = getFirstPropertyImage(property) || DEFAULT_FALLBACK_IMAGE;

  return (
    <Card
      sx={{
        maxWidth: 345,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        borderRadius: 2,
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.03)' },
      }}
    >
      {/* Property Image */}
      <CardMedia
        component="img"
        height="190"
        image={finalImageUrl}
        alt={property.title || 'Property'}
        sx={{ objectFit: 'cover' }}
        onError={(e) => {
          if (e?.target) e.target.src = DEFAULT_FALLBACK_IMAGE;
        }}
      />

      {/* Property Info */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {property.title || 'Untitled'}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
          noWrap
        >
          <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} /> {property.location || 'N/A'}
        </Typography>

        <Typography variant="h6" color="primary.main" sx={{ display: 'flex', alignItems: 'center' }}>
          <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} />{' '}
          {property.price ? Number(property.price).toLocaleString() : 'N/A'}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions>
        <Button size="small" component={Link} to={`/properties/${property.id}`}>
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default PropertyCard;
