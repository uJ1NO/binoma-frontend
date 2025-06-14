// API Base Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Wallet Types
export interface Wallet {
  address: string;
  balance: number;
  available_balance: number;
  total_balance: number;
  currencies: Record<string, number>;
}

export interface WalletGenerateRequest {
  user_email?: string;
}

export interface WalletConnectRequest {
  private_key: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  from_address: string;
  to_address: string;
  amount: number;
  fee: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  block_number?: number;
  confirmations?: number;
  hash?: string;
  metadata?: any;
}

export interface SendTransactionRequest {
  to_address: string;
  amount: number;
  currency: string;
  note?: string;
}

export interface TransactionHistory {
  transactions: Transaction[];
  count: number;
  total_pages?: number;
  current_page?: number;
}

// Purchase/Withdrawal Types
export interface PurchaseRequest {
  amount: number;
  from_currency: string;
  to_currency: string;
  wallet_address: string;
  payment_method: string;
  reference: string;
}

export interface WithdrawRequest {
  wallet_address: string;
  amount: number;
  currency: string;
  bank_iban: string;
  reference: string;
}

export interface PurchaseResponse {
  purchase_id: string;
  amount: number;
  from_currency: string;
  dusd_amount: number;
  exchange_rate: number;
  reference: string;
  status: string;
  bank_details: {
    bank_name: string;
    swift: string;
    iban: string;
    reference: string;
  };
}

export interface WithdrawResponse {
  withdrawal_id: string;
  amount: number;
  fee: number;
  net_amount: number;
  destination_iban: string;
  reference: string;
  status: string;
  estimated_completion: string;
}

// System Stats Types
export interface SystemStats {
  total_users: number;
  active_users_24h: number;
  total_transactions: number;
  transactions_24h: number;
  total_volume: number;
  volume_24h: number;
  total_revenue: number;
  revenue_24h: number;
  system_health: string;
}

export interface TreasuryBalance {
  dusd_balance: number;
  reserved_funds: number;
  available_funds: number;
  total_supply: number;
  circulating_supply: number;
}

// Health Check Types
export interface HealthStatus {
  status: string;
  version: string;
  uptime: string;
  database: string;
  cache: string;
  api: string;
  timestamp: string;
}

// Metrics Types
export interface SystemMetrics {
  performance: {
    tps_current: number;
    tps_average: number;
    tps_peak: number;
    response_time_ms: number;
    error_rate: number;
  };
  system: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    network_in: number;
    network_out: number;
  };
  business: {
    transactions_today: number;
    volume_today: number;
    revenue_today: number;
    users_online: number;
  };
}

// Admin Types
export interface MintRequest {
  amount: number;
  reason: string;
}

export interface UserInfo {
  id: string;
  email: string;
  registered: string;
  status: 'active' | 'pending' | 'suspended';
}

export interface UsersResponse {
  total_users: number;
  new_users_today: number;
  verified_users: number;
  suspended_users: number;
  recent_registrations: UserInfo[];
}

// Enhanced Admin Types for Founder Access
export interface DetailedUsersResponse {
  total_users: number;
  active_users: number;
  suspended_users: number;
  pending_users: number;
  users: UserDetails[];
}

export interface UserDetails {
  id: string;
  id_number: string;
  email: string;
  full_name: string;
  phone?: string;
  status: 'active' | 'suspended' | 'pending' | 'banned';
  registration_paid: boolean;
  registration_fee: number;
  kyc_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
  total_balance: number;
  total_transactions: number;
  risk_score: number;
  wallets: UserWallet[];
}

export interface UserWallet {
  id: string;
  address: string;
  balance: number;
  currency: string;
  status: 'active' | 'frozen' | 'suspended';
  created_at: string;
  last_transaction?: string;
  transaction_count: number;
}

export interface UserTransaction {
  id: string;
  from_address: string;
  to_address: string;
  amount: number;
  fee: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  type: 'send' | 'receive' | 'purchase' | 'withdrawal' | 'mint' | 'burn';
  timestamp: string;
  metadata?: string;
}

