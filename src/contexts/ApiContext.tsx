import React, { createContext, useContext, useEffect, useState } from 'react';
import ApiService from '../services/api';

interface ApiContextType {
  isOnline: boolean;
  apiHealth: boolean;
  checkHealth: () => Promise<void>;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [apiHealth, setApiHealth] = useState(false);

  const checkHealth = async () => {
    try {
      const healthy = await ApiService.checkApiHealth();
      setApiHealth(healthy);
    } catch (error) {
      setApiHealth(false);
    }
  };

  useEffect(() => {
    // Check API health on mount
    checkHealth();

    // Set up online/offline listeners
    const handleOnline = () => {
      setIsOnline(true);
      checkHealth();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setApiHealth(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic health check
    const healthInterval = setInterval(checkHealth, 60000); // Every minute

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(healthInterval);
    };
  }, []);

  const value: ApiContextType = {
    isOnline,
    apiHealth,
    checkHealth,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
}; 