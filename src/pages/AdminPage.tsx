import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import type { 
  DetailedUsersResponse,
  UserDetails,
  UserTransaction,
  SystemLog,
  WalletAnalytics,
  TransactionAnalytics,
  AuditEntry
} from '../types/api';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'transactions' | 'system' | 'audit' | 'emergency'>('users');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // User Management State
  const [usersData, setUsersData] = useState<DetailedUsersResponse | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [userTransactions, setUserTransactions] = useState<UserTransaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Analytics State
  const [walletAnalytics, setWalletAnalytics] = useState<WalletAnalytics | null>(null);
  const [transactionAnalytics, setTransactionAnalytics] = useState<TransactionAnalytics | null>(null);

  // System State
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);

  // Emergency Controls State
  const [emergencyReason, setEmergencyReason] = useState('');
  const [targetWallet, setTargetWallet] = useState('');

  const founderAddress = "DIS1FOUNDER00000000000000000000000000";

  useEffect(() => {
    loadInitialData();
  }, [activeTab]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      switch (activeTab) {
        case 'users':
          await loadUsersData();
          break;
        case 'analytics':
          await loadAnalyticsData();
          break;
        case 'system':
          await loadSystemData();
          break;
        case 'audit':
          await loadAuditData();
          break;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadUsersData = async () => {
    const response = await ApiService.getDetailedUsers(founderAddress);
    if (response.success && response.data) {
      setUsersData(response.data);
    } else {
      throw new Error(response.message || 'Failed to load users data');
    }
  };

  const loadAnalyticsData = async () => {
    const [walletResponse, transactionResponse] = await Promise.all([
      ApiService.getWalletAnalytics(founderAddress),
      ApiService.getTransactionAnalytics(founderAddress, '7d')
    ]);

    if (walletResponse.success && walletResponse.data) {
      setWalletAnalytics(walletResponse.data);
    }
    if (transactionResponse.success && transactionResponse.data) {
      setTransactionAnalytics(transactionResponse.data);
    }
  };

  const loadSystemData = async () => {
    const response = await ApiService.getSystemLogs(founderAddress, undefined, 100);
    if (response.success && response.data) {
      setSystemLogs(response.data);
    }
  };

  const loadAuditData = async () => {
    const response = await ApiService.getAuditTrail(founderAddress, undefined, undefined, 100);
    if (response.success && response.data) {
      setAuditTrail(response.data);
    }
  };

  const selectUser = async (user: UserDetails) => {
    try {
      setSelectedUser(user);
      const transactionsResponse = await ApiService.getUserTransactions(user.id, founderAddress, 50);
      if (transactionsResponse.success && transactionsResponse.data) {
        setUserTransactions(transactionsResponse.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load user transactions');
    }
  };

  const suspendUser = async (userId: string, reason: string) => {
    try {
      const response = await ApiService.suspendUser(userId, reason, founderAddress);
      if (response.success) {
        setSuccess('User suspended successfully');
        await loadUsersData();
      } else {
        setError(response.message || 'Failed to suspend user');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to suspend user');
    }
  };

  const unsuspendUser = async (userId: string) => {
    try {
      const response = await ApiService.unsuspendUser(userId, founderAddress);
      if (response.success) {
        setSuccess('User unsuspended successfully');
        await loadUsersData();
      } else {
        setError(response.message || 'Failed to unsuspend user');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to unsuspend user');
    }
  };

  const emergencyFreezeWallet = async () => {
    if (!targetWallet || !emergencyReason) {
      setError('Please provide wallet address and reason');
      return;
    }

    try {
      const response = await ApiService.emergencyFreeze(targetWallet, emergencyReason, founderAddress);
      if (response.success) {
        setSuccess('Wallet frozen successfully');
        setTargetWallet('');
        setEmergencyReason('');
      } else {
        setError(response.message || 'Failed to freeze wallet');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to freeze wallet');
    }
  };

  const emergencyUnfreezeWallet = async () => {
    if (!targetWallet) {
      setError('Please provide wallet address');
      return;
    }

    try {
      const response = await ApiService.emergencyUnfreeze(targetWallet, founderAddress);
      if (response.success) {
        setSuccess('Wallet unfrozen successfully');
        setTargetWallet('');
      } else {
        setError(response.message || 'Failed to unfreeze wallet');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to unfreeze wallet');
    }
  };

  const filteredUsers = usersData?.users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id_number.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'banned': return 'text-red-800 bg-red-200';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-900 mb-2">
            🛡️ Founder Admin Panel
          </h1>
          <p className="text-gray-600">
            Complete system administration and user management
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{success}</p>
            <button 
              onClick={() => setSuccess(null)}
              className="mt-2 text-green-600 hover:text-green-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'users', label: 'User Management', icon: '👥' },
                { id: 'analytics', label: 'Analytics', icon: '📊' },
                { id: 'transactions', label: 'Transactions', icon: '💸' },
                { id: 'system', label: 'System Logs', icon: '📋' },
                { id: 'audit', label: 'Audit Trail', icon: '🔍' },
                { id: 'emergency', label: 'Emergency Controls', icon: '🚨' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Stats */}
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">User Management</h3>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {usersData && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Total Users</h4>
                    <p className="text-2xl font-bold text-blue-600">{usersData.total_users}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">Active Users</h4>
                    <p className="text-2xl font-bold text-green-600">{usersData.active_users}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900">Suspended</h4>
                    <p className="text-2xl font-bold text-red-600">{usersData.suspended_users}</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900">Pending</h4>
                    <p className="text-2xl font-bold text-yellow-600">{usersData.pending_users}</p>
                  </div>
                </div>
              )}

              {/* Users List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Balance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Risk Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.id_number}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ApiService.formatCurrency(user.total_balance)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(user.risk_score)}`}>
                            {user.risk_score}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => selectUser(user)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => suspendUser(user.id, 'Admin action')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => unsuspendUser(user.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Unsuspend
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900">User Details: {selectedUser.full_name}</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Information */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
                    <div className="space-y-2">
                      <div><strong>ID:</strong> {selectedUser.id}</div>
                      <div><strong>ID Number:</strong> {selectedUser.id_number}</div>
                      <div><strong>Email:</strong> {selectedUser.email}</div>
                      <div><strong>Phone:</strong> {selectedUser.phone || 'Not provided'}</div>
                      <div><strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedUser.status)}`}>{selectedUser.status}</span></div>
                      <div><strong>KYC Verified:</strong> {selectedUser.kyc_verified ? '✅ Yes' : '❌ No'}</div>
                      <div><strong>Registration Fee:</strong> {ApiService.formatCurrency(selectedUser.registration_fee)}</div>
                      <div><strong>Registration Paid:</strong> {selectedUser.registration_paid ? '✅ Yes' : '❌ No'}</div>
                      <div><strong>Risk Score:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getRiskColor(selectedUser.risk_score)}`}>{selectedUser.risk_score}%</span></div>
                      <div><strong>Created:</strong> {new Date(selectedUser.created_at).toLocaleString()}</div>
                      <div><strong>Last Login:</strong> {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : 'Never'}</div>
                    </div>
                  </div>

                  {/* Wallets */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Wallets ({selectedUser.wallets.length})</h4>
                    <div className="space-y-3">
                      {selectedUser.wallets.map((wallet) => (
                        <div key={wallet.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900">{wallet.address}</div>
                          <div className="text-sm text-gray-600">Balance: {ApiService.formatCurrency(wallet.balance)} {wallet.currency}</div>
                          <div className="text-sm text-gray-600">Transactions: {wallet.transaction_count}</div>
                          <div className="text-sm text-gray-600">Status: <span className={`px-1 py-0.5 rounded text-xs ${getStatusColor(wallet.status)}`}>{wallet.status}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Transactions</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userTransactions.slice(0, 10).map((tx) => (
                          <tr key={tx.id}>
                            <td className="px-4 py-2 text-sm text-gray-900">{tx.id.substring(0, 8)}...</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{tx.type}</td>
                            <td className="px-4 py-2 text-sm text-gray-900">{ApiService.formatCurrency(tx.amount)}</td>
                            <td className="px-4 py-2 text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(tx.status)}`}>
                                {tx.status}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900">{new Date(tx.timestamp).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Wallet Analytics */}
            {walletAnalytics && (
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Wallet Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Total Wallets</h4>
                    <p className="text-2xl font-bold text-blue-600">{walletAnalytics.total_wallets}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">Active Wallets</h4>
                    <p className="text-2xl font-bold text-green-600">{walletAnalytics.active_wallets}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900">Frozen Wallets</h4>
                    <p className="text-2xl font-bold text-red-600">{walletAnalytics.frozen_wallets}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Balance Statistics</h4>
                    <div className="space-y-2">
                      <div><strong>Total Balance:</strong> {ApiService.formatCurrency(walletAnalytics.total_balance)}</div>
                      <div><strong>Average Balance:</strong> {ApiService.formatCurrency(walletAnalytics.average_balance)}</div>
                      <div><strong>Largest Wallet:</strong> {walletAnalytics.largest_wallet.address.substring(0, 20)}... ({ApiService.formatCurrency(walletAnalytics.largest_wallet.balance)})</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Balance Distribution</h4>
                    <div className="space-y-2">
                      {walletAnalytics.distribution.map((dist, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{dist.range}</span>
                          <span>{dist.count} ({dist.percentage.toFixed(1)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Analytics */}
            {transactionAnalytics && (
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Transaction Analytics (Last 7 Days)</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-900">Total Transactions</h4>
                    <p className="text-2xl font-bold text-purple-600">{transactionAnalytics.total_transactions}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">Successful</h4>
                    <p className="text-2xl font-bold text-green-600">{transactionAnalytics.successful_transactions}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <h4 className="font-semibold text-red-900">Failed</h4>
                    <p className="text-2xl font-bold text-red-600">{transactionAnalytics.failed_transactions}</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900">Total Volume</h4>
                    <p className="text-2xl font-bold text-yellow-600">{ApiService.formatCurrency(transactionAnalytics.total_volume)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Transaction Types</h4>
                    <div className="space-y-2">
                      {Object.entries(transactionAnalytics.transactions_by_type).map(([type, count]) => (
                        <div key={type} className="flex justify-between">
                          <span className="capitalize">{type}</span>
                          <span>{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Key Metrics</h4>
                    <div className="space-y-2">
                      <div><strong>Average Transaction:</strong> {ApiService.formatCurrency(transactionAnalytics.average_transaction_size)}</div>
                      <div><strong>Total Fees:</strong> {ApiService.formatCurrency(transactionAnalytics.total_fees)}</div>
                      <div><strong>Success Rate:</strong> {((transactionAnalytics.successful_transactions / transactionAnalytics.total_transactions) * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* System Logs Tab */}
        {activeTab === 'system' && (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">System Logs</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Module</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {systemLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          log.level === 'error' ? 'bg-red-100 text-red-800' :
                          log.level === 'warn' ? 'bg-yellow-100 text-yellow-800' :
                          log.level === 'info' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {log.level.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.module}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{log.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user_id || 'System'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(log.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Trail Tab */}
        {activeTab === 'audit' && (
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Audit Trail</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditTrail.map((entry) => (
                    <tr key={entry.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.action}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{entry.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.user_id || 'System'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.ip_address || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(entry.timestamp).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Emergency Controls Tab */}
        {activeTab === 'emergency' && (
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4">🚨 Emergency Controls</h3>
              <p className="text-red-700 mb-6">
                These controls should only be used in emergency situations. All actions are logged and audited.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Freeze Wallet */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Freeze Wallet</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Wallet Address"
                      value={targetWallet}
                      onChange={(e) => setTargetWallet(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <textarea
                      placeholder="Reason for freezing"
                      value={emergencyReason}
                      onChange={(e) => setEmergencyReason(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      rows={3}
                    />
                    <button
                      onClick={emergencyFreezeWallet}
                      className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                    >
                      🧊 Freeze Wallet
                    </button>
                  </div>
                </div>

                {/* Unfreeze Wallet */}
                <div className="bg-white p-4 rounded-lg border">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Unfreeze Wallet</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Wallet Address"
                      value={targetWallet}
                      onChange={(e) => setTargetWallet(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                    <button
                      onClick={emergencyUnfreezeWallet}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:ring-2 focus:ring-green-500"
                    >
                      🔓 Unfreeze Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 