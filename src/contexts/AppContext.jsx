import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user has completed wizard before
    const hasCompletedWizard = localStorage.getItem('hasCompletedWizard');
    const savedUser = localStorage.getItem('currentUser');
    
    if (hasCompletedWizard) {
      setIsFirstTime(false);
    }
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const completeWizard = () => {
    setIsFirstTime(false);
    localStorage.setItem('hasCompletedWizard', 'true');
  };

  const login = (username, password) => {
    // Simple authentication
    if (username === 'john' && password === '123123') {
      const userData = { username: 'john', name: 'John Doe' };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const value = {
    isFirstTime,
    isAuthenticated,
    user,
    completeWizard,
    login,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
