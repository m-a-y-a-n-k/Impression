import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  PAYMENT_CONFIG, 
  PAYMENT_METHODS, 
  UPI_APPS, 
  CARD_TYPES,
  SUPPORTED_BANKS 
} from '../config/paymentConfig';
import mockPaymentService from '../utils/mockPaymentService';
import razorpayService from '../utils/razorpayIntegration';
import '../styles/Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { upgradeToPremium, plans } = useSubscription();
  const { currentUser } = useAuth();
  
  // Get plan from navigation state
  const selectedPlanId = location.state?.planId || 'premium';
  const selectedPlan = plans[selectedPlanId];
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CARD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Card payment state
  const [cardType, setCardType] = useState(CARD_TYPES.DEBIT);
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI payment state
  const [upiApp, setUpiApp] = useState(UPI_APPS.GOOGLE_PAY);
  const [upiId, setUpiId] = useState('');

  // Net Banking state
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    // Redirect if no plan selected
    if (!selectedPlan) {
      navigate('/');
    }
  }, [selectedPlan, navigate]);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g);
    return formatted ? formatted.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value) && value.length <= 16) {
      setCardNumber(value);
    }
  };

  const handleCvvChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setCvv(value);
    }
  };

  const validateCardPayment = () => {
    if (!cardNumber || cardNumber.length < 13) {
      throw new Error('Please enter a valid card number');
    }
    if (!cardholderName || cardholderName.trim().length < 3) {
      throw new Error('Please enter cardholder name');
    }
    if (!expiryMonth || !expiryYear) {
      throw new Error('Please enter card expiry date');
    }
    if (!cvv || cvv.length < 3) {
      throw new Error('Please enter valid CVV');
    }
    
    // Validate expiry date
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const expYear = parseInt(expiryYear);
    const expMonth = parseInt(expiryMonth);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      throw new Error('Card has expired');
    }
  };

  const validateUPIPayment = () => {
    if (!upiId) {
      throw new Error('Please enter UPI ID');
    }
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!upiRegex.test(upiId)) {
      throw new Error('Please enter a valid UPI ID');
    }
  };

  const validateNetBankingPayment = () => {
    if (!selectedBank) {
      throw new Error('Please select a bank');
    }
    if (!accountNumber || accountNumber.length < 8) {
      throw new Error('Please enter a valid account number');
    }
  };

  const processPayment = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      let paymentResult;
      const amount = selectedPlan.price;
      const planId = selectedPlan.id;

      if (PAYMENT_CONFIG.isBetaTesting) {
        // Mock payment for beta testing
        switch (paymentMethod) {
          case PAYMENT_METHODS.CARD:
            validateCardPayment();
            paymentResult = await mockPaymentService.processMockCardPayment(
              { cardNumber, cardholderName, expiryMonth, expiryYear, cvv, cardType },
              amount,
              planId
            );
            break;

          case PAYMENT_METHODS.UPI:
            validateUPIPayment();
            paymentResult = await mockPaymentService.processMockUPIPayment(
              { upiId, upiApp },
              amount,
              planId
            );
            break;

          case PAYMENT_METHODS.NETBANKING:
            validateNetBankingPayment();
            paymentResult = await mockPaymentService.processMockNetBankingPayment(
              { bankId: selectedBank, accountNumber },
              amount,
              planId
            );
            break;

          case PAYMENT_METHODS.PAYPAL:
            paymentResult = await mockPaymentService.processMockPayPalPayment(amount, planId);
            break;

          case PAYMENT_METHODS.STRIPE:
            paymentResult = await mockPaymentService.processMockStripePayment(amount, planId);
            break;

          default:
            throw new Error('Invalid payment method');
        }
      } else {
        // Production payment processing with Razorpay
        console.log('Production mode: Using Razorpay payment gateway');
        
        const userEmail = currentUser?.email || '';
        const userName = currentUser?.displayName || 'User';
        
        // Handle payment success
        const handlePaymentSuccess = (paymentData) => {
          paymentResult = paymentData;
          
          // Update subscription
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          upgradeToPremium(planId, paymentData.transactionId, expiresAt);
          
          setSuccess(true);
          setIsProcessing(false);
          
          // Redirect to success page after a delay
          setTimeout(() => {
            navigate('/', { 
              state: { 
                paymentSuccess: true, 
                transactionId: paymentData.transactionId 
              } 
            });
          }, 3000);
        };
        
        // Handle payment failure
        const handlePaymentFailure = (error) => {
          console.error('Payment failed:', error);
          setError(error.message || 'Payment failed. Please try again.');
          setIsProcessing(false);
        };
        
        // Process payment based on payment method
        switch (paymentMethod) {
          case PAYMENT_METHODS.CARD:
            // Razorpay handles card validation in their checkout UI
            paymentResult = await razorpayService.processCardPayment({
              amount,
              planId,
              userEmail,
              userName,
              onSuccess: handlePaymentSuccess,
              onFailure: handlePaymentFailure
            });
            break;

          case PAYMENT_METHODS.UPI:
            // Razorpay handles UPI in their checkout UI
            paymentResult = await razorpayService.processUPIPayment({
              amount,
              planId,
              upiId,
              userEmail,
              userName,
              onSuccess: handlePaymentSuccess,
              onFailure: handlePaymentFailure
            });
            break;

          case PAYMENT_METHODS.NETBANKING:
            // Razorpay handles net banking in their checkout UI
            paymentResult = await razorpayService.processNetBankingPayment({
              amount,
              planId,
              bankId: selectedBank,
              userEmail,
              userName,
              onSuccess: handlePaymentSuccess,
              onFailure: handlePaymentFailure
            });
            break;

          case PAYMENT_METHODS.STRIPE:
          case PAYMENT_METHODS.PAYPAL:
            // For international payments, fall back to Razorpay
            // You can enable Stripe/PayPal separately if needed
            paymentResult = await razorpayService.processRazorpayPayment({
              amount,
              planId,
              userEmail,
              userName,
              onSuccess: handlePaymentSuccess,
              onFailure: handlePaymentFailure
            });
            break;

          default:
            throw new Error('Invalid payment method');
        }
        
        // Return early since handlers will manage the flow
        return;
      }

      // Payment successful
      if (paymentResult.success) {
        // Update subscription
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        upgradeToPremium(planId, paymentResult.transactionId, expiresAt);
        
        setSuccess(true);
        
        // Redirect to success page after a delay
        setTimeout(() => {
          navigate('/', { 
            state: { 
              paymentSuccess: true, 
              transactionId: paymentResult.transactionId 
            } 
          });
        }, 3000);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processPayment();
  };

  if (!selectedPlan) {
    return null;
  }

  if (success) {
    return (
      <div className="checkout-container">
        <motion.div 
          className="checkout-success"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
        >
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Welcome to {selectedPlan.name} plan</p>
          <p className="redirect-message">Redirecting you to the app...</p>
          {PAYMENT_CONFIG.isBetaTesting && (
            <p className="mock-badge">Mock Payment Mode</p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <motion.div 
        className="checkout-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="checkout-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h1>Complete Your Purchase</h1>
          {PAYMENT_CONFIG.isBetaTesting && (
            <div className="beta-testing-badge">
              🧪 Beta Testing Mode - Mock Payments
            </div>
          )}
        </div>

        <div className="checkout-content">
          {/* Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="plan-details">
              <div className="plan-header">
                <h3>{selectedPlan.name}</h3>
                <span className="plan-badge">{selectedPlan.id === 'premium' ? '🔥 Popular' : '⭐ Pro'}</span>
              </div>
              <div className="plan-price">
                <span className="price-label">Monthly Subscription</span>
                <span className="price-amount">${selectedPlan.price}</span>
              </div>
              <ul className="plan-features-list">
                {selectedPlan.features.slice(0, 5).map((feature, idx) => (
                  <li key={idx}>
                    <span className="check-icon">✓</span> {feature}
                  </li>
                ))}
              </ul>
              <div className="total-section">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>${selectedPlan.price}</span>
                </div>
                <div className="total-row">
                  <span>Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="total-row total">
                  <span>Total</span>
                  <span>${selectedPlan.price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-section">
            <h2>Payment Method</h2>
            
            {/* Payment Method Selector */}
            <div className="payment-methods">
              <button
                className={`payment-method-btn ${paymentMethod === PAYMENT_METHODS.CARD ? 'active' : ''}`}
                onClick={() => setPaymentMethod(PAYMENT_METHODS.CARD)}
              >
                <span className="payment-icon">💳</span>
                <span>Card</span>
              </button>
              <button
                className={`payment-method-btn ${paymentMethod === PAYMENT_METHODS.UPI ? 'active' : ''}`}
                onClick={() => setPaymentMethod(PAYMENT_METHODS.UPI)}
              >
                <span className="payment-icon">📱</span>
                <span>UPI</span>
              </button>
              <button
                className={`payment-method-btn ${paymentMethod === PAYMENT_METHODS.NETBANKING ? 'active' : ''}`}
                onClick={() => setPaymentMethod(PAYMENT_METHODS.NETBANKING)}
              >
                <span className="payment-icon">🏦</span>
                <span>Net Banking</span>
              </button>
              {!PAYMENT_CONFIG.isBetaTesting && (
                <>
                  <button
                    className={`payment-method-btn ${paymentMethod === PAYMENT_METHODS.PAYPAL ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(PAYMENT_METHODS.PAYPAL)}
                  >
                    <span className="payment-icon">💰</span>
                    <span>PayPal</span>
                  </button>
                  <button
                    className={`payment-method-btn ${paymentMethod === PAYMENT_METHODS.STRIPE ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(PAYMENT_METHODS.STRIPE)}
                  >
                    <span className="payment-icon">⚡</span>
                    <span>Stripe</span>
                  </button>
                </>
              )}
            </div>

            {/* Payment Forms */}
            <form onSubmit={handleSubmit} className="payment-form">
              <AnimatePresence mode="wait">
                {/* Card Payment Form */}
                {paymentMethod === PAYMENT_METHODS.CARD && (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="payment-form-content"
                  >
                    <div className="card-type-selector">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="cardType"
                          value={CARD_TYPES.DEBIT}
                          checked={cardType === CARD_TYPES.DEBIT}
                          onChange={(e) => setCardType(e.target.value)}
                        />
                        <span>Debit Card</span>
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name="cardType"
                          value={CARD_TYPES.CREDIT}
                          checked={cardType === CARD_TYPES.CREDIT}
                          onChange={(e) => setCardType(e.target.value)}
                        />
                        <span>Credit Card</span>
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        value={formatCardNumber(cardNumber)}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Cardholder Name</label>
                      <input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Month</label>
                        <select
                          value={expiryMonth}
                          onChange={(e) => setExpiryMonth(e.target.value)}
                          required
                        >
                          <option value="">MM</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <option key={month} value={month.toString().padStart(2, '0')}>
                              {month.toString().padStart(2, '0')}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Expiry Year</label>
                        <select
                          value={expiryYear}
                          onChange={(e) => setExpiryYear(e.target.value)}
                          required
                        >
                          <option value="">YYYY</option>
                          {Array.from({ length: 15 }, (_, i) => new Date().getFullYear() + i).map(year => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>CVV</label>
                        <input
                          type="text"
                          value={cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          maxLength="4"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* UPI Payment Form */}
                {paymentMethod === PAYMENT_METHODS.UPI && (
                  <motion.div
                    key="upi"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="payment-form-content"
                  >
                    <div className="upi-apps">
                      <label className="upi-app-label">
                        <input
                          type="radio"
                          name="upiApp"
                          value={UPI_APPS.GOOGLE_PAY}
                          checked={upiApp === UPI_APPS.GOOGLE_PAY}
                          onChange={(e) => setUpiApp(e.target.value)}
                        />
                        <span className="upi-app-option">
                          <span className="upi-icon">G</span>
                          Google Pay
                        </span>
                      </label>
                      <label className="upi-app-label">
                        <input
                          type="radio"
                          name="upiApp"
                          value={UPI_APPS.PHONE_PE}
                          checked={upiApp === UPI_APPS.PHONE_PE}
                          onChange={(e) => setUpiApp(e.target.value)}
                        />
                        <span className="upi-app-option">
                          <span className="upi-icon">P</span>
                          PhonePe
                        </span>
                      </label>
                      <label className="upi-app-label">
                        <input
                          type="radio"
                          name="upiApp"
                          value={UPI_APPS.PAYTM}
                          checked={upiApp === UPI_APPS.PAYTM}
                          onChange={(e) => setUpiApp(e.target.value)}
                        />
                        <span className="upi-app-option">
                          <span className="upi-icon">₹</span>
                          Paytm
                        </span>
                      </label>
                    </div>

                    <div className="form-group">
                      <label>UPI ID</label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        required
                      />
                      <small className="form-hint">Enter your UPI ID (e.g., 9876543210@paytm)</small>
                    </div>
                  </motion.div>
                )}

                {/* Net Banking Form */}
                {paymentMethod === PAYMENT_METHODS.NETBANKING && (
                  <motion.div
                    key="netbanking"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="payment-form-content"
                  >
                    <div className="form-group">
                      <label>Select Your Bank</label>
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        required
                      >
                        <option value="">Choose a bank</option>
                        {SUPPORTED_BANKS.map(bank => (
                          <option key={bank.id} value={bank.id}>
                            {bank.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="Enter your account number"
                        required
                      />
                    </div>
                  </motion.div>
                )}

                {/* PayPal Payment */}
                {paymentMethod === PAYMENT_METHODS.PAYPAL && (
                  <motion.div
                    key="paypal"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="payment-form-content"
                  >
                    <div className="external-payment-info">
                      <p>You will be redirected to PayPal to complete your payment securely.</p>
                    </div>
                  </motion.div>
                )}

                {/* Stripe Payment */}
                {paymentMethod === PAYMENT_METHODS.STRIPE && (
                  <motion.div
                    key="stripe"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="payment-form-content"
                  >
                    <div className="external-payment-info">
                      <p>You will be redirected to Stripe Checkout to complete your payment securely.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Message */}
              {error && (
                <motion.div
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ⚠️ {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-payment-btn"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner"></span>
                    Processing...
                  </>
                ) : (
                  <>Pay ${selectedPlan.price}</>
                )}
              </button>

              {/* Security Note */}
              <div className="security-note">
                <span className="lock-icon">🔒</span>
                <p>Your payment information is secure and encrypted</p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;