export interface SystemLog {
  id: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  module: string;
  user_id?: string;
  wallet_address?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface WalletAnalytics {
  total_wallets: number;
  active_wallets: number;
  frozen_wallets: number;
  total_balance: number;
  average_balance: number;
  largest_wallet: {
    address: string;
    balance: number;
  };
  distribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
}

export interface TransactionAnalytics {
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  total_volume: number;
  total_fees: number;
  average_transaction_size: number;
  transactions_by_type: Record<string, number>;
  hourly_volume: {
    hour: string;
    volume: number;
    count: number;
  }[];
}

export interface MintResponse {
  success: boolean;
  amount_minted: number;
  new_total_supply: number;
  transaction_id: string;
  timestamp: string;
}

export interface AuditEntry {
  id: string;
  user_id?: string;
  wallet_address?: string;
  action: string;
  description: string;
  ip_address?: string;
  user_agent?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Error Types
export interface ApiError {
  error: string;
  message?: string;
  code?: string;
  details?: any;
}

// Exchange Rates
export interface ExchangeRates {
  [currency: string]: number;
}

// Constants
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'CHF', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'SEK', 'NOK'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

export const TRANSACTION_STATUSES = ['pending', 'confirmed', 'failed'] as const;
export type TransactionStatus = typeof TRANSACTION_STATUSES[number];

// Staking Types
export interface CreateStakingRequest {
  user_address: string;
  amount: number;
  staking_type: '6M' | '12M' | '18M';
  auto_compound: boolean;
}

export interface StakingPoolInfo {
  id: string;
  user_address: string;
  staking_type: string;
  amount: number;
  total_apy: number;
  base_apy: number;
  tier_bonus_apy: number;
  start_date: string;
  end_date: string;
  days_until_maturity: number;
  progress_percentage: number;
  pending_rewards: number;
  total_rewards_earned: number;
  estimated_total_return: number;
  auto_compound: boolean;
  status: string;
  early_withdrawal_penalty: number;
  can_withdraw_penalty_free: boolean;
}

export interface CreateStakingResponse {
  pool_id: string;
  message: string;
  pool_details: StakingPoolInfo;
}

export interface UserStakingStats {
  total_staked: number;
  active_pools_count: number;
  completed_pools_count: number;
  total_rewards_earned: number;
  average_apy: number;
  pools: StakingPoolInfo[];
}

export interface StakingOptionInfo {
  staking_type: string;
  name: string;
  duration_days: number;
  base_apy: number;
  min_amount: number;
  early_withdrawal_penalty: number;
  description: string;
}

export interface StakingOptions {
  options: StakingOptionInfo[];
}

export interface WithdrawStakingRequest {
  pool_id: string;
  user_address: string;
}

export interface WithdrawStakingResponse {
  withdrawal_amount: number;
  penalty_amount: number;
  message: string;
}

// Loyalty Types
export type LoyaltyTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';

export interface LoyaltyBenefits {
  staking_apy_bonus: number;
  transaction_fee_discount: number;
  priority_support: boolean;
  exclusive_pools: boolean;
  referral_bonus_multiplier: number;
}

export interface TierRequirement {
  min_stake_amount: number;
  min_days_staked: number;
  min_transaction_volume: number;
  min_referrals: number;
}

export interface LoyaltyTierInfo {
  tier: LoyaltyTier;
  name: string;
  requirements: TierRequirement;
  benefits: LoyaltyBenefits;
  description: string;
}

export interface UserLoyaltyInfo {
  current_tier: LoyaltyTier;
  tier_progress: {
    current_points: number;
    points_to_next_tier: number;
    progress_percentage: number;
  };
  tier_history: Array<{
    tier: LoyaltyTier;
    achieved_date: string;
    duration_days: number;
  }>;
  referral_stats: {
    total_referrals: number;
    active_referrals: number;
    referral_earnings: number;
  };
  loyalty_rewards: {
    total_earned: number;
    this_month: number;
    pending: number;
  };
  benefits_unlocked: LoyaltyBenefits;
  next_tier_requirements: TierRequirement;
}

export interface AllTiersResponse {
  tiers: LoyaltyTierInfo[];
}

export interface ReferralRequest {
  referrer_address: string;
  referred_address: string;
  referral_code?: string;
}

export interface ReferralResponse {
  success: boolean;
  message: string;
  reward_amount: number;
  tier_points_earned: number;
}

// Analytics Types
export interface PlatformOverview {
  user_metrics: {
    total_users: number;
    active_users: number;
    new_users_today: number;
    user_growth_rate: number;
  };
  staking_metrics: {
    total_pools: number;
    active_pools: number;
    total_staked: number;
    average_apy: number;
    total_rewards_distributed: number;
  };
  loyalty_metrics: {
    tier_distribution: Record<LoyaltyTier, number>;
    total_referrals: number;
    active_referral_programs: number;
  };
  revenue_metrics: {
    total_revenue: number;
    monthly_revenue: number;
    daily_revenue: number;
    revenue_streams: {
      transaction_fees: number;
      staking_fees: number;
      registration_fees: number;
    };
  };
  growth_metrics: {
    monthly_growth_rate: number;
    transaction_volume_growth: number;
    user_retention_rate: number;
  };
}

export interface FinancialProjections {
  scenarios: {
    conservative: ProjectionScenario;
    moderate: ProjectionScenario;
    optimistic: ProjectionScenario;
  };
  assumptions: {
    user_growth_rate: number;
    average_stake_per_user: number;
    transaction_frequency: number;
    retention_rate: number;
  };
}

export interface ProjectionScenario {
  name: string;
  timeframe: string;
  projected_users: number;
  projected_staking_volume: number;
  projected_revenue: number;
  monthly_breakdown: Array<{
    month: string;
    users: number;
    revenue: number;
    staking_volume: number;
  }>;
}

export interface PlatformStatus {
  system_health: 'healthy' | 'warning' | 'critical';
  performance_metrics: {
    current_tps: number;
    average_response_time: number;
    error_rate: number;
    uptime_percentage: number;
  };
  active_connections: number;
  database_status: string;
  cache_status: string;
  api_status: string;
  last_updated: string;
}

// Founder Tools Types
export interface EndpointInfo {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  category: string;
  status?: 'active' | 'inactive' | 'error';
  response_time?: number;
  last_tested?: string;
}

export interface ApiHealthCheck {
  endpoint: string;
  status: 'success' | 'error' | 'timeout';
  responseTime: number;
  message?: string;
  data?: any;
}

export interface FounderDashboard {
  system_health: string;
  total_users: number;
  total_transactions: number;
  total_volume: number;
  total_revenue: number;
  treasury_balance: number;
  circulating_supply: number;
  governance_enabled: boolean;
  active_proposals: number;
  total_registrations: number;
  free_registrations_remaining: number;
  pending_withdrawals: number;
  monthly_withdrawal_limit: number;
}

// Governance Types
export interface GovernanceStats {
  enabled: boolean;
  total_members: number;
  active_proposals: number;
  total_proposals: number;
  founder_voting_power: number;
  treasury_voting_power: number;
}

// Registration Types
export interface RegistrationStats {
  total_registrations: number;
  free_registrations_used: number;
  free_registrations_remaining: number;
  total_registration_revenue: number;
  average_registration_fee: number;
}

// Treasury Types
export interface TreasuryStats {
  total_biusd_balance: number;
  total_fiat_withdrawn: number;
  pending_withdrawals: number;
  monthly_withdrawal_limit: number;
  monthly_withdrawn: number;
  available_currencies: string[];
}

export interface BankAccount {
  id: string;
  account_name: string;
  bank_name: string;
  iban: string;
  swift_code: string;
  currency: string;
  country: string;
  is_primary: boolean;
  is_verified: boolean;
  added_at: string;
  added_by: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  currency: string;
  bank_account_id: string;
  bank_account_name: string;
  status: string;
  requested_at: string;
  processed_at?: string;
  transaction_fee: number;
  exchange_rate: number;
  final_amount: number;
  requested_by: string;
} 