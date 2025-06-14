import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Wallet, 
  ArrowUpDown, 
  // BarChart3, 
  User,
  LogOut,
  ChevronDown,
  Crown,
  AlertCircle,
  Home,
  Star,
  DollarSign,
  Download,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useApi } from '../../contexts/ApiContext';

// Navigation configuration with icons and metadata
const navigationConfig = [
  { 
    name: 'Home', 
    href: '/', 
    icon: Home, 
    description: 'Dashboard Overview',
    category: 'main'
  },
  { 
    name: 'Wallet', 
    href: '/wallet', 
    icon: Wallet, 
    description: 'Manage your digital assets',
    category: 'main'
  },
  { 
    name: 'Staking', 
    href: '/staking', 
    icon: TrendingUp, 
    description: 'Earn rewards through staking',
    category: 'main'
  },
  { 
    name: 'Loyalty', 
    href: '/loyalty', 
    icon: Star, 
    description: 'Loyalty program benefits',
    category: 'main'
  },
  { 
    name: 'Transactions', 
    href: '/transactions', 
    icon: ArrowUpDown, 
    description: 'Transaction history',
    category: 'secondary'
  },
  { 
    name: 'Purchase', 
    href: '/purchase', 
    icon: DollarSign, 
    description: 'Buy BiUSD tokens',
    category: 'secondary'
  },
  { 
    name: 'Withdraw', 
    href: '/withdraw', 
    icon: Download, 
    description: 'Withdraw to bank',
    category: 'secondary'
  },
  // { 
  //   name: 'Stats', 
  //   href: '/stats', 
  //   icon: BarChart3, 
  //   description: 'Platform statistics',
  //   category: 'secondary'
  // }
];

// Custom hook for outside click detection
const useOutsideClick = (ref: React.RefObject<HTMLElement | null>, callback: () => void) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
};

