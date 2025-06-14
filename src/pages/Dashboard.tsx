import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { WithdrawalMonitor } from '../services/monitor';
import type { WithdrawalDetails } from '../services/monitor';
import { SecurityService } from '../services/security';
import type { SecurityCheck, SecurityMetrics } from '../services/security';
import { 
    Shield, 
    AlertTriangle, 
    RefreshCw,
    Send,
    Download,
    CreditCard,
    Building2,
    Settings,
    Users,
    Activity
} from 'lucide-react';

interface DashboardProps {
    isFounder?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ isFounder = false }) => {
    const { wallet } = useWallet();
    const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
    const [alerts, setAlerts] = useState<SecurityCheck[]>([]);
    const [withdrawals, setWithdrawals] = useState<WithdrawalDetails[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        loadData();
        const interval = setInterval(() => {
            setRefreshKey(prev => prev + 1);
        }, 30000);

        return () => clearInterval(interval);
    }, [refreshKey]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            if (isFounder) {
                const [metricsData, alertsData, withdrawalsData] = await Promise.all([
                    SecurityService.getSecurityMetrics(),
                    SecurityService.getSecurityAlerts(),
                    WithdrawalMonitor.getPendingWithdrawals()
                ]);
                setMetrics(metricsData);
                setAlerts(alertsData);
                setWithdrawals(withdrawalsData);
            }
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleProcessWithdrawal = async (withdrawalId: string) => {
        try {
            await WithdrawalMonitor.processWithdrawal(withdrawalId);
            await loadData();
        } catch (error) {
            console.error('Failed to process withdrawal:', error);
        }
    };

    const handleRejectWithdrawal = async (withdrawalId: string, reason: string) => {
        try {
            await WithdrawalMonitor.rejectWithdrawal(withdrawalId, reason);
            await loadData();
        } catch (error) {
            console.error('Failed to reject withdrawal:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-binomena-dark via-gray-900 to-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            {isFounder ? 'Founder Dashboard' : 'My Wallet'}
                        </h1>
                        <p className="text-gray-400">
                            {isFounder ? 'Monitor and manage system operations' : 'Manage your funds and transactions'}
                        </p>
                    </div>
                    <button
                        onClick={() => loadData()}
                        className="flex items-center px-4 py-2 bg-binomena-primary text-white rounded-lg hover:bg-binomena-secondary transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>

                {/* Founder-specific sections */}
                {isFounder && (
                    <>
                        {/* Security Metrics */}
                        {metrics && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                                    <h3 className="text-gray-400 text-sm mb-2">Total Checks</h3>
                                    <p className="text-3xl font-bold text-white">{metrics.totalChecks}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                                    <h3 className="text-gray-400 text-sm mb-2">Passed Checks</h3>
                                    <p className="text-3xl font-bold text-green-500">{metrics.passedChecks}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                                    <h3 className="text-gray-400 text-sm mb-2">Failed Checks</h3>
                                    <p className="text-3xl font-bold text-red-500">{metrics.failedChecks}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                                    <h3 className="text-gray-400 text-sm mb-2">Warning Checks</h3>
                                    <p className="text-3xl font-bold text-yellow-500">{metrics.warningChecks}</p>
                                </div>
                            </div>
                        )}

                        {/* Security Alerts */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Shield className="w-5 h-5 mr-2" />
                                Security Alerts
                            </h2>
                            <div className="space-y-4">
                                {alerts.map(alert => (
                                    <div
                                        key={alert.id}
                                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                                    >
                                        <div className="flex items-start">
                                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                            <div className="ml-3">
                                                <p className="text-white font-medium">{alert.message}</p>
                                                <p className="text-gray-400 text-sm mt-1">
                                                    {new Date(alert.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pending Withdrawals */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                <Building2 className="w-5 h-5 mr-2" />
                                Pending Withdrawals
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-gray-400">
                                            <th className="p-4">User</th>
                                            <th className="p-4">Amount</th>
                                            <th className="p-4">Bank Details</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {withdrawals.map(withdrawal => (
                                            <tr key={withdrawal.id} className="border-t border-white/10">
                                                <td className="p-4">
                                                    <p className="text-white">{withdrawal.user_full_name}</p>
                                                    <p className="text-gray-400 text-sm">{withdrawal.user_id}</p>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-white font-medium">
                                                        {withdrawal.amount} {withdrawal.currency}
                                                    </p>
                                                    <p className="text-gray-400 text-sm">
                                                        {new Date(withdrawal.created_at).toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-white">{withdrawal.bank_name}</p>
                                                    <p className="text-gray-400 text-sm">{withdrawal.bank_iban}</p>
                                                    <p className="text-gray-400 text-sm">{withdrawal.bank_swift}</p>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                                        withdrawal.status === 'pending'
                                                            ? 'bg-yellow-500/20 text-yellow-500'
                                                            : withdrawal.status === 'processing'
                                                            ? 'bg-blue-500/20 text-blue-500'
                                                            : 'bg-green-500/20 text-green-500'
                                                    }`}>
                                                        {withdrawal.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleProcessWithdrawal(withdrawal.id)}
                                                            className="px-3 py-1 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors"
                                                        >
                                                            Process
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectWithdrawal(withdrawal.id, 'Rejected by founder')}
                                                            className="px-3 py-1 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Regular user sections */}
                {!isFounder && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                            <h3 className="text-gray-400 text-sm mb-2">Available Balance</h3>
                            <p className="text-3xl font-bold text-white">{wallet?.available_balance || '0.00'} USDT</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                            <h3 className="text-gray-400 text-sm mb-2">Total Balance</h3>
                            <p className="text-3xl font-bold text-white">{wallet?.total_balance || '0.00'} USDT</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                            <h3 className="text-gray-400 text-sm mb-2">Currencies</h3>
                            <div className="space-y-2">
                                {wallet?.currencies && Object.entries(wallet.currencies).map(([currency, amount]) => (
                                    <p key={currency} className="text-white">
                                        {amount} {currency}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}; 