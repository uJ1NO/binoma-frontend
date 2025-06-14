import React from 'react';
import type { StakingPoolInfo } from '../../types/api';
import { ApiService } from '../../services/api';

interface StakingCardProps {
  pool: StakingPoolInfo;
  onWithdraw?: (poolId: string) => void;
  className?: string;
}

export const StakingCard: React.FC<StakingCardProps> = ({ 
  pool, 
  onWithdraw, 
  className = '' 
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'withdrawn': return 'text-gray-600 bg-gray-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border hover:shadow-lg transition-shadow ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {ApiService.formatStakingDuration(pool.staking_type)} Staking
          </h3>
          <p className="text-sm text-gray-500">Pool ID: {pool.id.slice(0, 8)}...</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pool.status)}`}>
          {pool.status.toUpperCase()}
        </span>
      </div>

      {/* Amount and APY */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Staked Amount</p>
          <p className="text-xl font-bold text-gray-900">
            {ApiService.formatCurrency(pool.amount)} BiUSD
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total APY</p>
          <p className="text-xl font-bold text-green-600">
            {ApiService.formatAPY(pool.total_apy)}
          </p>
          {pool.tier_bonus_apy > 0 && (
            <p className="text-xs text-blue-600">
              +{ApiService.formatAPY(pool.tier_bonus_apy)} bonus
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{pool.progress_percentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(pool.progress_percentage)}`}
            style={{ width: `${Math.min(pool.progress_percentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Started: {ApiService.formatDate(pool.start_date)}</span>
          <span>{pool.days_until_maturity} days left</span>
        </div>
      </div>

      {/* Rewards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Pending Rewards</p>
          <p className="text-lg font-semibold text-blue-600">
            {ApiService.formatCurrency(pool.pending_rewards)} BiUSD
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Earned</p>
          <p className="text-lg font-semibold text-green-600">
            {ApiService.formatCurrency(pool.total_rewards_earned)} BiUSD
          </p>
        </div>
      </div>

      {/* Estimated Return */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-sm text-gray-600">Estimated Total Return</p>
        <p className="text-lg font-bold text-gray-900">
          {ApiService.formatCurrency(pool.estimated_total_return)} BiUSD
        </p>
        <p className="text-xs text-gray-500">
          Auto-compound: {pool.auto_compound ? 'Enabled' : 'Disabled'}
        </p>
      </div>

      {/* Early Withdrawal Warning */}
      {!pool.can_withdraw_penalty_free && pool.early_withdrawal_penalty > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800">
            ⚠️ Early withdrawal penalty: {ApiService.formatAPY(pool.early_withdrawal_penalty)}
          </p>
        </div>
      )}

      {/* Actions */}
      {pool.status === 'active' && onWithdraw && (
        <div className="flex gap-2">
          {pool.can_withdraw_penalty_free ? (
            <button
              onClick={() => onWithdraw(pool.id)}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Withdraw (No Penalty)
            </button>
          ) : (
            <button
              onClick={() => onWithdraw(pool.id)}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              Early Withdraw (Penalty)
            </button>
          )}
        </div>
      )}

      {pool.status === 'completed' && (
        <div className="text-center py-2 text-green-600 font-medium">
          ✅ Staking Period Completed
        </div>
      )}
    </div>
  );
}; 