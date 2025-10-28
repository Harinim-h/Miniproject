// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";
import Home from "./pages/Home";
import PropertyListings from "./pages/PropertyListings";
import PropertyDetail from "./pages/PropertyDetail";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import UserDashboardPage from "./pages/UserDashboard";
import AdminPanelPage from "./pages/AdminPanelPage";
import PostProperties from "./pages/postproperties";
import NotFound from "./pages/NotFound";
import FavoritesPage from "./pages/FavoritesPage";
import LoadingSpinner from "./components/Common/LoadingSpinner";
import ContactUs from "./pages/ContactUs";
import Query from "./pages/Querypage";
import { Box, Typography, Container } from "@mui/material";

/* ------------------------------------------------------------------
   ✅ PrivateRouteWrapper with debug and admin bypass
------------------------------------------------------------------- */
const PrivateRouteWrapper = ({ children, roles = [] }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const location = useLocation();

  console.log("🔍 PrivateRoute check:", { isAuthenticated, isAdmin, loading });

  if (loading) return <LoadingSpinner />;

  // ✅ Allow admin to view all pages
  if (isAdmin) {
    return children;
  }

  // ✅ Check normal user authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};


/* ------------------------------------------------------------------
   AppRoutes - Defines all routes
------------------------------------------------------------------- */
function AppRoutes() {
  return (
    <Routes>
      {/* ------------------ Public Routes ------------------ */}
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* ------------------ Shared (User + Admin) ------------------ */}
      <Route
        path="/properties"
        element={
          <PrivateRouteWrapper>
            <PropertyListings />
          </PrivateRouteWrapper>
        }
      />
      <Route
        path="/properties/:id"
        element={
          <PrivateRouteWrapper>
            <PropertyDetail />
          </PrivateRouteWrapper>
        }
      />

      {/* ------------------ Post Property (Admin Only) ------------------ */}
      <Route
        path="/post-property"
        element={
          <PrivateRouteWrapper roles={["admin"]}>
            <PostProperties />
          </PrivateRouteWrapper>
        }
      />

      {/* ------------------ Admin Panel ------------------ */}
      <Route
        path="/admin"
        element={
          <PrivateRouteWrapper roles={["admin"]}>
            <AdminPanelPage />
          </PrivateRouteWrapper>
        }
      />

      {/* ------------------ Query Management (Admin Only) ------------------ */}
      <Route
        path="/queries"
        element={
          <PrivateRouteWrapper roles={["admin"]}>
            <Query />
          </PrivateRouteWrapper>
        }
      />

      {/* ------------------ User Dashboard (Owner Only) ------------------ */}
      <Route
        path="/dashboard"
        element={
          <PrivateRouteWrapper roles={["owner"]}>
            <UserDashboardPage />
          </PrivateRouteWrapper>
        }
      />

      {/* ------------------ Favourites (User + Admin) ------------------ */}
      <Route
        path="/favourites"
        element={
          <PrivateRouteWrapper>
            <FavoritesPage />
          </PrivateRouteWrapper>
        }
      />
      <Route path="/favorites" element={<Navigate to="/favourites" replace />} />

      {/* ------------------ Unauthorized Page ------------------ */}
      <Route
        path="/unauthorized"
        element={
          <Container sx={{ textAlign: "center", mt: 8 }}>
            <Typography variant="h4" color="error">
              Unauthorized Access
            </Typography>
            <Typography variant="body1" mt={2}>
              You do not have permission to view this page.
            </Typography>
          </Container>
        }
      />

      {/* ------------------ Not Found ------------------ */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

/* ------------------------------------------------------------------
   App Component - Wraps AuthProvider, Navbar, Footer
------------------------------------------------------------------- */
function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AuthProvider>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <AppRoutes />
        </Box>
        <Footer />
      </AuthProvider>
    </Box>
  );
}

export default App;
