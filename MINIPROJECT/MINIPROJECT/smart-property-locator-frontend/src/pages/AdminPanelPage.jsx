import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import ManageUsers from '../components/Admin/ManageUsers';
import ManageProperties from '../components/Admin/ManageProperties';
import ManageAmenities from '../components/Admin/ManageAmenities';
import LoadingSpinner from '../components/Common/LoadingSpinner';

// TabPanel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AdminPanelPage = () => {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  if (authLoading) return <LoadingSpinner />;
  if (!isAdmin) return (
    <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" color="error">Access Denied</Typography>
      <Typography variant="body1" mt={2}>You do not have administrative privileges to view this page.</Typography>
    </Container>
  );

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Panel
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome, {user?.username}. Manage all aspects of the application here.
        </Typography>
      </Box>

      <Box sx={{ width: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          aria-label="admin panel tabs"
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Manage Users" />
          <Tab label="Manage Properties" />
          <Tab label="Manage Amenities" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <ManageUsers />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <ManageProperties />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <ManageAmenities />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default AdminPanelPage;