import React from 'react';
import type { UserLoyaltyInfo, LoyaltyTierInfo } from '../../types/api';
import { ApiService } from '../../services/api';

interface LoyaltyCardProps {
  loyaltyInfo: UserLoyaltyInfo;
  className?: string;
}

export const LoyaltyCard: React.FC<LoyaltyCardProps> = ({ 
  loyaltyInfo, 
  className = '' 
}) => {
  const tierInfo = ApiService.formatLoyaltyTier(loyaltyInfo.current_tier);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{tierInfo.icon}</span>
          <div>
            <h3 className={`text-xl font-bold ${tierInfo.color}`}>
              {tierInfo.name} Tier
            </h3>
            <p className="text-sm text-gray-500">
              Member since tier achieved
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Tier Progress</p>
          <p className="text-lg font-bold text-blue-600">
            {loyaltyInfo.tier_progress.progress_percentage.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Progress to Next Tier */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress to Next Tier</span>
          <span>
            {loyaltyInfo.tier_progress.current_points} / 
            {loyaltyInfo.tier_progress.points_to_next_tier + loyaltyInfo.tier_progress.current_points} points
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${loyaltyInfo.tier_progress.progress_percentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {loyaltyInfo.tier_progress.points_to_next_tier} points needed for next tier
        </p>
      </div>

      {/* Benefits */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Current Benefits</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-600 font-medium">APY Bonus</p>
            <p className="text-lg font-bold text-green-700">
              +{ApiService.formatAPY(loyaltyInfo.benefits_unlocked.staking_apy_bonus)}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600 font-medium">Fee Discount</p>
            <p className="text-lg font-bold text-blue-700">
              -{ApiService.formatAPY(loyaltyInfo.benefits_unlocked.transaction_fee_discount)}
            </p>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Referral Bonus</p>
            <p className="text-lg font-bold text-purple-700">
              {loyaltyInfo.benefits_unlocked.referral_bonus_multiplier}x
            </p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Priority Support</p>
            <p className="text-lg font-bold text-yellow-700">
              {loyaltyInfo.benefits_unlocked.priority_support ? '✅' : '❌'}
            </p>
          </div>
        </div>
      </div>

      {/* Referral Stats */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Referral Program</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {loyaltyInfo.referral_stats.total_referrals}
            </p>
            <p className="text-xs text-gray-500">Total Referrals</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {loyaltyInfo.referral_stats.active_referrals}
            </p>
            <p className="text-xs text-gray-500">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {ApiService.formatCurrency(loyaltyInfo.referral_stats.referral_earnings)}
            </p>
            <p className="text-xs text-gray-500">Earned</p>
          </div>
        </div>
      </div>

      {/* Loyalty Rewards */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-3">Loyalty Rewards</h4>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Earned</p>
              <p className="text-lg font-bold text-gray-900">
                {ApiService.formatCurrency(loyaltyInfo.loyalty_rewards.total_earned)} BiUSD
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-lg font-bold text-blue-600">
                {ApiService.formatCurrency(loyaltyInfo.loyalty_rewards.this_month)} BiUSD
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-lg font-bold text-yellow-600">
                {ApiService.formatCurrency(loyaltyInfo.loyalty_rewards.pending)} BiUSD
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier History */}
      {loyaltyInfo.tier_history.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-3">Tier History</h4>
          <div className="space-y-2">
            {loyaltyInfo.tier_history.slice(0, 3).map((history, index) => {
              const historyTierInfo = ApiService.formatLoyaltyTier(history.tier);
              return (
                <div key={index} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{historyTierInfo.icon}</span>
                    <span className={`font-medium ${historyTierInfo.color}`}>
                      {historyTierInfo.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{history.duration_days} days</p>
                    <p className="text-xs text-gray-500">
                      {ApiService.formatDate(history.achieved_date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Tier comparison component
interface TierComparisonProps {
  tiers: LoyaltyTierInfo[];
  currentTier: string;
  className?: string;
}

export const TierComparison: React.FC<TierComparisonProps> = ({
  tiers,
  currentTier,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border ${className}`}>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Tier Comparison</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-600">Tier</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">APY Bonus</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Fee Discount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Referral Bonus</th>
              <th className="text-left py-3 px-4 font-medium text-gray-600">Min Stake</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier) => {
              const tierInfo = ApiService.formatLoyaltyTier(tier.tier);
              const isCurrentTier = tier.tier === currentTier;
              
              return (
                <tr 
                  key={tier.tier} 
                  className={`border-b border-gray-100 ${isCurrentTier ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span>{tierInfo.icon}</span>
                      <span className={`font-medium ${tierInfo.color}`}>
                        {tierInfo.name}
                      </span>
                      {isCurrentTier && (
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                          Current
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-green-600 font-medium">
                    +{ApiService.formatAPY(tier.benefits.staking_apy_bonus)}
                  </td>
                  <td className="py-3 px-4 text-blue-600 font-medium">
                    -{ApiService.formatAPY(tier.benefits.transaction_fee_discount)}
                  </td>
                  <td className="py-3 px-4 text-purple-600 font-medium">
                    {tier.benefits.referral_bonus_multiplier}x
                  </td>
                  <td className="py-3 px-4 text-gray-900 font-medium">
                    {ApiService.formatCurrency(tier.requirements.min_stake_amount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 