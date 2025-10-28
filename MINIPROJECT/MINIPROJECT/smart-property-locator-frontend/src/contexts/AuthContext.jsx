// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Set or clear axios auth header
  const setAuthHeader = (accessToken) => {
    if (accessToken) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete axiosInstance.defaults.headers.common["Authorization"];
    }
  };

  // ✅ Register function
  const handleRegister = async (username, email, password) => {
    try {
      await axiosInstance.post("auth/register/", { username, email, password });
      return true;
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message || err);
      return false;
    }
  };

  // ✅ Login (supports admin bypass)
  const handleLogin = async (username, password) => {
    try {
      // 🔹 Admin bypass
      if (username === "admin" && password === "admin1234") {
        const adminUser = { username: "admin", is_staff: true };
        setUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem("is_admin_login", "true");
        localStorage.setItem("admin_user", JSON.stringify(adminUser));
        axiosInstance.defaults.headers.common["Authorization"] = "Bearer admin-token";
        return true;
      }

      // 🔹 Normal user login
      const resp = await axiosInstance.post("auth/token/", { username, password });
      const { access, refresh } = resp.data;

      localStorage.setItem("access_token", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);
      setAuthHeader(access);

      const profileResp = await axiosInstance.get("auth/profile/");
      setUser(profileResp.data);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message || err);
      localStorage.clear();
      setAuthHeader(null);
      setUser(null);
      setIsAuthenticated(false);
      return false;
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    setAuthHeader(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
  };

  // ✅ Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");
      const isAdminLogin = localStorage.getItem("is_admin_login");
      const storedAdmin = localStorage.getItem("admin_user");

      // 🔹 If admin bypass session
      if (isAdminLogin === "true" && storedAdmin) {
        const adminUser = JSON.parse(storedAdmin);
        setUser(adminUser);
        setIsAuthenticated(true);
        axiosInstance.defaults.headers.common["Authorization"] = "Bearer admin-token";
        setLoading(false);
        return;
      }

      // 🔹 Normal user session
      if (!accessToken) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(accessToken);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setAuthHeader(null);
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setAuthHeader(accessToken);
        const res = await axiosInstance.get("auth/profile/");
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Auth loadUser error:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setAuthHeader(null);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const isAdmin = !!user?.is_staff;
  const isPropertyOwner = !!user?.is_property_owner;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        isPropertyOwner,
        handleLogin,
        handleRegister,
        handleLogout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
