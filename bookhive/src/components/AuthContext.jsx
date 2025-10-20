// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // e.g., { email, userId, role, name }
  const tokenCheckInterval = useRef(null);

  const login = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        console.error('Token expired');
        logout();
        return;
      }

      setUser({
        email: decoded.sub,
        userId: decoded.User_id,
        role: decoded.role,
        name: decoded.name, // Include name from JWT
      });
      localStorage.setItem('token', token);

      // Start token expiration checker
      startTokenExpirationCheck();
    } catch (error) {
      console.error('Invalid token:', error);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');

    // Clear token expiration checker
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
      tokenCheckInterval.current = null;
    }
  };

  // Check token expiration every 30 seconds
  const startTokenExpirationCheck = () => {
    // Clear any existing interval
    if (tokenCheckInterval.current) {
      clearInterval(tokenCheckInterval.current);
    }

    tokenCheckInterval.current = setInterval(() => {
      const token = localStorage.getItem('token');

      if (!token) {
        logout();
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // If token expired, logout
        if (decoded.exp < currentTime) {
          console.log('Token expired, logging out...');
          logout();
        }
      } catch (error) {
        console.error('Error checking token expiration:', error);
        logout();
      }
    }, 30000); // Check every 30 seconds
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if token is still valid
        if (decoded.exp > currentTime) {
          setUser({
            email: decoded.sub,
            userId: decoded.User_id,
            role: decoded.role,
            name: decoded.name,
          });

          // Start token expiration checker
          startTokenExpirationCheck();
        } else {
          // Token expired, clear it
          console.log('Token expired on load');
          logout();
        }
      } catch (error) {
        console.error('Invalid token on load:', error);
        logout();
      }
    }

    // Cleanup interval on unmount
    return () => {
      if (tokenCheckInterval.current) {
        clearInterval(tokenCheckInterval.current);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};