import React, { createContext, useContext, useEffect, useState } from 'react';
import ApiService from '../services/api';
import type { Wallet, Transaction } from '../types/api';

interface WalletContextType {
  wallet: Wallet | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  recentTransactions: Transaction[];
  connectWallet: (privateKey: string) => Promise<void>;
  generateWallet: (email?: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  disconnect: () => void;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  const isConnected = wallet !== null;

  const clearError = () => setError(null);

  const connectWallet = async (privateKey: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ApiService.connectWallet({ private_key: privateKey });
      
      if (response.success && response.data) {
        setWallet(response.data);
        
        // Store wallet info in localStorage
        localStorage.setItem('wallet_address', response.data.address);
        localStorage.setItem('wallet_private_key', privateKey);
        
        // Fetch recent transactions
        await fetchTransactions(response.data.address);
      } else {
        throw new Error(response.error || 'Failed to connect wallet');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const generateWallet = async (email?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ApiService.generateWallet({ user_email: email });
      
      if (response.success && response.data) {
        setWallet(response.data);
        
        // Store wallet info in localStorage
        localStorage.setItem('wallet_address', response.data.address);
        
        // Fetch recent transactions
        await fetchTransactions(response.data.address);
      } else {
        throw new Error(response.error || 'Failed to generate wallet');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBalance = async () => {
    if (!wallet) return;

    try {
      const response = await ApiService.getWalletBalance(wallet.address);
      
      if (response.success && response.data) {
        setWallet(response.data);
      }
    } catch (err: any) {
      console.error('Failed to refresh balance:', err);
    }
  };

  const fetchTransactions = async (address: string) => {
    try {
      const response = await ApiService.getWalletTransactions(address, { limit: 10 });
      
      if (response.success && response.data) {
        setRecentTransactions(response.data.transactions);
      }
    } catch (err: any) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const refreshTransactions = async () => {
    if (!wallet) return;
    await fetchTransactions(wallet.address);
  };

  const disconnect = () => {
    setWallet(null);
    setRecentTransactions([]);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('wallet_address');
    localStorage.removeItem('wallet_private_key');
  };

  // Auto-connect on page load if wallet info exists
  useEffect(() => {
    const savedAddress = localStorage.getItem('wallet_address');
    const savedPrivateKey = localStorage.getItem('wallet_private_key');

    if (savedAddress && savedPrivateKey) {
      // Try to reconnect
      connectWallet(savedPrivateKey).catch(() => {
        // If reconnection fails, clear stored data
        localStorage.removeItem('wallet_address');
        localStorage.removeItem('wallet_private_key');
      });
    }
  }, []);

  // Periodic balance refresh
  useEffect(() => {
    if (!wallet) return;

    const balanceInterval = setInterval(refreshBalance, 30000); // Every 30 seconds
    const transactionInterval = setInterval(refreshTransactions, 60000); // Every minute

    return () => {
      clearInterval(balanceInterval);
      clearInterval(transactionInterval);
    };
  }, [wallet]);

  const value: WalletContextType = {
    wallet,
    isConnected,
    isLoading,
    error,
    recentTransactions,
    connectWallet,
    generateWallet,
    refreshBalance,
    refreshTransactions,
    disconnect,
    clearError,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}; 