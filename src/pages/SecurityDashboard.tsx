import React, { useState, useEffect } from 'react';
import { SecurityService } from '../services/security';
import type { SecurityCheck, SecurityMetrics } from '../services/security';
import { 
    Shield, 
    AlertTriangle, 
    CheckCircle, 
    XCircle,
    RefreshCw
} from 'lucide-react';

export const SecurityDashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<SecurityMetrics | null>(null);
    const [alerts, setAlerts] = useState<SecurityCheck[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        loadData();
        // Set up periodic refresh
        const interval = setInterval(() => {
            setRefreshKey(prev => prev + 1);
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [refreshKey]);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [metricsData, alertsData] = await Promise.all([
                SecurityService.getSecurityMetrics(),
                SecurityService.getSecurityAlerts()
            ]);
            setMetrics(metricsData);
            setAlerts(alertsData);
        } catch (error) {
            console.error('Failed to load security data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: SecurityCheck['status']) => {
        switch (status) {
            case 'pass':
                return 'text-green-500';
            case 'fail':
                return 'text-red-500';
            case 'warning':
                return 'text-yellow-500';
            default:
                return 'text-gray-500';
        }
    };

    const getStatusIcon = (status: SecurityCheck['status']) => {
        switch (status) {
            case 'pass':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'fail':
                return <XCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-binomena-dark via-gray-900 to-black p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Security Dashboard</h1>
                        <p className="text-gray-400">Monitor system security and alerts</p>
                    </div>
                    <button
                        onClick={() => loadData()}
                        className="flex items-center px-4 py-2 bg-binomena-primary text-white rounded-lg hover:bg-binomena-secondary transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>

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
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
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
                                    {getStatusIcon(alert.status)}
                                    <div className="ml-3">
                                        <div className="flex items-center">
                                            <p className="text-white font-medium">{alert.message}</p>
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(alert.status)}`}>
                                                {alert.type}
                                            </span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {new Date(alert.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}; 