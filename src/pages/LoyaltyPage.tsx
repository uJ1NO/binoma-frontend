import React, { useState, useEffect } from 'react';
import { LoyaltyCard, TierComparison } from '../components/common/LoyaltyCard';
import { ApiService } from '../services/api';
import type { 
  UserLoyaltyInfo, 
  ReferralRequest,
  LoyaltyTierInfo 
} from '../types/api';

export const LoyaltyPage: React.FC = () => {
  const [userLoyaltyInfo, setUserLoyaltyInfo] = useState<UserLoyaltyInfo | null>(null);
  const [allTiers, setAllTiers] = useState<LoyaltyTierInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tiers' | 'referral'>('overview');
  
  // Referral form state
  const [referralForm, setReferralForm] = useState({
    referred_address: '',
    referral_code: '',
  });
  const [referralLoading, setReferralLoading] = useState(false);

  // Mock user address - in real app this would come from wallet context
  const userAddress = 'user123';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [loyaltyResponse, tiersResponse] = await Promise.all([
        ApiService.getUserLoyaltyInfo(userAddress),
        ApiService.getAllTiers(),
      ]);

      if (loyaltyResponse.success) {
        setUserLoyaltyInfo(loyaltyResponse.data!);
      }
      if (tiersResponse.success) {
        setAllTiers(tiersResponse.data!.tiers);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load loyalty data');
    } finally {
      setLoading(false);
    }
  };

  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralForm.referred_address) {
      setError('Please enter a valid address');
      return;
    }

    try {
      setReferralLoading(true);
      const request: ReferralRequest = {
        referrer_address: userAddress,
        referred_address: referralForm.referred_address,
        referral_code: referralForm.referral_code || undefined,
      };

      const response = await ApiService.submitReferral(request);
      if (response.success) {
        alert(`Referral successful! Reward: ${response.data?.reward_amount} BiUSD`);
        setReferralForm({ referred_address: '', referral_code: '' });
        loadData(); // Refresh data
      } else {
        setError(response.error || 'Failed to submit referral');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit referral');
    } finally {
      setReferralLoading(false);
    }
  };

  const generateReferralCode = () => {
    const code = `${userAddress.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    setReferralForm(prev => ({ ...prev, referral_code: code }));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading loyalty data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Program</h1>
        <p className="text-gray-600">Unlock exclusive benefits and earn rewards through our tier-based loyalty system</p>
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
              { id: 'overview', label: 'My Tier', icon: '👑' },
              { id: 'tiers', label: 'All Tiers', icon: '🏆' },
              { id: 'referral', label: 'Referral Program', icon: '🤝' },
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
      {activeTab === 'overview' && userLoyaltyInfo && (
        <div className="space-y-6">
          <LoyaltyCard loyaltyInfo={userLoyaltyInfo} />

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTab('referral')}
                className="flex items-center justify-center space-x-2 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <span>🤝</span>
                <span className="font-medium text-blue-800">Refer Friends</span>
              </button>
              <button
                onClick={() => window.open('/staking', '_blank')}
                className="flex items-center justify-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span>💰</span>
                <span className="font-medium text-green-800">Start Staking</span>
              </button>
            </div>
          </div>

          {/* Next Tier Requirements */}
          {userLoyaltyInfo.next_tier_requirements && (
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements for Next Tier</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Min Stake</p>
                  <p className="text-lg font-bold text-gray-900">
                    {ApiService.formatCurrency(userLoyaltyInfo.next_tier_requirements.min_stake_amount)} BiUSD
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Days Staked</p>
                  <p className="text-lg font-bold text-gray-900">
                    {userLoyaltyInfo.next_tier_requirements.min_days_staked}
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Transaction Volume</p>
                  <p className="text-lg font-bold text-gray-900">
                    {ApiService.formatCurrency(userLoyaltyInfo.next_tier_requirements.min_transaction_volume)} BiUSD
                  </p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Referrals</p>
                  <p className="text-lg font-bold text-gray-900">
                    {userLoyaltyInfo.next_tier_requirements.min_referrals}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tiers Tab */}
      {activeTab === 'tiers' && (
        <div className="space-y-6">
          <TierComparison 
            tiers={allTiers} 
            currentTier={userLoyaltyInfo?.current_tier || 'Bronze'} 
          />

          {/* Detailed Tier Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTiers.map((tier) => {
              const tierInfo = ApiService.formatLoyaltyTier(tier.tier);
              const isCurrentTier = tier.tier === userLoyaltyInfo?.current_tier;
              
              return (
                <div 
                  key={tier.tier} 
                  className={`bg-white p-6 rounded-lg shadow-md border-2 ${
                    isCurrentTier ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{tierInfo.icon}</span>
                      <h3 className={`text-xl font-bold ${tierInfo.color}`}>
                        {tierInfo.name}
                      </h3>
                    </div>
                    {isCurrentTier && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4">{tier.description}</p>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Benefits:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• APY Bonus: +{ApiService.formatAPY(tier.benefits.staking_apy_bonus)}</li>
                      <li>• Fee Discount: -{ApiService.formatAPY(tier.benefits.transaction_fee_discount)}</li>
                      <li>• Referral Bonus: {tier.benefits.referral_bonus_multiplier}x</li>
                      <li>• Priority Support: {tier.benefits.priority_support ? 'Yes' : 'No'}</li>
                      <li>• Exclusive Pools: {tier.benefits.exclusive_pools ? 'Yes' : 'No'}</li>
                    </ul>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Min Stake: {ApiService.formatCurrency(tier.requirements.min_stake_amount)} BiUSD</li>
                      <li>• Days Staked: {tier.requirements.min_days_staked}</li>
                      <li>• Transaction Volume: {ApiService.formatCurrency(tier.requirements.min_transaction_volume)} BiUSD</li>
                      <li>• Referrals: {tier.requirements.min_referrals}</li>
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Referral Tab */}
      {activeTab === 'referral' && (
        <div className="space-y-6">
          {/* Referral Stats */}
          {userLoyaltyInfo && (
            <div className="bg-white p-6 rounded-lg shadow-md border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your Referral Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">
                    {userLoyaltyInfo.referral_stats.total_referrals}
                  </p>
                  <p className="text-sm text-gray-600">Total Referrals</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">
                    {userLoyaltyInfo.referral_stats.active_referrals}
                  </p>
                  <p className="text-sm text-gray-600">Active Referrals</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <p className="text-3xl font-bold text-purple-600">
                    {ApiService.formatCurrency(userLoyaltyInfo.referral_stats.referral_earnings)}
                  </p>
                  <p className="text-sm text-gray-600">Total Earned (BiUSD)</p>
                </div>
              </div>
            </div>
          )}

          {/* Refer Friend Form */}
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md border">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Refer a Friend</h2>
              
              <form onSubmit={handleReferralSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Friend's Wallet Address
                  </label>
                  <input
                    type="text"
                    value={referralForm.referred_address}
                    onChange={(e) => setReferralForm(prev => ({ ...prev, referred_address: e.target.value }))}
                    placeholder="Enter wallet address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Referral Code (Optional)
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={referralForm.referral_code}
                      onChange={(e) => setReferralForm(prev => ({ ...prev, referral_code: e.target.value }))}
                      placeholder="Generate or enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={generateReferralCode}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={referralLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {referralLoading ? 'Submitting...' : 'Submit Referral'}
                </button>
              </form>
            </div>
          </div>

          {/* Referral Program Info */}
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">1️⃣</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Refer Friends</h4>
                <p className="text-sm text-gray-600">
                  Share your referral code with friends who want to join Binoma DIS
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">2️⃣</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">They Join & Stake</h4>
                <p className="text-sm text-gray-600">
                  When they register and make their first stake, you both get rewards
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">3️⃣</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Earn Rewards</h4>
                <p className="text-sm text-gray-600">
                  Get bonus rewards and tier points for each successful referral
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 