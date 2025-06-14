import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Zap,
  Globe,
  Shield,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Cpu,
  HardDrive,
  Network,
  Database
} from 'lucide-react';

interface SystemMetric {
  id: string;
  name: string;
  value: string;
  change: number;
  icon: any;
  color: string;
  description: string;
}

interface NetworkNode {
  id: string;
  location: string;
  status: 'online' | 'warning' | 'offline';
  uptime: number;
  load: number;
}

export const StatsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock real-time data
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'users',
      name: 'Total Users',
      value: '127,543',
      change: 12.5,
      icon: Users,
      color: 'text-blue-400',
      description: 'Active registered users'
    },
    {
      id: 'transactions',
      name: 'Total Transactions',
      value: '2.4M',
      change: 8.3,
      icon: Activity,
      color: 'text-green-400',
      description: 'Completed transactions'
    },
    {
      id: 'volume',
      name: 'Total Volume',
      value: '$1.2B',
      change: 15.7,
      icon: DollarSign,
      color: 'text-binomena-primary',
      description: 'Total transaction volume'
    },
    {
      id: 'tps',
      name: 'Current TPS',
      value: '47,892',
      change: -2.1,
      icon: Zap,
      color: 'text-yellow-400',
      description: 'Transactions per second'
    },
    {
      id: 'supply',
      name: 'BiUSD Supply',
      value: '850.2M',
      change: 5.2,
      icon: BarChart3,
      color: 'text-purple-400',
      description: 'Total BiUSD in circulation'
    },
    {
      id: 'nodes',
      name: 'Network Nodes',
      value: '1,247',
      change: 3.1,
      icon: Globe,
      color: 'text-indigo-400',
      description: 'Active network nodes'
    }
  ]);

  const networkNodes: NetworkNode[] = [
    { id: 'us-east', location: 'US East', status: 'online', uptime: 99.98, load: 67 },
    { id: 'us-west', location: 'US West', status: 'online', uptime: 99.95, load: 72 },
    { id: 'eu-central', location: 'EU Central', status: 'online', uptime: 99.97, load: 58 },
    { id: 'asia-pacific', location: 'Asia Pacific', status: 'warning', uptime: 98.82, load: 89 },
    { id: 'canada', location: 'Canada', status: 'online', uptime: 99.91, load: 45 },
    { id: 'south-america', location: 'South America', status: 'online', uptime: 99.88, load: 63 }
  ];

  const systemHealth = {
    overall: 'excellent',
    uptime: 99.94,
    responseTime: 127,
    errorRate: 0.02
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update metrics with slight variations
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => ({
          ...metric,
          change: metric.change + (Math.random() - 0.5) * 2
        }))
      );
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-400 bg-green-400/10';
      case 'warning':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'offline':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4" />;
      case 'offline':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-400';
      case 'good':
        return 'text-blue-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-binomena-dark via-gray-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">System Statistics</h1>
            <p className="text-gray-400">Real-time BINOMENA network metrics and performance data</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* System Health Overview */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">System Health</h2>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(systemHealth.overall)} ${getHealthColor(systemHealth.overall).replace('text-', 'bg-')}/10`}>
              <Shield className="w-4 h-4 mr-2" />
              {systemHealth.overall.charAt(0).toUpperCase() + systemHealth.overall.slice(1)}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-green-400 mb-1">{systemHealth.uptime}%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">{systemHealth.responseTime}ms</div>
              <div className="text-sm text-gray-400">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{systemHealth.errorRate}%</div>
              <div className="text-sm text-gray-400">Error Rate</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <div className="text-2xl font-bold text-binomena-primary mb-1">300K+</div>
              <div className="text-sm text-gray-400">Max TPS</div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${metric.color.replace('text-', 'bg-')}/20 flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  metric.change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {metric.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{Math.abs(metric.change).toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="mb-2">
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm font-medium text-gray-300">{metric.name}</div>
              </div>
              
              <p className="text-xs text-gray-400">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Network Nodes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Network Nodes Status</h3>
            <div className="space-y-4">
              {networkNodes.map((node) => (
                <div key={node.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(node.status)}`}>
                      {getStatusIcon(node.status)}
                      <span className="ml-1">{node.status}</span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{node.location}</div>
                      <div className="text-sm text-gray-400">Uptime: {node.uptime}%</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">{node.load}%</div>
                    <div className="text-xs text-gray-400">Load</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6">Infrastructure Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">CPU Usage</div>
                    <div className="text-sm text-gray-400">Across all nodes</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">68%</div>
                  <div className="text-xs text-gray-400">Average</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <HardDrive className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-white font-medium">Storage</div>
                    <div className="text-sm text-gray-400">Total capacity</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">2.8TB</div>
                  <div className="text-xs text-gray-400">Free: 4.2TB</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Network className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Network I/O</div>
                    <div className="text-sm text-gray-400">Total bandwidth</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">1.2 GB/s</div>
                  <div className="text-xs text-gray-400">Peak: 2.1 GB/s</div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-white font-medium">Database</div>
                    <div className="text-sm text-gray-400">Query performance</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">42ms</div>
                  <div className="text-xs text-gray-400">Avg query time</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Recent System Events</h3>
          <div className="space-y-4">
            {[
              { time: '2 minutes ago', event: 'Node US-West-2 came online', type: 'success' },
              { time: '15 minutes ago', event: 'Database optimization completed', type: 'info' },
              { time: '1 hour ago', event: 'Network traffic spike detected and handled', type: 'warning' },
              { time: '3 hours ago', event: 'Scheduled maintenance completed on EU nodes', type: 'success' },
              { time: '6 hours ago', event: 'New security patch deployed across network', type: 'info' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'success' ? 'bg-green-400' :
                  activity.type === 'warning' ? 'bg-yellow-400' :
                  'bg-blue-400'
                }`} />
                <div className="flex-1">
                  <div className="text-white text-sm">{activity.event}</div>
                </div>
                <div className="text-xs text-gray-400">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}; 