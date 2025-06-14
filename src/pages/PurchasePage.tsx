import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../contexts/WalletContext';
import { 
  CreditCard, 
  DollarSign, 
  Wallet,
  Shield,
  Clock,
  CheckCircle,
  Info,
  Zap,
  TrendingUp
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  fee: number;
  processingTime: string;
  limits: {
    min: number;
    max: number;
  };
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Rate to BiUSD
}

export const PurchasePage: React.FC = () => {
  const { wallet, isConnected } = useWallet();
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [amount, setAmount] = useState('');
  const [biusdAmount, setBiusdAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'amount' | 'payment' | 'confirm' | 'processing' | 'success'>('amount');

  const currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
    { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
    { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.75 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      fee: 2.5,
      processingTime: 'Instant',
      limits: { min: 10, max: 10000 }
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: DollarSign,
      fee: 0.5,
      processingTime: '1-3 business days',
      limits: { min: 50, max: 50000 }
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: Wallet,
      fee: 1.0,
      processingTime: '10-30 minutes',
      limits: { min: 25, max: 25000 }
    }
  ];

  const selectedCurrencyData = currencies.find(c => c.code === selectedCurrency);
  const selectedPaymentData = paymentMethods.find(p => p.id === selectedPayment);

  useEffect(() => {
    if (amount && selectedCurrencyData) {
      const amountNum = parseFloat(amount);
      if (!isNaN(amountNum)) {
        const biusd = amountNum / selectedCurrencyData.rate;
        setBiusdAmount(biusd.toFixed(4));
      } else {
        setBiusdAmount('');
      }
    } else {
      setBiusdAmount('');
    }
  }, [amount, selectedCurrencyData]);

  const handlePurchase = async () => {
    setIsLoading(true);
    setStep('processing');
    
    // Simulate processing
    setTimeout(() => {
      setStep('success');
      setIsLoading(false);
    }, 3000);
  };

  const calculateFee = () => {
    if (!selectedPaymentData || !amount) return 0;
    const amountNum = parseFloat(amount);
    return isNaN(amountNum) ? 0 : (amountNum * selectedPaymentData.fee) / 100;
  };

  const calculateTotal = () => {
    const amountNum = parseFloat(amount) || 0;
    const fee = calculateFee();
    return amountNum + fee;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-binomena-dark via-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-binomena-primary to-binomena-secondary rounded-2xl flex items-center justify-center mb-4">
            <CreditCard className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h1>
          <p className="text-gray-400 mb-6">You need to connect your wallet to purchase BiUSD</p>
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
          <h1 className="text-2xl font-bold text-white mb-2">Purchase Successful!</h1>
          <p className="text-gray-400 mb-6">
            {biusdAmount} BiUSD has been added to your wallet
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
                setBiusdAmount('');
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg transition-all"
            >
              Buy More
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
          <h1 className="text-3xl font-bold text-white mb-2">Purchase BiUSD</h1>
          <p className="text-gray-400">Buy BiUSD with your preferred currency and payment method</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['amount', 'payment', 'confirm'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === stepName || ['payment', 'confirm'].includes(step) && index < 2 || step === 'confirm' && index < 3
                    ? 'bg-binomena-primary text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {index + 1}
                </div>
                {index < 2 && (
                  <div className={`w-12 h-0.5 mx-2 ${
                    ['payment', 'confirm'].includes(step) && index < 1 || step === 'confirm' && index < 2
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
                  <h2 className="text-xl font-bold text-white mb-6">Enter Amount</h2>
                  
                  {/* Currency Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-3">Select Currency</label>
                    <div className="grid grid-cols-2 gap-3">
                      {currencies.map((currency) => (
                        <button
                          key={currency.code}
                          onClick={() => setSelectedCurrency(currency.code)}
                          className={`p-4 rounded-lg border transition-all ${
                            selectedCurrency === currency.code
                              ? 'border-binomena-primary bg-binomena-primary/10 text-white'
                              : 'border-white/20 bg-white/5 text-gray-300 hover:bg-white/10'
                          }`}
                        >
                          <div className="text-lg font-semibold">{currency.symbol} {currency.code}</div>
                          <div className="text-sm opacity-75">{currency.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount ({selectedCurrencyData?.symbol})
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white text-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-binomena-primary focus:border-binomena-primary"
                    />
                    {selectedPaymentData && (
                      <p className="text-sm text-gray-400 mt-2">
                        Min: {selectedCurrencyData?.symbol}{selectedPaymentData.limits.min} - 
                        Max: {selectedCurrencyData?.symbol}{selectedPaymentData.limits.max}
                      </p>
                    )}
                  </div>

                  {/* BiUSD Preview */}
                  {biusdAmount && (
                    <div className="mb-6 p-4 bg-binomena-primary/10 border border-binomena-primary/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">You will receive:</span>
                        <span className="text-xl font-bold text-binomena-primary">{biusdAmount} BiUSD</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => setStep('payment')}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className="w-full bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Select Payment Method</h2>
                    <button
                      onClick={() => setStep('amount')}
                      className="text-binomena-primary hover:text-green-400 text-sm"
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full p-4 rounded-lg border text-left transition-all ${
                          selectedPayment === method.id
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
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep('confirm')}
                    className="w-full bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all"
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
                    <h2 className="text-xl font-bold text-white">Confirm Purchase</h2>
                    <button
                      onClick={() => setStep('payment')}
                      className="text-binomena-primary hover:text-green-400 text-sm"
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Amount:</span>
                          <div className="text-white font-medium">
                            {selectedCurrencyData?.symbol}{amount} {selectedCurrency}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-400">You'll receive:</span>
                          <div className="text-binomena-primary font-medium">{biusdAmount} BiUSD</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Payment method:</span>
                          <div className="text-white font-medium">{selectedPaymentData?.name}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">Processing time:</span>
                          <div className="text-white font-medium">{selectedPaymentData?.processingTime}</div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal:</span>
                          <span className="text-white">{selectedCurrencyData?.symbol}{amount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fee ({selectedPaymentData?.fee}%):</span>
                          <span className="text-white">{selectedCurrencyData?.symbol}{calculateFee().toFixed(2)}</span>
                        </div>
                        <div className="border-t border-white/20 pt-2 flex justify-between font-medium">
                          <span className="text-white">Total:</span>
                          <span className="text-white">{selectedCurrencyData?.symbol}{calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePurchase}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-binomena-primary to-binomena-secondary hover:from-green-600 hover:to-purple-600 text-white font-medium py-3 px-6 rounded-lg transition-all disabled:opacity-50"
                  >
                    {isLoading ? 'Processing...' : 'Complete Purchase'}
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
                      <Zap className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Processing Your Purchase</h3>
                  <p className="text-gray-400">Please wait while we process your payment...</p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-bold text-white mb-4">Purchase Summary</h3>
              
              {wallet && (
                <div className="mb-6 p-4 bg-white/5 rounded-lg">
                  <div className="text-sm text-gray-400 mb-1">Destination wallet:</div>
                  <div className="text-xs text-white font-mono">
                    {wallet.address.slice(0, 6)}...{wallet.address.slice(-6)}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Shield className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Secure Transaction</div>
                    <div className="text-xs text-gray-400">Bank-grade encryption</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-sm font-medium text-white">Fast Processing</div>
                    <div className="text-xs text-gray-400">Instant to 3 business days</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-binomena-primary" />
                  <div>
                    <div className="text-sm font-medium text-white">Best Rates</div>
                    <div className="text-xs text-gray-400">Competitive exchange rates</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-300">
                    <p className="font-medium mb-1">Important Notice</p>
                    <p>BiUSD purchases are final. Please review your order carefully before confirming.</p>
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