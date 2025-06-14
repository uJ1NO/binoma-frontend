import { API_BASE_URL } from '../config';

export interface WithdrawalDetails {
    id: string;
    user_id: string;
    user_full_name: string;
    amount: number;
    currency: string;
    bank_name: string;
    bank_iban: string;
    bank_swift: string;
    status: 'pending' | 'processing' | 'completed' | 'rejected';
    created_at: string;
    updated_at: string;
}

export interface WithdrawalSummary {
    total: number;
    pending: number;
    processing: number;
    completed: number;
    rejected: number;
    total_amount: number;
}

export interface SecurityAlert {
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
}

class MonitorService {
    private static instance: MonitorService;
    private constructor() {}

    public static getInstance(): MonitorService {
        if (!MonitorService.instance) {
            MonitorService.instance = new MonitorService();
        }
        return MonitorService.instance;
    }

    async getPendingWithdrawals(): Promise<WithdrawalDetails[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/withdrawals/pending`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch pending withdrawals');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching pending withdrawals:', error);
            throw error;
        }
    }

    async getSecurityAlerts(): Promise<SecurityAlert[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/security/alerts`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch security alerts');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching security alerts:', error);
            throw error;
        }
    }

    async processWithdrawal(withdrawalId: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/withdrawals/${withdrawalId}/process`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to process withdrawal');
            }
        } catch (error) {
            console.error('Error processing withdrawal:', error);
            throw error;
        }
    }

    async rejectWithdrawal(withdrawalId: string, reason: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/withdrawals/${withdrawalId}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason }),
            });

            if (!response.ok) {
                throw new Error('Failed to reject withdrawal');
            }
        } catch (error) {
            console.error('Error rejecting withdrawal:', error);
            throw error;
        }
    }

    async getWithdrawalDetails(withdrawalId: string): Promise<WithdrawalDetails> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/withdrawals/${withdrawalId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch withdrawal details');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching withdrawal details:', error);
            throw error;
        }
    }

    async getSystemStats(): Promise<{
        totalUsers: number;
        activeWallets: number;
        totalVolume: number;
        pendingWithdrawals: number;
    }> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/stats/system`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch system stats');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching system stats:', error);
            throw error;
        }
    }

    async getWithdrawalSummary(): Promise<WithdrawalSummary> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/withdrawals/summary`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch withdrawal summary');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching withdrawal summary:', error);
            throw error;
        }
    }
}

export const WithdrawalMonitor = MonitorService.getInstance(); 