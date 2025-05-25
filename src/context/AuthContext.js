import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage immediately
  const initialAuthState = authService.isAuthenticated();
  const initialUser = authService.getUser();
  
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState);
  const [user, setUser] = useState(initialUser);

  // Keep auth state in sync with localStorage
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = authService.getUser();
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    authService.logout(); // This will clear localStorage
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);