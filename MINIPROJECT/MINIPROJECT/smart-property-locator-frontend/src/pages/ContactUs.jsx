// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Alert } from '@mui/material';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Frontend validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError("Please fill in all fields.");
      return;
    }

    // Save data in localStorage
    const existingQueries = JSON.parse(localStorage.getItem('queries')) || [];
    const newQuery = { ...formData, date: new Date().toLocaleString() };
    const updatedQueries = [...existingQueries, newQuery];
    localStorage.setItem('queries', JSON.stringify(updatedQueries));

    console.log("Contact Form Submitted:", newQuery);
    setSuccess(true);

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Box sx={{ p: 4, bgcolor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Contact Us
        </Typography>

        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Have questions or suggestions? Fill out the form below and we’ll get back to you.
        </Typography>

        {success && <Alert severity="success" sx={{ mb: 2 }}>Message sent successfully!</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            required
          />
          <TextField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            required
          />
          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            fullWidth
            margin="normal"
            size="small"
            multiline
            rows={4}
            required
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            For enquiry call: <strong>9889988999</strong>
          </Typography>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
          >
            Send Message
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ContactUs;
