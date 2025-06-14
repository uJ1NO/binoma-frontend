import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api';
import type { 
  FounderDashboard, 
  GovernanceStats,
  RegistrationStats,
  TreasuryStats,
  BankAccount,
  WithdrawalRequest
} from '../types/api';

export const FounderPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<FounderDashboard | null>(null);
  const [governanceStats, setGovernanceStats] = useState<GovernanceStats | null>(null);
  const [registrationStats, setRegistrationStats] = useState<RegistrationStats | null>(null);
  const [treasuryStats, setTreasuryStats] = useState<TreasuryStats | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'governance' | 'registration' | 'treasury' | 'endpoints' | 'health'>('overview');
  const [testingEndpoints, setTestingEndpoints] = useState(false);

  const founderAddress = "DIS1FOUNDER00000000000000000000000000";

  useEffect(() => {
    loadFounderData();
  }, []);

  const loadFounderData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [
        dashboardResponse,
        governanceResponse,
        registrationResponse,
        treasuryResponse,
        bankAccountsResponse,
        withdrawalsResponse
      ] = await Promise.allSettled([
        ApiService.getFounderDashboard(),
        ApiService.getGovernanceStats(),
        ApiService.getRegistrationStats(founderAddress),
        ApiService.getTreasuryStats(),
        ApiService.getBankAccounts(),
        ApiService.getWithdrawalHistory()
      ]);

      // Handle dashboard data
      if (dashboardResponse.status === 'fulfilled' && dashboardResponse.value.success) {
        setDashboardData(dashboardResponse.value.data!);
      }

      // Handle governance data
      if (governanceResponse.status === 'fulfilled' && governanceResponse.value.success) {
        setGovernanceStats(governanceResponse.value.data!);
      }

      // Handle registration data
      if (registrationResponse.status === 'fulfilled' && registrationResponse.value.success) {
        setRegistrationStats(registrationResponse.value.data!);
      }

      // Handle treasury data
      if (treasuryResponse.status === 'fulfilled' && treasuryResponse.value.success) {
        setTreasuryStats(treasuryResponse.value.data!);
      }

      // Handle bank accounts
      if (bankAccountsResponse.status === 'fulfilled' && bankAccountsResponse.value.success) {
        setBankAccounts(bankAccountsResponse.value.data!);
      }

      // Handle withdrawal history
      if (withdrawalsResponse.status === 'fulfilled' && withdrawalsResponse.value.success) {
        setWithdrawalHistory(withdrawalsResponse.value.data!);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load founder dashboard');
    } finally {
      setLoading(false);
    }
  };

  const testAllEndpoints = async () => {
    try {
      setTestingEndpoints(true);
      const healthChecks = await ApiService.testAllEndpoints();
      console.log('API Health Checks:', healthChecks);
    } catch (err: any) {
      setError(err.message || 'Failed to test endpoints');
    } finally {
      setTestingEndpoints(false);
    }
  };

  const enableGovernance = async (enabled: boolean) => {
    try {
      const response = await ApiService.enableGovernance(enabled, founderAddress);
      if (response.success) {
        loadFounderData(); // Reload data
      } else {
        setError(response.message || 'Failed to update governance');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update governance');
    }
  };

  // Utility functions for status display (currently unused but may be needed for health monitoring)
  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case 'success': return 'text-green-600 bg-green-100';
  //     case 'error': return 'text-red-600 bg-red-100';
  //     case 'timeout': return 'text-yellow-600 bg-yellow-100';
  //     default: return 'text-gray-600 bg-gray-100';
  //   }
  // };

  // const getHealthIcon = (status: string) => {
  //   switch (status) {
  //     case 'success': return '✅';
  //     case 'error': return '❌';
  //     case 'timeout': return '⏱️';
  //     default: return '❓';
  //   }
  // };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading founder dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-900 mb-2">
          👑 Founder Dashboard
        </h1>
        <p className="text-gray-600">
          Complete system oversight and management for Binoma DIS
        </p>
      </div>

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

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'System Overview', icon: '📊' },
              { id: 'governance', label: 'Governance', icon: '🗳️' },
              { id: 'registration', label: 'Registration', icon: '👥' },
              { id: 'treasury', label: 'Treasury', icon: '🏦' },
              { id: 'endpoints', label: 'API Endpoints', icon: '🔗' },
              { id: 'health', label: 'Health Monitoring', icon: '💚' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
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

      {/* Overview Tab */}
      {activeTab === 'overview' && dashboardData && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">
                {dashboardData.total_users.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">System Health: {dashboardData.system_health}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Volume</h3>
              <p className="text-3xl font-bold text-green-600">
                {ApiService.formatCurrency(dashboardData.total_volume)} BiUSD
              </p>
              <p className="text-sm text-gray-500">
                {dashboardData.total_transactions.toLocaleString()} transactions
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-purple-600">
                {ApiService.formatCurrency(dashboardData.total_revenue)} BiUSD
              </p>
              <p className="text-sm text-gray-500">Platform earnings</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Treasury Balance</h3>
              <p className="text-3xl font-bold text-green-600">
                {ApiService.formatCurrency(dashboardData.treasury_balance)} BiUSD
              </p>
              <p className="text-sm text-gray-500">
                {ApiService.formatCurrency(dashboardData.circulating_supply)} circulating
              </p>
            </div>
          </div>

          {/* System Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Governance Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Enabled:</span>
                  <span className={dashboardData.governance_enabled ? 'text-green-600' : 'text-red-600'}>
                    {dashboardData.governance_enabled ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Active Proposals:</span>
                  <span className="font-medium">{dashboardData.active_proposals}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Registration Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Total Registrations:</span>
                  <span className="font-medium">{dashboardData.total_registrations}</span>
                </div>
                <div className="flex justify-between">
                  <span>Free Remaining:</span>
                  <span className="font-medium">{dashboardData.free_registrations_remaining}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Treasury Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pending Withdrawals:</span>
                  <span className="font-medium">{dashboardData.pending_withdrawals}</span>
                </div>
                <div className="flex justify-between">
                  <span>Monthly Limit:</span>
                  <span className="font-medium">
                    {ApiService.formatCurrency(dashboardData.monthly_withdrawal_limit)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Governance Tab */}
      {activeTab === 'governance' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Governance Management</h3>
              <button
                onClick={() => enableGovernance(!governanceStats?.enabled)}
                className={`px-4 py-2 rounded-md font-medium ${
                  governanceStats?.enabled 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {governanceStats?.enabled ? 'Disable Governance' : 'Enable Governance'}
              </button>
            </div>
            
            {governanceStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Status</h4>
                  <p className={`text-lg font-bold ${governanceStats.enabled ? 'text-green-600' : 'text-red-600'}`}>
                    {governanceStats.enabled ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Total Members</h4>
                  <p className="text-lg font-bold text-green-600">{governanceStats.total_members}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Active Proposals</h4>
                  <p className="text-lg font-bold text-purple-600">{governanceStats.active_proposals}</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">Total Proposals</h4>
                  <p className="text-lg font-bold text-yellow-600">{governanceStats.total_proposals}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Registration Tab */}
      {activeTab === 'registration' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Registration Statistics</h3>
            
            {registrationStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Total Registrations</h4>
                  <p className="text-2xl font-bold text-blue-600">{registrationStats.total_registrations}</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Free Used</h4>
                  <p className="text-2xl font-bold text-green-600">{registrationStats.free_registrations_used}</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Free Remaining</h4>
                  <p className="text-2xl font-bold text-purple-600">{registrationStats.free_registrations_remaining}</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">Total Revenue</h4>
                  <p className="text-2xl font-bold text-yellow-600">
                    {ApiService.formatCurrency(registrationStats.total_registration_revenue)} BiUSD
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Treasury Tab */}
      {activeTab === 'treasury' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Treasury Overview</h3>
            
            {treasuryStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">BiUSD Balance</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {ApiService.formatCurrency(treasuryStats.total_biusd_balance)} BiUSD
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900">Total Withdrawn</h4>
                  <p className="text-2xl font-bold text-green-600">
                    ${treasuryStats.total_fiat_withdrawn.toLocaleString()}
                  </p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-900">Pending Withdrawals</h4>
                  <p className="text-2xl font-bold text-purple-600">{treasuryStats.pending_withdrawals}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Bank Accounts ({bankAccounts.length})</h4>
                <div className="space-y-2">
                  {bankAccounts.slice(0, 3).map((account) => (
                    <div key={account.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{account.account_name}</p>
                        <p className="text-sm text-gray-600">{account.bank_name} - {account.currency}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        account.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {account.is_verified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                  ))}
                  {bankAccounts.length > 3 && (
                    <p className="text-sm text-gray-500">+{bankAccounts.length - 3} more accounts</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Recent Withdrawals</h4>
                <div className="space-y-2">
                  {withdrawalHistory.slice(0, 3).map((withdrawal) => (
                    <div key={withdrawal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{withdrawal.amount.toLocaleString()} BiUSD</p>
                        <p className="text-sm text-gray-600">
                          {withdrawal.final_amount.toLocaleString()} {withdrawal.currency}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </div>
                  ))}
                  {withdrawalHistory.length > 3 && (
                    <p className="text-sm text-gray-500">+{withdrawalHistory.length - 3} more withdrawals</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Endpoints Tab */}
      {activeTab === 'endpoints' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">API Endpoints</h3>
              <button
                onClick={testAllEndpoints}
                disabled={testingEndpoints}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium"
              >
                {testingEndpoints ? 'Testing...' : 'Test All Endpoints'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ApiService.getAvailableEndpoints().map((endpoint, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                      endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                      endpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="text-xs text-gray-500">{endpoint.category}</span>
                  </div>
                  <p className="font-mono text-sm text-gray-700 mb-2">{endpoint.path}</p>
                  <p className="text-xs text-gray-600">{endpoint.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Health Tab */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">System Health Monitoring</h3>
            <div className="text-center py-8">
              <p className="text-gray-600">Health monitoring dashboard coming soon...</p>
              <button
                onClick={testAllEndpoints}
                disabled={testingEndpoints}
                className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium"
              >
                {testingEndpoints ? 'Testing Endpoints...' : 'Run Health Check'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 