import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  ArrowUpDown, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  TrendingUp,
  Clock,
  Award,
  // BarChart3,
  DollarSign
} from 'lucide-react';
import ApiService from '../services/api';
import type { SystemStats, TreasuryBalance } from '../types/api';
import { useWallet } from '../contexts/WalletContext';

export const HomePage: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [treasury, setTreasury] = useState<TreasuryBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useWallet();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, treasuryResponse] = await Promise.all([
          ApiService.getSystemStats(),
          ApiService.getTreasuryBalance()
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data || null);
        }

        if (treasuryResponse.success) {
          setTreasury(treasuryResponse.data || null);
        }
      } catch (error) {
        console.error('Failed to fetch homepage data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process up to 300,000 transactions per second with sub-second finality',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Advanced encryption and multi-layer security protocols protect your assets',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Globe,
      title: 'Global Infrastructure',
      description: 'Worldwide network ensuring 24/7 availability and optimal performance',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: DollarSign,
      title: 'BiUSD Stablecoin',
      description: 'Native stablecoin pegged 1:1 to USD with 18 decimal precision',
      color: 'text-biusd-green bg-green-100'
    }
  ];

  const useCases = [
    {
      title: 'Digital Payments',
      description: 'Send and receive payments instantly with minimal fees',
      icon: ArrowUpDown
    },
    {
      title: 'Cross-Border Transfers',
      description: 'Transfer money globally without traditional banking delays',
      icon: Globe
    },
    {
      title: 'Business Solutions',
      description: 'Integrate BiUSD payments into your business applications',
      icon: Users
    },
    {
      title: 'Treasury Management',
      description: 'Manage large-scale financial operations with institutional tools',
      icon: TrendingUp
    }
  ];

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 animate-fade-in">
              The Future of
              <span className="block text-yellow-300">Digital Finance</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in animation-delay-200">
              Experience the power of BINOMENA's digital infrastructure system with BiUSD stablecoin. 
              Fast, secure, and scalable financial transactions for the digital age.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-400">
              {isConnected ? (
                <Link to="/wallet" className="btn-primary bg-white text-binomena-primary hover:bg-slate-100 text-lg px-8 py-4">
                  <Wallet className="w-5 h-5 mr-2" />
                  Open Wallet
                </Link>
              ) : (
                <Link to="/wallet" className="btn-primary bg-white text-binomena-primary hover:bg-slate-100 text-lg px-8 py-4">
                  <Wallet className="w-5 h-5 mr-2" />
                  Get Started
                </Link>
              )}
              {/* <Link to="/stats" className="btn-secondary bg-white/20 text-white border-white/30 hover:bg-white/30 text-lg px-8 py-4">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Stats
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      {!isLoading && (stats || treasury) && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Live System Statistics</h2>
              <p className="text-gray-600">Real-time performance metrics of the BINOMENA network</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats && (
                <>
                  <div className="card p-6 text-center">
                    <div className="text-3xl font-bold text-binomena-primary mb-2">
                      {formatNumber(stats.total_users)}
                    </div>
                    <div className="text-sm text-gray-600">Total Users</div>
                  </div>
                  
                  <div className="card p-6 text-center">
                    <div className="text-3xl font-bold text-binomena-primary mb-2">
                      {formatNumber(stats.total_transactions)}
                    </div>
                    <div className="text-sm text-gray-600">Total Transactions</div>
                  </div>
                  
                  <div className="card p-6 text-center">
                    <div className="text-3xl font-bold text-binomena-primary mb-2">
                      {formatCurrency(stats.total_volume)}
                    </div>
                    <div className="text-sm text-gray-600">Total Volume</div>
                  </div>
                  
                  <div className="card p-6 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {stats.system_health.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-600">System Health</div>
                  </div>
                </>
              )}
            </div>

            {treasury && (
              <div className="mt-8 card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">BiUSD Treasury</h3>
                    <p className="text-gray-600">Total supply and circulation information</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-biusd-green mb-1">
                      {formatCurrency(treasury.total_supply)} BiUSD
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(treasury.circulating_supply)} Circulating
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose BINOMENA?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge technology to deliver unparalleled performance, 
              security, and reliability for your digital financial needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="card p-8 text-center hover:shadow-2xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Endless Possibilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From personal payments to enterprise solutions, BINOMENA powers 
              the full spectrum of digital financial applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase) => (
              <div 
                key={useCase.title}
                className="flex items-start space-x-6 p-8 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-binomena-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <useCase.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{useCase.title}</h3>
                  <p className="text-gray-600">{useCase.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Experience the Future?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users who trust BINOMENA for their digital financial needs. 
            Get started today and experience the power of BiUSD.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/wallet" 
              className="btn-primary bg-white text-binomena-primary hover:bg-slate-100 text-lg px-8 py-4"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Create Wallet
            </Link>
            <Link 
              to="/purchase" 
              className="btn-secondary bg-white/20 text-white border-white/30 hover:bg-white/30 text-lg px-8 py-4"
            >
              <DollarSign className="w-5 h-5 mr-2" />
              Buy BiUSD
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-8 h-8 text-green-400 mb-2" />
              <span className="text-sm text-slate-300">Bank-Grade Security</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-8 h-8 text-yellow-400 mb-2" />
              <span className="text-sm text-slate-300">300K+ TPS</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-8 h-8 text-blue-400 mb-2" />
              <span className="text-sm text-slate-300">24/7 Available</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-8 h-8 text-purple-400 mb-2" />
              <span className="text-sm text-slate-300">Compliant & Audited</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}; 