import React, { useEffect, useState } from 'react';
import { 
  Container, Box, Typography, Card, CardContent, 
  Divider, Button, Stack, Chip 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Query = () => {
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const storedQueries = JSON.parse(localStorage.getItem('queries')) || [];
    setQueries(storedQueries);
  }, []);

  // Save changes to localStorage
  const updateStorage = (updatedQueries) => {
    localStorage.setItem('queries', JSON.stringify(updatedQueries));
    setQueries(updatedQueries);
  };

  // Delete query
  const handleDelete = (index) => {
    const updatedQueries = queries.filter((_, i) => i !== index);
    updateStorage(updatedQueries);
  };

  // Toggle resolved status
  const handleToggleResolved = (index) => {
    const updatedQueries = queries.map((q, i) =>
      i === index ? { ...q, resolved: !q.resolved } : q
    );
    updateStorage(updatedQueries);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box sx={{ p: 4, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
        <Typography 
          variant="h5" 
          align="center" 
          gutterBottom 
          sx={{ color: '#800000', fontWeight: 'bold' }}
        >
          User Queries
        </Typography>

        {queries.length === 0 ? (
          <Typography align="center" sx={{ mt: 3, color: '#800000' }}>
            No queries found.
          </Typography>
        ) : (
          queries.map((query, index) => (
            <Card 
              key={index} 
              sx={{ 
                mb: 3, 
                boxShadow: 3, 
                
              }}
            >
              <CardContent>
                <Stack 
                  direction="row" 
                  alignItems="center" 
                  justifyContent="space-between"
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#800000' }}>
                    {query.subject}
                  </Typography>
                  <Chip 
                    label={query.resolved ? 'Resolved' : 'Pending'} 
                    sx={{
                      backgroundColor: query.resolved ? '#800000' : '#f5f5f5',
                      color: query.resolved ? 'white' : '#800000',
                      fontWeight: 'bold'
                    }}
                    size="small"
                  />
                </Stack>

                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Name:</strong> {query.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Email:</strong> {query.email}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>Message:</strong> {query.message}
                </Typography>

                <Divider sx={{ my: 1 }} />

                <Typography variant="caption" color="text.secondary">
                  Submitted on: {query.date}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleToggleResolved(index)}
                    sx={{
                      backgroundColor: '#800000',
                      '&:hover': { backgroundColor: '#660000' },
                      textTransform: 'none'
                    }}
                    startIcon={query.resolved ? <CheckCircleIcon /> : null}
                  >
                    {query.resolved ? 'Resolved' : 'Mark Resolved'}
                  </Button>

                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(index)}
                    sx={{
                      borderColor: '#800000',
                      color: '#800000',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: '#800000',
                        color: 'white',
                        borderColor: '#800000'
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  );
};

export default Query;
