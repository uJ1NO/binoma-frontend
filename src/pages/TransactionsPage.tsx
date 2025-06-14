import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Download,
  RefreshCw,
  Eye,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

type TransactionStatus = 'pending' | 'completed' | 'failed';
type TransactionType = 'sent' | 'received';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  from: string;
  to: string;
  status: TransactionStatus;
  timestamp: Date;
  fee?: number;
  txHash?: string;
  note?: string;
}

export const TransactionsPage: React.FC = () => {
  const { wallet, isConnected, refreshTransactions } = useWallet();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TransactionStatus>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [isLoading, setIsLoading] = useState(false);

  // Mock transaction data for demonstration
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'received',
      amount: 1500.00,
      currency: 'BiUSD',
      from: '0x1234...5678',
      to: wallet?.address || '',
      status: 'completed',
      timestamp: new Date(2024, 0, 15, 14, 30),
      txHash: '0xabcd...efgh',
      note: 'Payment for services'
    },
    {
      id: '2',
      type: 'sent',
      amount: 250.75,
      currency: 'BiUSD',
      from: wallet?.address || '',
      to: '0x9876...5432',
      status: 'completed',
      timestamp: new Date(2024, 0, 14, 9, 15),
      fee: 0.25,
      txHash: '0xijkl...mnop',
      note: 'Monthly subscription'
    },
    {
      id: '3',
      type: 'received',
      amount: 750.25,
      currency: 'BiUSD',
      from: '0x5555...7777',
      to: wallet?.address || '',
      status: 'pending',
      timestamp: new Date(2024, 0, 13, 16, 45),
      note: 'Contract payment'
    },
    {
      id: '4',
      type: 'sent',
      amount: 100.00,
      currency: 'BiUSD',
      from: wallet?.address || '',
      to: '0x3333...1111',
      status: 'failed',
      timestamp: new Date(2024, 0, 12, 11, 20),
      fee: 0.10,
      note: 'Failed transaction - insufficient gas'
    },
  ];

  const [transactions] = useState<Transaction[]>(mockTransactions);

  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshTransactions();
    setTimeout(() => setIsLoading(false), 1000); // Simulate loading
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.txHash?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return b.timestamp.getTime() - a.timestamp.getTime();
    } else {
      return b.amount - a.amount;
    }
  });

  const getStatusIcon = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/10';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'failed':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(amount) + ` ${currency}`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-binomena-dark via-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-binomena-primary to-binomena-secondary rounded-2xl flex items-center justify-center mb-4">
            <ArrowUpRight className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">You need to connect your wallet to view transaction history</p>
          <a
            href="/wallet"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all"
          >
            Connect Wallet
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-binomena-dark via-gray-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>
            <p className="text-gray-400">Track all your BiUSD transactions</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-binomena-primary hover:bg-green-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/20 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | TransactionStatus)}
              className="bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
            >
              <option value="all" className="bg-gray-800">All Status</option>
              <option value="completed" className="bg-gray-800">Completed</option>
              <option value="pending" className="bg-gray-800">Pending</option>
              <option value="failed" className="bg-gray-800">Failed</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | TransactionType)}
              className="bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
            >
              <option value="all" className="bg-gray-800">All Types</option>
              <option value="sent" className="bg-gray-800">Sent</option>
              <option value="received" className="bg-gray-800">Received</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
            >
              <option value="date" className="bg-gray-800">Sort by Date</option>
              <option value="amount" className="bg-gray-800">Sort by Amount</option>
            </select>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden">
          {filteredTransactions.length > 0 ? (
            <div className="divide-y divide-white/10">
              {filteredTransactions.map((tx, index) => (
                <motion.div
                  key={tx.id}
                  className="p-6 hover:bg-white/5 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Transaction Type Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        tx.type === 'sent' ? 'bg-red-400/20' : 'bg-green-400/20'
                      }`}>
                        {tx.type === 'sent' ? (
                          <ArrowUpRight className="w-6 h-6 text-red-400" />
                        ) : (
                          <ArrowDownLeft className="w-6 h-6 text-green-400" />
                        )}
                      </div>

                      {/* Transaction Details */}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-white font-medium">
                            {tx.type === 'sent' ? 'Sent to' : 'Received from'} {formatAddress(tx.type === 'sent' ? tx.to : tx.from)}
                          </h3>
                          {getStatusIcon(tx.status)}
                        </div>
                        <p className="text-gray-400 text-sm">{formatDate(tx.timestamp)}</p>
                        {tx.note && (
                          <p className="text-gray-300 text-sm mt-1">{tx.note}</p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      {/* Amount */}
                      <div className={`text-lg font-semibold ${
                        tx.type === 'sent' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {tx.type === 'sent' ? '-' : '+'}{formatCurrency(tx.amount, tx.currency)}
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </div>
                      
                      {/* Fee (for sent transactions) */}
                      {tx.type === 'sent' && tx.fee && (
                        <p className="text-gray-400 text-sm">Fee: {formatCurrency(tx.fee, tx.currency)}</p>
                      )}
                      
                      {/* Transaction Hash */}
                      {tx.txHash && (
                        <button className="flex items-center space-x-1 text-binomena-primary hover:text-green-400 text-sm mt-1">
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-400/20 rounded-full flex items-center justify-center mb-4">
                <ArrowUpRight className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-2">No transactions found</h3>
              <p className="text-gray-400">
                {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                  ? 'Try adjusting your filters to see more results.'
                  : 'Your transactions will appear here once you start using your wallet.'}
              </p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {filteredTransactions.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-white font-medium mb-2">Total Sent</h3>
              <p className="text-2xl font-bold text-red-400">
                {formatCurrency(
                  filteredTransactions
                    .filter(tx => tx.type === 'sent' && tx.status === 'completed')
                    .reduce((sum, tx) => sum + tx.amount, 0),
                  'BiUSD'
                )}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-white font-medium mb-2">Total Received</h3>
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(
                  filteredTransactions
                    .filter(tx => tx.type === 'received' && tx.status === 'completed')
                    .reduce((sum, tx) => sum + tx.amount, 0),
                  'BiUSD'
                )}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <h3 className="text-white font-medium mb-2">Total Transactions</h3>
              <p className="text-2xl font-bold text-white">{filteredTransactions.length}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 