// Component for mobile navigation item
const MobileNavItem: React.FC<{
  item: typeof navigationConfig[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => (
  <Link
    to={item.href}
    onClick={onClick}
    className={`
      group flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-200 
      ${isActive 
        ? 'bg-gradient-to-r from-binomena-primary to-binomena-secondary text-white shadow-lg' 
        : 'text-slate-700 hover:bg-slate-50 hover:text-binomena-primary active:bg-slate-100'
      }
    `}
    aria-label={`Navigate to ${item.name} - ${item.description}`}
  >
    <item.icon className={`w-6 h-6 transition-colors ${
      isActive ? 'text-white' : 'text-slate-500 group-hover:text-binomena-primary'
    }`} />
    <div className="flex-1 min-w-0">
      <div className={`font-semibold text-base ${isActive ? 'text-white' : 'text-slate-900'}`}>
        {item.name}
      </div>
      <div className={`text-sm truncate ${
        isActive ? 'text-white/80' : 'text-slate-500 group-hover:text-slate-600'
      }`}>
        {item.description}
      </div>
    </div>
  </Link>
);

// Component for desktop navigation item
const DesktopNavItem: React.FC<{
  item: typeof navigationConfig[0];
  isActive: boolean;
}> = ({ item, isActive }) => (
  <Link
    to={item.href}
    className={`
      group relative flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-medium 
      transition-all duration-200 hover:scale-105
      ${isActive
        ? 'bg-gradient-to-r from-binomena-primary to-binomena-secondary text-white shadow-lg'
        : 'text-slate-600 hover:text-binomena-primary hover:bg-slate-50'
      }
    `}
    aria-label={`Navigate to ${item.name}`}
  >
    <item.icon className="w-4 h-4" />
    <span>{item.name}</span>
    {isActive && (
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
    )}
  </Link>
);

// Component for connection status indicator
const ConnectionStatus: React.FC<{
  isOnline: boolean;
  apiHealth: boolean;
  className?: string;
}> = ({ isOnline, apiHealth, className = '' }) => {
  const status = isOnline && apiHealth;
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
          status ? 'bg-green-500' : 'bg-red-500'
        }`} />
        {status && (
          <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-400 animate-ping opacity-75" />
        )}
      </div>
      <span className="text-xs font-medium text-slate-600">
        {status ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

// Main Navbar component
export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const location = useLocation();
  const { wallet, isConnected, disconnect } = useWallet();
  const { isOnline, apiHealth } = useApi();
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Close menus when clicking outside
  useOutsideClick(userMenuRef, () => setIsUserMenuOpen(false));
  useOutsideClick(mobileMenuRef, () => setIsMobileMenuOpen(false));

  const isFounderMode = location.search.includes('founder=true') || location.pathname.includes('founder');

  const isActivePath = useCallback((path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const formatBalance = useCallback((balance: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(balance);
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleDisconnect = () => {
    disconnect();
    setIsUserMenuOpen(false);
  };

  // Filter navigation items
  const mainNavItems = navigationConfig.filter(item => item.category === 'main');
  const secondaryNavItems = navigationConfig.filter(item => item.category === 'secondary');

  return (
    <>
      {/* Main Navigation */}
      <nav className={`
        sticky top-0 z-50 transition-all duration-300
        ${scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-slate-200/50' 
          : 'bg-white shadow-sm border-b border-slate-200'
        }
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo and Brand */}
            <div className="flex items-center flex-shrink-0">
              <Link 
                to="/" 
                className="flex items-center space-x-3 group"
                aria-label="BINOMENA Home"
              >
                <div className="hero-gradient w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div className="flex flex-col">
                  <span className="gradient-text font-bold text-xl tracking-tight">
                    BINOMENA
                  </span>
                  {isFounderMode && (
                    <span className="flex items-center text-xs text-amber-600 font-medium">
                      <Crown className="w-3 h-3 mr-1" />
                      Founder Mode
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Main Items */}
            <div className="hidden lg:flex items-center space-x-2">
              {mainNavItems.map((item) => (
                <DesktopNavItem
                  key={item.name}
                  item={item}
                  isActive={isActivePath(item.href)}
                />
              ))}
              
              {/* More Menu for Secondary Items */}
              <div className="relative group">
                <button className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-binomena-primary hover:bg-slate-50 transition-colors">
                  <span>More</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {secondaryNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                        isActivePath(item.href) ? 'text-binomena-primary bg-slate-50' : 'text-slate-700'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Connection Status - Hidden on mobile */}
              <ConnectionStatus 
                isOnline={isOnline} 
                apiHealth={apiHealth} 
                className="hidden sm:flex"
              />

              {/* Wallet Section */}
              {isConnected && wallet ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={handleUserMenuToggle}
                    className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100 rounded-xl px-3 py-2 transition-all duration-200 hover:shadow-md"
                    aria-label="User menu"
                  >
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-sm font-semibold text-slate-900">
                        {formatBalance(wallet.balance)} BiUSD
                      </span>
                      <span className="text-xs text-slate-500">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </span>
                    </div>
                    <div className="hero-gradient w-8 h-8 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 animate-in slide-in-from-top-5 duration-200">
                      
                      {/* Wallet Info */}
                      <div className="px-4 py-4 border-b border-slate-100">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="hero-gradient w-10 h-10 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">Connected Wallet</p>
                            <p className="text-xs text-slate-500">
                              {wallet.address.slice(0, 16)}...{wallet.address.slice(-8)}
                            </p>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-binomena-primary/10 to-binomena-secondary/10 rounded-lg p-3">
                          <p className="text-sm text-slate-600 mb-1">Current Balance</p>
                          <p className="text-xl font-bold text-binomena-primary">
                            {formatBalance(wallet.balance)} BiUSD
                          </p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/wallet"
                          className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Wallet className="w-4 h-4 mr-3 text-slate-500" />
                          <div>
                            <div className="font-medium">Wallet Details</div>
                            <div className="text-xs text-slate-500">Manage your wallet</div>
                          </div>
                        </Link>
                        
                        <Link
                          to="/transactions"
                          className="flex items-center px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <ArrowUpDown className="w-4 h-4 mr-3 text-slate-500" />
                          <div>
                            <div className="font-medium">Transaction History</div>
                            <div className="text-xs text-slate-500">View all transactions</div>
                          </div>
                        </Link>

                        {isFounderMode && (
                          <>
                            <div className="border-t border-slate-100 my-2"></div>
                            <Link
                              to="/founder"
                              className="flex items-center px-4 py-3 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Crown className="w-4 h-4 mr-3 text-amber-600" />
                              <div>
                                <div className="font-medium">Founder Dashboard</div>
                                <div className="text-xs text-amber-600">System oversight</div>
                              </div>
                            </Link>
                            <Link
                              to="/admin"
                              className="flex items-center px-4 py-3 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Settings className="w-4 h-4 mr-3 text-amber-600" />
                              <div>
                                <div className="font-medium">Admin Settings</div>
                                <div className="text-xs text-amber-600">Platform configuration</div>
                              </div>
                            </Link>
                          </>
                        )}
                      </div>

                      {/* Disconnect Button */}
                      <div className="border-t border-slate-100 pt-2">
                        <button
                          onClick={handleDisconnect}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          <div>
                            <div className="font-medium">Disconnect Wallet</div>
                            <div className="text-xs text-red-500">Sign out securely</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/wallet"
                  className="btn-primary flex items-center space-x-2 px-4 py-2 text-sm font-medium"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="hidden sm:inline">Connect Wallet</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={handleMobileMenuToggle}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="lg:hidden border-t border-slate-200 bg-white animate-in slide-in-from-top-5 duration-300"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
              
              {/* Connection Status */}
              <div className="flex items-center justify-between py-3 px-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-medium text-slate-700">System Status</span>
                <ConnectionStatus isOnline={isOnline} apiHealth={apiHealth} />
              </div>

              {/* Main Navigation */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 px-4">
                  Main Navigation
                </h3>
                {mainNavItems.map((item) => (
                  <MobileNavItem
                    key={item.name}
                    item={item}
                    isActive={isActivePath(item.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>

              {/* Secondary Navigation */}
              <div className="space-y-3">
                <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-500 px-4">
                  More Features
                </h3>
                {secondaryNavItems.map((item) => (
                  <MobileNavItem
                    key={item.name}
                    item={item}
                    isActive={isActivePath(item.href)}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </div>

              {/* Mobile Wallet Info */}
              {isConnected && wallet && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="bg-gradient-to-r from-binomena-primary/10 to-binomena-secondary/10 rounded-xl p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="hero-gradient w-10 h-10 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Wallet Connected</p>
                        <p className="text-xs text-slate-500">
                          {wallet.address.slice(0, 10)}...{wallet.address.slice(-6)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600">Balance</p>
                        <p className="text-lg font-bold text-binomena-primary">
                          {formatBalance(wallet.balance)} BiUSD
                        </p>
                      </div>
                      <button
                        onClick={handleDisconnect}
                        className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Disconnect</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Offline Alert Banner */}
      {!isOnline && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-center text-red-800 max-w-7xl mx-auto">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium">
              You are currently offline. Some features may not work properly.
            </span>
          </div>
        </div>
      )}
    </>
  );
}; 