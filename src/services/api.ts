import axios, { type AxiosResponse } from 'axios';
import type {
  ApiResponse,
  Wallet,
  WalletGenerateRequest,
  WalletConnectRequest,
  Transaction,
  SendTransactionRequest,
  TransactionHistory,
  PurchaseRequest,
  PurchaseResponse,
  WithdrawRequest,
  WithdrawResponse,
  SystemStats,
  TreasuryBalance,
  HealthStatus,
  SystemMetrics,
  // MintRequest,
  UsersResponse,
  SupportedCurrency,
  // New staking types
  CreateStakingRequest,
  CreateStakingResponse,
  UserStakingStats,
  StakingOptions,
  WithdrawStakingRequest,
  WithdrawStakingResponse,
  // New loyalty types
  UserLoyaltyInfo,
  AllTiersResponse,
  ReferralRequest,
  ReferralResponse,
  // New analytics types
  PlatformOverview,
  FinancialProjections,
  PlatformStatus,
  // Founder tools types
  EndpointInfo,
  ApiHealthCheck,
  FounderDashboard,
  DetailedUsersResponse,
  UserDetails,
  UserWallet,
  UserTransaction,
  SystemLog,
  WalletAnalytics,
  TransactionAnalytics,
  MintResponse,
  AuditEntry,
} from '../types/api';

// Additional types for new endpoints
export interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  proposal_type: string;
  yes_votes: number;
  no_votes: number;
  total_votes: number;
  threshold: number;
  status: string;
  created_at: string;
  ends_at: string;
  created_by: string;
}

export interface GovernanceStats {
  enabled: boolean;
  total_members: number;
  active_proposals: number;
  total_proposals: number;
  founder_voting_power: number;
  treasury_voting_power: number;
}

export interface CreateProposalRequest {
  title: string;
  description: string;
  proposal_type: string;
  duration_days: number;
  caller_address: string;
}

export interface VoteRequest {
  proposal_id: string;
  vote_type: string;
  biusd_staked: number;
  voter_address: string;
}

export interface AddGovernanceMemberRequest {
  wallet_address: string;
  voting_percentage: number;
  caller_address: string;
}

export interface RegistrationInfo {
  registration_fee: number;
  re_registration_fee: number;
  currency: string;
  free_registrations_available: boolean;
}

export interface RegistrationStats {
  total_registrations: number;
  free_registrations_used: number;
  free_registrations_remaining: number;
  total_registration_revenue: number;
  average_registration_fee: number;
}

export interface RegisterUserRequest {
  full_name: string;
  id_number: string;
  email: string;
  phone?: string;
  payment_method?: string;
}

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

export interface AddBankAccountRequest {
  account_name: string;
  bank_name: string;
  iban: string;
  swift_code: string;
  currency: string;
  country: string;
  caller_address: string;
}

export interface TreasuryWithdrawRequest {
  amount: number;
  currency: string;
  bank_account_id: string;
  caller_address: string;
  treasury_address: string;
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

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API Service Class
export class ApiService {
  // Wallet Endpoints
  static async generateWallet(request: WalletGenerateRequest): Promise<ApiResponse<Wallet>> {
    const response = await apiClient.post('/wallet/generate', request);
    return response.data;
  }

  static async connectWallet(request: WalletConnectRequest): Promise<ApiResponse<Wallet>> {
    const response = await apiClient.post('/wallet/connect', request);
    return response.data;
  }

  static async getWalletBalance(address: string): Promise<ApiResponse<Wallet>> {
    const response = await apiClient.get(`/wallet/${address}/balance`);
    return response.data;
  }

  static async getWalletTransactions(address: string, params?: {
    limit?: number;
    offset?: number;
    currency?: string;
  }): Promise<ApiResponse<TransactionHistory>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.currency) queryParams.append('currency', params.currency);
    
