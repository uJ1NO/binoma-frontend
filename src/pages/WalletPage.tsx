import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { 
  Wallet, 
  Send, 
  Download, 
  History, 
  RefreshCw,
  Copy,
  Eye,
  EyeOff
} from 'lucide-react';

type TabType = 'dashboard' | 'send' | 'receive' | 'history';

export const WalletPage: React.FC = () => {
  const { wallet, isConnected, isLoading, error, recentTransactions, generateWallet, connectWallet, refreshBalance, disconnect } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mode, setMode] = useState<'select' | 'connect' | 'create'>('select');
  const [privateKey, setPrivateKey] = useState('');
  const [email, setEmail] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  // If not connected, show wallet connection interface
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-binomena-dark via-gray-900 to-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <motion.div
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-binomena-primary to-binomena-secondary rounded-2xl flex items-center justify-center mb-4">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">BiUSD Wallet</h1>
              <p className="text-gray-300">Connect or create your wallet to get started</p>
            </div>

            {mode === 'select' && (
              <div className="space-y-4">
                <motion.button
                  onClick={() => setMode('create')}
                  className="w-full bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 text-white font-medium py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <Wallet className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Create New Wallet</div>
                      <div className="text-sm opacity-75">Generate a new BiUSD wallet</div>
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => setMode('connect')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-4 px-6 rounded-xl transition-all border border-white/20"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-center space-x-3">
                    <RefreshCw className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-semibold">Connect Existing Wallet</div>
                      <div className="text-sm opacity-75">Import with private key</div>
                    </div>
                  </div>
                </motion.button>
              </div>
            )}

            {mode === 'create' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setMode('select')}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => generateWallet(email)}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Creating...' : 'Create Wallet'}
                  </button>
                </div>
              </div>
            )}

            {mode === 'connect' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Private Key
                  </label>
                  <div className="relative">
                    <input
                      type={showPrivateKey ? 'text' : 'password'}
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      placeholder="Enter your private key"
                      className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPrivateKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setMode('select')}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => connectWallet(privateKey)}
                    disabled={isLoading || !privateKey}
                    className="flex-1 bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                {error}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Connected wallet dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-binomena-dark via-gray-900 to-black py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">BiUSD Wallet</h1>
            <p className="text-gray-400">Manage your digital assets</p>
          </div>
          <button
            onClick={disconnect}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>

        {/* Balance Card */}
        <motion.div 
          className="bg-gradient-to-br from-binomena-primary/20 to-binomena-secondary/20 backdrop-blur-lg rounded-2xl p-6 text-white mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-300 text-sm">Current Balance</p>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">
                  {wallet?.balance?.toFixed(4) || '0.0000'}
                </span>
                <span className="text-lg text-gray-300">BiUSD</span>
              </div>
            </div>
            <motion.button
              onClick={refreshBalance}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
          
          <div className="pt-4 border-t border-white/20">
            <p className="text-gray-300 text-xs">Wallet Address</p>
            <div className="flex items-center space-x-2 mt-1">
              <p className="font-mono text-sm">
                {wallet?.address ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-6)}` : 'N/A'}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(wallet?.address || '')}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/10 rounded-lg p-1 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Wallet },
            { id: 'send', label: 'Send', icon: Send },
            { id: 'receive', label: 'Receive', icon: Download },
            { id: 'history', label: 'History', icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-binomena-primary to-binomena-secondary text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <p className="text-white font-medium">Transaction</p>
                        <p className="text-gray-400 text-sm">{new Date().toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">+0.0000 BiUSD</p>
                        <p className="text-gray-400 text-sm">Pending</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No recent transactions</p>
              )}
            </div>
          )}

          {activeTab === 'send' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Send BiUSD</h2>
              <div className="space-y-6">
                {/* Recipient Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter BiUSD wallet address"
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary font-mono"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (BiUSD)
                  </label>
                  <input
                    type="number"
                    placeholder="0.0000"
                    className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    Available: {wallet?.balance?.toFixed(4) || '0.0000'} BiUSD
                  </p>
                </div>

                {/* Fee Information */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-blue-300 font-medium">Transaction Fee</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    BINOMENA charges a <strong>0.1%</strong> fee on all BiUSD transfers.
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Example: Sending 1000 BiUSD = 1.00 BiUSD fee
                  </p>
                </div>

                {/* Transaction Summary */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Transaction Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-white">0.0000 BiUSD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Transaction Fee (0.1%):</span>
                      <span className="text-red-400">-0.0000 BiUSD</span>
                    </div>
                    <div className="border-t border-white/20 pt-2 flex justify-between font-medium">
                      <span className="text-gray-300">Total Deducted:</span>
                      <span className="text-white">0.0000 BiUSD</span>
                    </div>
                  </div>
                </div>

                {/* Send Button */}
                <button
                  disabled={true}
                  className="w-full bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send BiUSD
                </button>
                
                <p className="text-gray-400 text-xs text-center">
                  Send functionality will be available in the next update
                </p>
              </div>
            </div>
          )}

          {activeTab === 'receive' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Receive BiUSD</h2>
              <div className="text-center py-8">
                <div className="bg-white p-4 rounded-lg inline-block mb-4">
                  {/* QR Code placeholder */}
                  <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">QR Code</span>
                  </div>
                </div>
                <p className="text-white font-medium mb-2">Your Wallet Address</p>
                <div className="flex items-center justify-center space-x-2">
                  <code className="bg-black/20 px-4 py-2 rounded text-binomena-primary font-mono text-sm">
                    {wallet?.address || 'N/A'}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(wallet?.address || '')}
                    className="bg-binomena-primary hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Copy Address
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Transaction History</h2>
              <p className="text-gray-400 text-center py-8">No transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 