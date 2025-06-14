import React, { useState, useEffect } from 'react';
import { StakingCard } from '../components/common/StakingCard';
import { ApiService } from '../services/api';
import type { 
  UserStakingStats, 
  // StakingOptions, 
  CreateStakingRequest, 
  // StakingOptionInfo,
  WithdrawStakingRequest 
} from '../types/api';

export const StakingPage: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStakingStats | null>(null);
  // const [stakingOptions, setStakingOptions] = useState<StakingOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'create' | 'pools'>('overview');
  
  // Create staking form state
  const [createForm, setCreateForm] = useState({
    amount: '',
    staking_type: '6M' as '6M' | '12M' | '18M',
    auto_compound: true,
  });
  const [createLoading, setCreateLoading] = useState(false);

  // Mock user address - in real app this would come from wallet context
  const userAddress = 'user123';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsResponse] = await Promise.all([
        ApiService.getUserStakingStats(userAddress),
        // ApiService.getStakingOptions(),
      ]);

      if (statsResponse.success) {
        setUserStats(statsResponse.data!);
      }
      // if (optionsResponse.success) {
      //   setStakingOptions(optionsResponse.data!);
      // }
    } catch (err: any) {
      setError(err.message || 'Failed to load staking data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.amount || isNaN(Number(createForm.amount))) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      setCreateLoading(true);
      const request: CreateStakingRequest = {
        user_address: userAddress,
        amount: Number(createForm.amount),
        staking_type: createForm.staking_type,
        auto_compound: createForm.auto_compound,
      };

      const response = await ApiService.createStakingPool(request);
      if (response.success) {
        alert('Staking pool created successfully!');
        setCreateForm({ amount: '', staking_type: '6M', auto_compound: true });
        loadData(); // Refresh data
        setActiveTab('pools');
      } else {
        setError(response.error || 'Failed to create staking pool');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create staking pool');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleWithdraw = async (poolId: string) => {
    if (!confirm('Are you sure you want to withdraw from this staking pool?')) {
      return;
    }

    try {
      const request: WithdrawStakingRequest = {
        pool_id: poolId,
        user_address: userAddress,
      };

      const response = await ApiService.withdrawStaking(request);
      if (response.success) {
        alert(`Withdrawal successful! Amount: ${response.data?.withdrawal_amount} BiUSD`);
        loadData(); // Refresh data
      } else {
        setError(response.error || 'Failed to withdraw');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to withdraw');
    }
  };

  const getMinAmountForType = (type: string): number => {
    switch (type) {
      case '6M': return 100;    // $100 minimum for 6-month
      case '12M': return 500;   // $500 minimum for 12-month
      case '18M': return 1000;  // $1000 minimum for 18-month
      default: return 100;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Staking Dashboard</h1>
        <p className="text-gray-600">Earn rewards by staking your BiUSD with competitive APY rates</p>
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
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'create', label: 'Stake BiUSD', icon: '💰' },
              { id: 'pools', label: 'My Pools', icon: '🏊‍♂️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
      {activeTab === 'overview' && userStats && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Staked</h3>
              <p className="text-2xl font-bold text-blue-600">
                {ApiService.formatCurrency(userStats.total_staked)} BiUSD
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Pools</h3>
              <p className="text-2xl font-bold text-green-600">
                {userStats.active_pools_count}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Rewards</h3>
              <p className="text-2xl font-bold text-purple-600">
                {ApiService.formatCurrency(userStats.total_rewards_earned)} BiUSD
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Average APY</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {ApiService.formatAPY(userStats.average_apy)}
              </p>
            </div>
          </div>

          {/* Available Staking Options */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Available Staking Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 6-Month Locked Staking */}
              <div className="border rounded-lg p-4 hover:bg-blue-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">6-Month Locked</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">POPULAR</span>
                </div>
                <p className="text-2xl font-bold text-blue-600 mb-2">4.0% APY</p>
                <p className="text-sm text-gray-600 mb-3">Perfect for short-term staking with competitive returns</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Duration:</span> 180 days (6 months)</p>
                  <p><span className="font-medium">Min Amount:</span> $100 BiUSD</p>
                  <p><span className="font-medium">Early Penalty:</span> 2.0%</p>
                </div>
                <button
                  onClick={() => {
                    setCreateForm(prev => ({ ...prev, staking_type: '6M' }));
                    setActiveTab('create');
                  }}
                  className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Stake Now
                </button>
              </div>

              {/* 12-Month Locked Staking */}
              <div className="border rounded-lg p-4 hover:bg-green-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">12-Month Locked</h4>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">BALANCED</span>
                </div>
                <p className="text-2xl font-bold text-green-600 mb-2">5.0% APY</p>
                <p className="text-sm text-gray-600 mb-3">Balanced option with higher returns for medium-term commitment</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Duration:</span> 365 days (12 months)</p>
                  <p><span className="font-medium">Min Amount:</span> $500 BiUSD</p>
                  <p><span className="font-medium">Early Penalty:</span> 3.0%</p>
                </div>
                <button
                  onClick={() => {
                    setCreateForm(prev => ({ ...prev, staking_type: '12M' }));
                    setActiveTab('create');
                  }}
                  className="mt-3 w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Stake Now
                </button>
              </div>

              {/* 18-Month Locked Staking */}
              <div className="border rounded-lg p-4 hover:bg-purple-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">18-Month Locked</h4>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">MAX APY</span>
                </div>
                <p className="text-2xl font-bold text-purple-600 mb-2">6.0% APY</p>
                <p className="text-sm text-gray-600 mb-3">Maximum returns for long-term staking commitment</p>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Duration:</span> 545 days (18 months)</p>
                  <p><span className="font-medium">Min Amount:</span> $1,000 BiUSD</p>
                  <p><span className="font-medium">Early Penalty:</span> 5.0%</p>
                </div>
                <button
                  onClick={() => {
                    setCreateForm(prev => ({ ...prev, staking_type: '18M' }));
                    setActiveTab('create');
                  }}
                  className="mt-3 w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Stake Now
                </button>
              </div>
            </div>
            
            {/* Tier Bonus Information */}
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-2">🏆 Loyalty Tier Bonuses (Added to Base APY)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-medium text-gray-700">Bronze</div>
                  <div className="text-gray-600">+0.0% APY</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700">Silver</div>
                  <div className="text-gray-600">+0.5% APY</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700">Gold</div>
                  <div className="text-gray-600">+1.0% APY</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-700">Diamond</div>
                  <div className="text-purple-600 font-bold">+2.0% APY</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Your loyalty tier bonus is automatically applied to all staking pools. Diamond tier can earn up to 8.0% total APY!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Staking Tab */}
      {activeTab === 'create' && (
        <div className="max-w-md mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Staking Pool</h2>
            
            <form onSubmit={handleCreateStaking} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Staking Type
                </label>
                <select
                  value={createForm.staking_type}
                  onChange={(e) => setCreateForm(prev => ({ 
                    ...prev, 
                    staking_type: e.target.value as '6M' | '12M' | '18M' 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="6M">6 Months</option>
                  <option value="12M">12 Months</option>
                  <option value="18M">18 Months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (BiUSD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min={getMinAmountForType(createForm.staking_type)}
                  value={createForm.amount}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder={`Minimum: ${getMinAmountForType(createForm.staking_type)} BiUSD`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto_compound"
                  checked={createForm.auto_compound}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, auto_compound: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="auto_compound" className="ml-2 block text-sm text-gray-700">
                  Enable auto-compound
                </label>
              </div>

              <button
                type="submit"
                disabled={createLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {createLoading ? 'Creating...' : 'Create Staking Pool'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Pools Tab */}
      {activeTab === 'pools' && userStats && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">My Staking Pools</h2>
          
          {userStats.pools.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">No staking pools found</p>
              <button
                onClick={() => setActiveTab('create')}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Pool
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userStats.pools.map((pool) => (
                <StakingCard
                  key={pool.id}
                  pool={pool}
                  onWithdraw={handleWithdraw}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 