    const response = await apiClient.get(`/wallet/${address}/transactions?${queryParams}`);
    return response.data;
  }

  // Transaction Endpoints
  static async sendTransaction(request: SendTransactionRequest): Promise<ApiResponse<Transaction>> {
    const response = await apiClient.post('/transactions/send', request);
    return response.data;
  }

  static async getTransactionHistory(params?: {
    limit?: number;
    offset?: number;
    status?: string;
  }): Promise<ApiResponse<TransactionHistory>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.status) queryParams.append('status', params.status);
    
    const response = await apiClient.get(`/transactions/history?${queryParams}`);
    return response.data;
  }

  static async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  }

  // Purchase/Withdrawal Endpoints
  static async initiatePurchase(request: PurchaseRequest): Promise<ApiResponse<PurchaseResponse>> {
    const response = await apiClient.post('/purchase/initiate', request);
    return response.data;
  }

  static async withdrawToBank(request: WithdrawRequest): Promise<ApiResponse<WithdrawResponse>> {
    const response = await apiClient.post('/withdraw/bank', request);
    return response.data;
  }

  // System Endpoints (Public)
  static async getSystemStats(): Promise<ApiResponse<SystemStats>> {
    const response = await apiClient.get('/system/stats');
    return response.data;
  }

  static async getTreasuryBalance(): Promise<ApiResponse<TreasuryBalance>> {
    const response = await apiClient.get('/treasury/balance');
    return response.data;
  }

  static async getHealthStatus(): Promise<ApiResponse<HealthStatus>> {
    const response = await apiClient.get('/health');
    return response.data;
  }

  static async getSystemMetrics(): Promise<ApiResponse<SystemMetrics>> {
    const response = await apiClient.get('/metrics');
    return response.data;
  }

  // Admin Endpoints
  static async getAdminSystemStats(): Promise<ApiResponse<SystemStats>> {
    const response = await apiClient.get('/admin/system-stats');
    return response.data;
  }

  static async getAdminTreasuryBalance(): Promise<ApiResponse<TreasuryBalance>> {
    const response = await apiClient.get('/admin/treasury/balance');
    return response.data;
  }

  static async getUsers(): Promise<ApiResponse<UsersResponse>> {
    const response = await apiClient.get('/admin/users');
    return response.data;
  }

  // Enhanced Admin Endpoints for Founder Access
  static async getDetailedUsers(founderAddress: string): Promise<ApiResponse<DetailedUsersResponse>> {
    const response = await apiClient.get('/admin/users/detailed', {
      headers: { 'X-Founder-Address': founderAddress }
    });
    return response.data;
  }

  static async getUserDetails(userId: string, founderAddress: string): Promise<ApiResponse<UserDetails>> {
    const response = await apiClient.get(`/admin/users/${userId}/details`, {
      headers: { 'X-Founder-Address': founderAddress }
    });
    return response.data;
  }

  static async getUserWallets(userId: string, founderAddress: string): Promise<ApiResponse<UserWallet[]>> {
    const response = await apiClient.get(`/admin/users/${userId}/wallets`, {
      headers: { 'X-Founder-Address': founderAddress }
    });
    return response.data;
  }

  static async getUserTransactions(userId: string, founderAddress: string, limit?: number): Promise<ApiResponse<UserTransaction[]>> {
    const params = limit ? { limit: limit.toString() } : {};
    const response = await apiClient.get(`/admin/users/${userId}/transactions`, {
      params,
      headers: { 'X-Founder-Address': founderAddress }
    });
    return response.data;
  }

  static async suspendUser(userId: string, reason: string, founderAddress: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/admin/users/suspend', {
      user_id: userId,
      reason,
      founder_address: founderAddress
    });
    return response.data;
  }

  static async unsuspendUser(userId: string, founderAddress: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/admin/users/unsuspend', {
      user_id: userId,
      founder_address: founderAddress
    });
    return response.data;
  }

  static async getSystemLogs(founderAddress: string, level?: string, limit?: number): Promise<ApiResponse<SystemLog[]>> {
    const params: any = {};
    if (level) params.level = level;
    if (limit) params.limit = limit.toString();
    
    const response = await apiClient.get('/admin/system/logs', {
      params,
      headers: { 'X-Founder-Address': founderAddress }
    });
    return response.data;
  }

  static async getWalletAnalytics(founderAddress: string): Promise<ApiResponse<WalletAnalytics>> {
    const response = await apiClient.get('/admin/analytics/wallets', {
      headers: { 'X-Founder-Address': founderAddress }
    });
    return response.data;
  }

  static async getTransactionAnalytics(founderAddress: string, timeframe?: string): Promise<ApiResponse<TransactionAnalytics>> {
    const params = timeframe ? { timeframe } : {};
    const response = await apiClient.get('/admin/analytics/transactions', {
      params,
      headers: { 'X-Founder-Address': founderAddress }
    });
    return response.data;
  }

  static async forceProcessTransaction(transactionId: string, founderAddress: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/admin/transactions/force-process', {
      transaction_id: transactionId,
      founder_address: founderAddress
    });
    return response.data;
  }

  static async emergencyFreeze(walletAddress: string, reason: string, founderAddress: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/admin/emergency/freeze', {
      wallet_address: walletAddress,
      reason,
      founder_address: founderAddress
    });
    return response.data;
  }

  static async emergencyUnfreeze(walletAddress: string, founderAddress: string): Promise<ApiResponse<void>> {
    const response = await apiClient.post('/admin/emergency/unfreeze', {
      wallet_address: walletAddress,
      founder_address: founderAddress
    });
    return response.data;
  }

  static async getAuditTrail(founderAddress: string, userId?: string, action?: string, limit?: number): Promise<ApiResponse<AuditEntry[]>> {
    const params: any = {};
    if (userId) params.user_id = userId;
    if (action) params.action = action;
    if (limit) params.limit = limit.toString();
    
    const response = await apiClient.get('/admin/audit/trail', {
      params,
      headers: { 'X-Founder-Address': founderAddress }
    });
    return response.data;
  }

  static async mintTokens(amount: number, reason: string, founderAddress: string): Promise<ApiResponse<MintResponse>> {
    const response = await apiClient.post('/admin/mint', {
      amount,
      reason,
      founder_address: founderAddress
    });
    return response.data;
  }

  // Staking Endpoints
  static async createStakingPool(request: CreateStakingRequest): Promise<ApiResponse<CreateStakingResponse>> {
    const response = await apiClient.post('/staking/create', request);
    return response.data;
  }

  static async getUserStakingStats(userAddress: string): Promise<ApiResponse<UserStakingStats>> {
    const response = await apiClient.get(`/staking/user/${userAddress}`);
    return response.data;
  }

  static async getStakingOptions(): Promise<ApiResponse<StakingOptions>> {
    const response = await apiClient.get('/staking/options');
    return response.data;
  }

  static async withdrawStaking(request: WithdrawStakingRequest): Promise<ApiResponse<WithdrawStakingResponse>> {
    const response = await apiClient.post('/staking/withdraw', request);
    return response.data;
  }

  // Loyalty Endpoints
  static async getUserLoyaltyInfo(userAddress: string): Promise<ApiResponse<UserLoyaltyInfo>> {
    const response = await apiClient.get(`/loyalty/user/${userAddress}`);
    return response.data;
  }

  static async getAllTiers(): Promise<ApiResponse<AllTiersResponse>> {
    const response = await apiClient.get('/loyalty/tiers');
    return response.data;
  }

  static async submitReferral(request: ReferralRequest): Promise<ApiResponse<ReferralResponse>> {
    const response = await apiClient.post('/loyalty/referral', request);
    return response.data;
  }

  static async getUserReferralStats(userAddress: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/loyalty/referrals/${userAddress}`);
    return response.data;
  }

  // Analytics Endpoints
  static async getPlatformOverview(): Promise<ApiResponse<PlatformOverview>> {
    const response = await apiClient.get('/analytics/platform');
    return response.data;
  }

  static async getFinancialProjections(): Promise<ApiResponse<FinancialProjections>> {
    const response = await apiClient.get('/analytics/projections');
    return response.data;
  }

  static async getPlatformStatus(): Promise<ApiResponse<PlatformStatus>> {
    const response = await apiClient.get('/analytics/status');
    return response.data;
  }

  // Governance Endpoints
  static async enableGovernance(enabled: boolean, callerAddress: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/governance/enable', {
      enabled,
      caller_address: callerAddress
    });
    return response.data;
  }

  static async addGovernanceMember(request: AddGovernanceMemberRequest): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/governance/members/add', request);
    return response.data;
  }

  static async removeGovernanceMember(address: string, callerAddress: string): Promise<ApiResponse<any>> {
    const response = await apiClient.delete(`/governance/members/${address}?caller=${callerAddress}`);
    return response.data;
  }

  static async createProposal(request: CreateProposalRequest): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/governance/proposals', request);
    return response.data;
  }

  static async getProposals(status?: string): Promise<ApiResponse<GovernanceProposal[]>> {
    const queryParams = status ? `?status=${status}` : '';
    const response = await apiClient.get(`/governance/proposals${queryParams}`);
    return response.data;
  }

  static async getProposal(id: string): Promise<ApiResponse<GovernanceProposal>> {
    const response = await apiClient.get(`/governance/proposals/${id}`);
    return response.data;
  }

  static async voteOnProposal(request: VoteRequest): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/governance/vote', request);
    return response.data;
  }

  static async getGovernanceStats(): Promise<ApiResponse<GovernanceStats>> {
    const response = await apiClient.get('/governance/stats');
    return response.data;
  }

  // Registration Endpoints
  static async registerUser(request: RegisterUserRequest): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/registration/register', request);
    return response.data;
  }

  static async reRegisterUser(request: RegisterUserRequest): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/registration/re-register', request);
    return response.data;
  }

  static async completePayment(userId: string, paymentReference: string): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/registration/complete-payment', {
      user_id: userId,
      payment_reference: paymentReference
    });
    return response.data;
  }

  static async getRegistrationInfo(): Promise<ApiResponse<RegistrationInfo>> {
    const response = await apiClient.get('/registration/info');
    return response.data;
  }

  static async getRegistrationStats(callerAddress: string): Promise<ApiResponse<RegistrationStats>> {
    const response = await apiClient.get(`/registration/stats?caller=${callerAddress}`);
    return response.data;
  }

  static async getRegistrationFee(userId: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/registration/fee/${userId}`);
    return response.data;
  }

  static async getFreeRegistrationsRemaining(callerAddress: string): Promise<ApiResponse<any>> {
    const response = await apiClient.get(`/registration/free-remaining?caller=${callerAddress}`);
    return response.data;
  }

  // Treasury Management Endpoints
  static async getTreasuryStats(): Promise<ApiResponse<TreasuryStats>> {
    const response = await apiClient.get('/treasury/stats');
    return response.data;
  }

  static async getBankAccounts(): Promise<ApiResponse<BankAccount[]>> {
    const response = await apiClient.get('/treasury/bank-accounts');
    return response.data;
  }

  static async addBankAccount(request: AddBankAccountRequest): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/treasury/bank-accounts', request);
    return response.data;
  }

  static async deleteBankAccount(accountId: string, callerAddress: string): Promise<ApiResponse<any>> {
    const response = await apiClient.delete(`/treasury/bank-accounts/${accountId}`, {
      data: { caller_address: callerAddress }
    });
    return response.data;
  }

  static async requestTreasuryWithdrawal(request: TreasuryWithdrawRequest): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/treasury/withdraw', request);
    return response.data;
  }

  static async getWithdrawalHistory(): Promise<ApiResponse<WithdrawalRequest[]>> {
    const response = await apiClient.get('/treasury/withdrawals');
    return response.data;
  }

  // Utility Methods
  static async checkApiHealth(): Promise<boolean> {
    try {
      const response = await this.getHealthStatus();
      return response.success && response.data?.status === 'healthy';
    } catch {
      return false;
    }
  }

  static getExchangeRates(): Record<SupportedCurrency, number> {
    return {
      USD: 1.0,
      EUR: 0.85,
      GBP: 0.73,
      JPY: 110.0,
      CNY: 6.45,
      CAD: 1.25,
      AUD: 1.35,
      CHF: 0.92,
      SEK: 8.5,
      NOK: 8.8,
    };
  }

  static convertCurrency(amount: number, from: string, to: string): number {
    const rates = this.getExchangeRates();
    const fromRate = rates[from as SupportedCurrency] || 1;
    const toRate = rates[to as SupportedCurrency] || 1;
    return (amount / fromRate) * toRate;
  }

  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  static generateReference(): string {
    return `REF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  // Founder Tools
  static getAvailableEndpoints(): EndpointInfo[] {
    return [
      // Wallet endpoints
      { method: 'POST', path: '/wallet/generate', description: 'Generate new wallet', category: 'Wallet' },
      { method: 'POST', path: '/wallet/connect', description: 'Connect existing wallet', category: 'Wallet' },
      { method: 'GET', path: '/wallet/{address}/balance', description: 'Get wallet balance', category: 'Wallet' },
      { method: 'GET', path: '/wallet/{address}/transactions', description: 'Get wallet transactions', category: 'Wallet' },
      
      // Transaction endpoints
      { method: 'POST', path: '/transactions/send', description: 'Send transaction', category: 'Transactions' },
      { method: 'GET', path: '/transactions/history', description: 'Get transaction history', category: 'Transactions' },
      { method: 'GET', path: '/transactions/{id}', description: 'Get specific transaction', category: 'Transactions' },
      
      // Purchase/Withdrawal endpoints
      { method: 'POST', path: '/purchase/initiate', description: 'Initiate purchase', category: 'Purchase' },
      { method: 'POST', path: '/withdraw/bank', description: 'Withdraw to bank', category: 'Withdrawal' },
      
      // System endpoints
      { method: 'GET', path: '/health', description: 'Health check', category: 'System' },
      { method: 'GET', path: '/metrics', description: 'System metrics', category: 'System' },
      { method: 'GET', path: '/system/stats', description: 'Public system stats', category: 'System' },
      { method: 'GET', path: '/treasury/balance', description: 'Public treasury balance', category: 'System' },
      
      // Admin endpoints
      { method: 'GET', path: '/admin/system-stats', description: 'Admin system stats', category: 'Admin' },
      { method: 'GET', path: '/admin/treasury/balance', description: 'Admin treasury balance', category: 'Admin' },
      { method: 'GET', path: '/admin/users', description: 'Get users', category: 'Admin' },
      
      // Staking endpoints
      { method: 'POST', path: '/staking/create', description: 'Create staking pool', category: 'Staking' },
      { method: 'GET', path: '/staking/user/{address}', description: 'Get user staking stats', category: 'Staking' },
      { method: 'GET', path: '/staking/options', description: 'Get staking options', category: 'Staking' },
      { method: 'POST', path: '/staking/withdraw', description: 'Withdraw from staking', category: 'Staking' },
      
      // Loyalty endpoints
      { method: 'GET', path: '/loyalty/user/{address}', description: 'Get user loyalty info', category: 'Loyalty' },
      { method: 'GET', path: '/loyalty/tiers', description: 'Get all loyalty tiers', category: 'Loyalty' },
      { method: 'POST', path: '/loyalty/referral', description: 'Submit referral', category: 'Loyalty' },
      { method: 'GET', path: '/loyalty/referrals/{address}', description: 'Get referral stats', category: 'Loyalty' },
      
      // Analytics endpoints
      { method: 'GET', path: '/analytics/platform', description: 'Platform analytics', category: 'Analytics' },
      { method: 'GET', path: '/analytics/projections', description: 'Financial projections', category: 'Analytics' },
      { method: 'GET', path: '/analytics/status', description: 'Platform status', category: 'Analytics' },
      
      // Governance endpoints
      { method: 'POST', path: '/governance/enable', description: 'Enable/disable governance', category: 'Governance' },
      { method: 'POST', path: '/governance/members/add', description: 'Add governance member', category: 'Governance' },
      { method: 'DELETE', path: '/governance/members/{address}', description: 'Remove governance member', category: 'Governance' },
      { method: 'POST', path: '/governance/proposals', description: 'Create proposal', category: 'Governance' },
      { method: 'GET', path: '/governance/proposals', description: 'List proposals', category: 'Governance' },
      { method: 'GET', path: '/governance/proposals/{id}', description: 'Get proposal', category: 'Governance' },
      { method: 'POST', path: '/governance/vote', description: 'Vote on proposal', category: 'Governance' },
      { method: 'GET', path: '/governance/stats', description: 'Governance statistics', category: 'Governance' },
      
      // Registration endpoints
      { method: 'POST', path: '/registration/register', description: 'Register user', category: 'Registration' },
      { method: 'POST', path: '/registration/re-register', description: 'Re-register user', category: 'Registration' },
      { method: 'POST', path: '/registration/complete-payment', description: 'Complete payment', category: 'Registration' },
      { method: 'GET', path: '/registration/info', description: 'Registration info', category: 'Registration' },
      { method: 'GET', path: '/registration/stats', description: 'Registration stats', category: 'Registration' },
      { method: 'GET', path: '/registration/fee/{userId}', description: 'Get registration fee', category: 'Registration' },
      { method: 'GET', path: '/registration/free-remaining', description: 'Free registrations remaining', category: 'Registration' },
      
      // Treasury endpoints
      { method: 'GET', path: '/treasury/stats', description: 'Treasury statistics', category: 'Treasury' },
      { method: 'GET', path: '/treasury/bank-accounts', description: 'Get bank accounts', category: 'Treasury' },
      { method: 'POST', path: '/treasury/bank-accounts', description: 'Add bank account', category: 'Treasury' },
      { method: 'DELETE', path: '/treasury/bank-accounts/{id}', description: 'Delete bank account', category: 'Treasury' },
      { method: 'POST', path: '/treasury/withdraw', description: 'Request withdrawal', category: 'Treasury' },
      { method: 'GET', path: '/treasury/withdrawals', description: 'Withdrawal history', category: 'Treasury' },
    ];
  }

  static async testEndpoint(endpoint: string): Promise<ApiHealthCheck> {
    const startTime = Date.now();
    try {
      let response;
      const [, path] = endpoint.split(' ');
      
      switch (path) {
        case '/health':
          response = await this.getHealthStatus();
          break;
        case '/metrics':
          response = await this.getSystemMetrics();
          break;
        case '/system/stats':
          response = await this.getSystemStats();
          break;
        case '/treasury/balance':
          response = await this.getTreasuryBalance();
          break;
        case '/staking/options':
          response = await this.getStakingOptions();
          break;
        case '/loyalty/tiers':
          response = await this.getAllTiers();
          break;
        case '/analytics/platform':
          response = await this.getPlatformOverview();
          break;
        case '/analytics/projections':
          response = await this.getFinancialProjections();
          break;
        case '/analytics/status':
          response = await this.getPlatformStatus();
          break;
        case '/governance/stats':
          response = await this.getGovernanceStats();
          break;
        case '/registration/info':
          response = await this.getRegistrationInfo();
          break;
        case '/treasury/stats':
          response = await this.getTreasuryStats();
          break;
        case '/treasury/bank-accounts':
          response = await this.getBankAccounts();
          break;
        case '/treasury/withdrawals':
          response = await this.getWithdrawalHistory();
          break;
        default:
          throw new Error('Endpoint not implemented for testing');
      }

      const responseTime = Date.now() - startTime;
      return {
        endpoint,
        status: response.success ? 'success' : 'error',
        responseTime,
        message: response.success ? 'OK' : 'Failed',
        data: response.data,
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      return {
        endpoint,
        status: 'error',
        responseTime,
        message: error.message || 'Unknown error',
        data: null,
      };
    }
  }

  static async testAllEndpoints(): Promise<ApiHealthCheck[]> {
    const testableEndpoints = [
      'GET /health',
      'GET /metrics', 
      'GET /system/stats',
      'GET /treasury/balance',
      'GET /staking/options',
      'GET /loyalty/tiers',
      'GET /analytics/platform',
      'GET /analytics/projections',
      'GET /analytics/status',
      'GET /governance/stats',
      'GET /registration/info',
      'GET /treasury/stats',
      'GET /treasury/bank-accounts',
      'GET /treasury/withdrawals',
    ];

    const results = await Promise.allSettled(
      testableEndpoints.map(endpoint => this.testEndpoint(endpoint))
    );

    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          endpoint: testableEndpoints[index],
          status: 'error',
          responseTime: 0,
          message: result.reason?.message || 'Test failed',
          data: null,
        };
      }
    });
  }

  static async getFounderDashboard(): Promise<ApiResponse<FounderDashboard>> {
    try {
      const [
        systemStats,
        treasuryBalance,
        governanceStats,
        registrationStats,
        treasuryStats
      ] = await Promise.all([
        this.getAdminSystemStats(),
        this.getAdminTreasuryBalance(),
        this.getGovernanceStats(),
        this.getRegistrationStats('DIS1FOUNDER00000000000000000000000000'),
        this.getTreasuryStats()
      ]);

      const dashboard: FounderDashboard = {
        system_health: systemStats.data?.system_health || 'unknown',
        total_users: systemStats.data?.total_users || 0,
        total_transactions: systemStats.data?.total_transactions || 0,
        total_volume: systemStats.data?.total_volume || 0,
        total_revenue: systemStats.data?.total_revenue || 0,
        treasury_balance: treasuryBalance.data?.dusd_balance || 0,
        circulating_supply: treasuryBalance.data?.circulating_supply || 0,
        governance_enabled: governanceStats.data?.enabled || false,
        active_proposals: governanceStats.data?.active_proposals || 0,
        total_registrations: registrationStats.data?.total_registrations || 0,
        free_registrations_remaining: registrationStats.data?.free_registrations_remaining || 0,
        pending_withdrawals: treasuryStats.data?.pending_withdrawals || 0,
        monthly_withdrawal_limit: treasuryStats.data?.monthly_withdrawal_limit || 0,
      };

      return {
        success: true,
        data: dashboard,
        message: 'Founder dashboard data retrieved successfully'
      };
    } catch (error: any) {
      return {
        success: false,
        data: undefined,
        message: error.message || 'Failed to retrieve founder dashboard data'
      };
    }
  }

  // Helper formatting methods
  static formatStakingDuration(stakingType: string): string {
    switch (stakingType) {
      case '6M': return '6 Months';
      case '12M': return '12 Months';
      case '18M': return '18 Months';
      default: return stakingType;
    }
  }

  static formatLoyaltyTier(tier: string): { name: string; color: string; icon: string } {
    switch (tier.toLowerCase()) {
      case 'bronze': return { name: 'Bronze', color: 'text-orange-600', icon: '🥉' };
      case 'silver': return { name: 'Silver', color: 'text-gray-600', icon: '🥈' };
      case 'gold': return { name: 'Gold', color: 'text-yellow-600', icon: '🥇' };
      case 'platinum': return { name: 'Platinum', color: 'text-purple-600', icon: '💎' };
      case 'diamond': return { name: 'Diamond', color: 'text-blue-600', icon: '💠' };
      default: return { name: tier, color: 'text-gray-600', icon: '⭐' };
    }
  }

  static calculateProgress(current: number, target: number): number {
    return Math.min((current / target) * 100, 100);
  }

  static formatAPY(apy: number): string {
    return `${apy.toFixed(2)}%`;
  }
}

export default ApiService; 