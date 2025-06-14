import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { 
  ArrowDownLeft,
  CreditCard,
  Building2,
  Smartphone,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
  Banknote
} from 'lucide-react';

interface WithdrawalMethod {
  id: string;
  name: string;
  icon: any;
  fee: number;
  processingTime: string;
  limits: {
    min: number;
    max: number;
    daily: number;
  };
}

export const WithdrawPage: React.FC = () => {
  const { wallet, isConnected } = useWallet();
  const [selectedMethod, setSelectedMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [accountInfo, setAccountInfo] = useState({
    accountNumber: '',
    routingNumber: '',
    accountHolder: '',
    bankName: ''
  });
  const [step, setStep] = useState<'amount' | 'details' | 'confirm' | 'processing' | 'success'>('amount');
  const [isLoading, setIsLoading] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const withdrawalMethods: WithdrawalMethod[] = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building2,
      fee: 1.0,
      processingTime: '1-3 business days',
      limits: { min: 10, max: 50000, daily: 100000 }
    },
    {
      id: 'card',
      name: 'Debit Card',
      icon: CreditCard,
      fee: 2.5,
      processingTime: 'Within 1 hour',
      limits: { min: 5, max: 5000, daily: 10000 }
    },
    {
      id: 'mobile',
      name: 'Mobile Wallet',
      icon: Smartphone,
      fee: 1.5,
      processingTime: 'Instant',
      limits: { min: 1, max: 2000, daily: 5000 }
    }
  ];

  // BINOMENA system withdrawal fee (0.5%)
  const BINOMENA_WITHDRAWAL_FEE_RATE = 0.5;

  const selectedMethodData = withdrawalMethods.find(m => m.id === selectedMethod);

  const calculateProcessorFee = () => {
    if (!selectedMethodData || !amount) return 0;
    const amountNum = parseFloat(amount);
    return isNaN(amountNum) ? 0 : (amountNum * selectedMethodData.fee) / 100;
  };

  const calculateBinomenaFee = () => {
    if (!amount) return 0;
    const amountNum = parseFloat(amount);
    return isNaN(amountNum) ? 0 : (amountNum * BINOMENA_WITHDRAWAL_FEE_RATE) / 100;
  };

  const calculateTotalFees = () => {
    return calculateProcessorFee() + calculateBinomenaFee();
  };

  const calculateTotal = () => {
    const amountNum = parseFloat(amount) || 0;
    const totalFees = calculateTotalFees();
    return Math.max(0, amountNum - totalFees);
  };

  const handleWithdraw = async () => {
    setIsLoading(true);
    setStep('processing');
    
    // Simulate processing
    setTimeout(() => {
      setStep('success');
      setIsLoading(false);
    }, 3000);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-binomena-dark via-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-binomena-primary to-binomena-secondary rounded-2xl flex items-center justify-center mb-4">
            <ArrowDownLeft className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">You need to connect your wallet to withdraw funds</p>
          <a
            href="/wallet"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all"
          >
            Connect Wallet
          </a>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-binomena-dark via-gray-900 to-black flex items-center justify-center p-4">
        <motion.div
          className="text-center max-w-md w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-20 h-20 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Withdrawal Initiated!</h1>
          <p className="text-gray-400 mb-2">
            ${calculateTotal().toFixed(2)} is being processed
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Expected arrival: {selectedMethodData?.processingTime}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/wallet'}
              className="w-full bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all"
            >
              View Wallet
            </button>
            <button
              onClick={() => {
                setStep('amount');
                setAmount('');
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg transition-all"
            >
              Make Another Withdrawal
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-binomena-dark via-gray-900 to-black py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
          <p className="text-gray-400">Convert your BiUSD to cash in your bank account</p>
        </div>

        {/* Current Balance */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Available Balance</p>
              <p className="text-3xl font-bold text-white">
                {wallet?.balance?.toFixed(4) || '0.0000'} BiUSD
              </p>
              <p className="text-gray-400 text-sm">
                ≈ ${wallet?.balance?.toFixed(2) || '0.00'} USD
              </p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-binomena-primary to-binomena-secondary rounded-2xl flex items-center justify-center">
              <Banknote className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['amount', 'details', 'confirm'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName || ['details', 'confirm'].includes(step) && index < 2 || step === 'confirm' && index < 3
                    ? 'bg-binomena-primary text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    ['details', 'confirm'].includes(step) && index < 1 || step === 'confirm' && index < 2
                      ? 'bg-binomena-primary'
                      : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
              {step === 'amount' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl font-bold text-white mb-6">Withdrawal Method & Amount</h2>
                  
                  {/* Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Select Withdrawal Method</label>
                    <div className="space-y-3">
                      {withdrawalMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`w-full p-4 rounded-lg border text-left transition-all ${
                            selectedMethod === method.id
                              ? 'border-binomena-primary bg-binomena-primary/10'
                              : 'border-white/20 bg-white/5 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <method.icon className="w-6 h-6 text-binomena-primary" />
                            <div className="flex-1">
                              <div className="text-white font-medium">{method.name}</div>
                              <div className="text-sm text-gray-400">
                                {method.fee}% fee • {method.processingTime}
                              </div>
                            </div>
                            <div className="text-right text-sm text-gray-400">
                              <div>Max: ${method.limits.max.toLocaleString()}</div>
                              <div>Daily: ${method.limits.daily.toLocaleString()}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Withdrawal Amount (BiUSD)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      max={wallet?.balance || 0}
                      className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white text-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
                    />
                    {selectedMethodData && (
                      <div className="mt-2 flex justify-between text-sm text-gray-400">
                        <span>Min: ${selectedMethodData.limits.min}</span>
                        <span>Max: ${selectedMethodData.limits.max.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  {amount && parseFloat(amount) > 0 && (
                    <div className="mb-6 p-4 bg-white/5 rounded-lg space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Withdrawal amount:</span>
                        <span className="text-white">${amount} BiUSD</span>
                      </div>
                                              <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Processor Fee ({selectedMethodData?.fee}%):</span>
                          <span className="text-red-400">-${calculateProcessorFee().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">BINOMENA Fee (0.5%):</span>
                          <span className="text-red-400">-${calculateBinomenaFee().toFixed(2)}</span>
                        </div>
                        <div className="border-t border-white/20 pt-2 flex justify-between font-medium">
                        <span className="text-white">You will receive:</span>
                        <span className="text-binomena-primary">${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setStep('details')}
                    disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > (wallet?.balance || 0)}
                    className="w-full bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Account Details
                  </button>
                </motion.div>
              )}

              {step === 'details' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Account Details</h2>
                    <button
                      onClick={() => setStep('amount')}
                      className="text-binomena-primary hover:text-green-400 text-sm"
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        value={accountInfo.accountHolder}
                        onChange={(e) => setAccountInfo({...accountInfo, accountHolder: e.target.value})}
                        placeholder="John Doe"
                        className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={accountInfo.bankName}
                        onChange={(e) => setAccountInfo({...accountInfo, bankName: e.target.value})}
                        placeholder="Chase Bank"
                        className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Account Number
                        </label>
                        <div className="relative">
                          <input
                            type={showAccountDetails ? 'text' : 'password'}
                            value={accountInfo.accountNumber}
                            onChange={(e) => setAccountInfo({...accountInfo, accountNumber: e.target.value})}
                            placeholder="1234567890"
                            className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAccountDetails(!showAccountDetails)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                          >
                            {showAccountDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Routing Number
                        </label>
                        <input
                          type="text"
                          value={accountInfo.routingNumber}
                          onChange={(e) => setAccountInfo({...accountInfo, routingNumber: e.target.value})}
                          placeholder="021000021"
                          className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep('confirm')}
                    disabled={!accountInfo.accountHolder || !accountInfo.bankName || !accountInfo.accountNumber || !accountInfo.routingNumber}
                    className="w-full bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Confirmation
                  </button>
                </motion.div>
              )}

              {step === 'confirm' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Confirm Withdrawal</h2>
                    <button
                      onClick={() => setStep('details')}
                      className="text-binomena-primary hover:text-green-400 text-sm"
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="text-white font-medium mb-3">Withdrawal Details</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Amount:</span>
                          <div className="text-white font-medium">${amount} BiUSD</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Method:</span>
                          <div className="text-white font-medium">{selectedMethodData?.name}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Processing time:</span>
                          <div className="text-white font-medium">{selectedMethodData?.processingTime}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">You'll receive:</span>
                          <div className="text-binomena-primary font-medium">${calculateTotal().toFixed(2)}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg">
                      <h3 className="text-white font-medium mb-3">Destination Account</h3>
                      <div className="text-sm space-y-1">
                        <div><span className="text-gray-400">Account holder:</span> <span className="text-white">{accountInfo.accountHolder}</span></div>
                        <div><span className="text-gray-400">Bank:</span> <span className="text-white">{accountInfo.bankName}</span></div>
                        <div><span className="text-gray-400">Account:</span> <span className="text-white">***{accountInfo.accountNumber.slice(-4)}</span></div>
                        <div><span className="text-gray-400">Routing:</span> <span className="text-white">{accountInfo.routingNumber}</span></div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Confirm Withdrawal'}
                  </button>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 mx-auto bg-binomena-primary rounded-full flex items-center justify-center mb-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <ArrowDownLeft className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Processing Withdrawal</h3>
                  <p className="text-gray-400">Please wait while we initiate your withdrawal...</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-bold text-white mb-4">Withdrawal Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Shield className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Secure & Encrypted</div>
                    <div className="text-xs text-gray-400">Bank-grade security</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Processing Times</div>
                    <div className="text-xs text-gray-400">Instant to 3 business days</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Building2 className="w-5 h-5 text-binomena-primary" />
                  <div>
                    <div className="text-sm font-medium text-white">Supported Banks</div>
                    <div className="text-xs text-gray-400">All major US banks</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-300">
                    <p className="font-medium mb-1">Processing Notice</p>
                    <p>Withdrawals are processed during business hours. Weekend requests will be processed on Monday.</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-300">
                    <p className="font-medium mb-1">Important</p>
                    <p>Ensure your account details are correct. Incorrect information may delay processing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 