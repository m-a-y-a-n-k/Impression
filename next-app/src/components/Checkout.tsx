"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  PAYMENT_CONFIG, 
  PAYMENT_METHODS, 
  UPI_APPS, 
  CARD_TYPES,
  SUPPORTED_BANKS 
} from '@/config/paymentConfig';
import mockPaymentService from '@/utils/mockPaymentService';
import razorpayService from '@/utils/razorpayIntegration';
import '@/styles/Checkout.css';

const Checkout = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { upgradeToPremium, plans } = useSubscription();
  const { currentUser } = useAuth();
  
  const selectedPlanId = searchParams.get('planId') || 'premium';
  const selectedPlan = plans[selectedPlanId];
  
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.CARD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [cardType, setCardType] = useState(CARD_TYPES.DEBIT);
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');

  const [upiApp, setUpiApp] = useState(UPI_APPS.GOOGLE_PAY);
  const [upiId, setUpiId] = useState('');

  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  useEffect(() => {
    if (!selectedPlan) {
      router.push('/');
    }
  }, [selectedPlan, router]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g);
    return formatted ? formatted.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value) && value.length <= 16) {
      setCardNumber(value);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setCvv(value);
    }
  };

  const validateCardPayment = () => {
    if (!cardNumber || cardNumber.length < 13) throw new Error('Please enter a valid card number');
    if (!cardholderName || cardholderName.trim().length < 3) throw new Error('Please enter cardholder name');
    if (!expiryMonth || !expiryYear) throw new Error('Please enter card expiry date');
    if (!cvv || cvv.length < 3) throw new Error('Please enter valid CVV');
    
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const expYear = parseInt(expiryYear);
    const expMonth = parseInt(expiryMonth);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      throw new Error('Card has expired');
    }
  };

  const validateUPIPayment = () => {
    if (!upiId) throw new Error('Please enter UPI ID');
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/.test(upiId)) throw new Error('Please enter a valid UPI ID');
  };

  const validateNetBankingPayment = () => {
    if (!selectedBank) throw new Error('Please select a bank');
    if (!accountNumber || accountNumber.length < 8) throw new Error('Please enter a valid account number');
  };

  const processPayment = async () => {
    setError(null);
    setIsProcessing(true);

    try {
      let paymentResult: any;
      const amount = selectedPlan.price;
      const planId = selectedPlan.id;

      if (PAYMENT_CONFIG.isBetaTesting) {
        switch (paymentMethod) {
          case PAYMENT_METHODS.CARD:
            validateCardPayment();
            paymentResult = await mockPaymentService.processMockCardPayment(
              { cardNumber, cardholderName, expiryMonth, expiryYear, cvv, cardType }, amount, planId
            );
            break;
          case PAYMENT_METHODS.UPI:
            validateUPIPayment();
            paymentResult = await mockPaymentService.processMockUPIPayment({ upiId, upiApp }, amount, planId);
            break;
          case PAYMENT_METHODS.NETBANKING:
            validateNetBankingPayment();
            paymentResult = await mockPaymentService.processMockNetBankingPayment({ bankId: selectedBank, accountNumber }, amount, planId);
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
        const userEmail = currentUser?.email || '';
        const userName = currentUser?.displayName || 'User';
        
        const handlePaymentSuccess = (paymentData: any) => {
          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          upgradeToPremium(planId, paymentData.transactionId, expiresAt);
          setSuccess(true);
          setIsProcessing(false);
          setTimeout(() => router.push('/?paymentSuccess=true'), 3000);
        };
        
        const handlePaymentFailure = (error: any) => {
          setError(error.message || 'Payment failed. Please try again.');
          setIsProcessing(false);
        };
        
        switch (paymentMethod) {
          case PAYMENT_METHODS.CARD:
            await razorpayService.processCardPayment({ amount, planId, userEmail, userName, onSuccess: handlePaymentSuccess, onFailure: handlePaymentFailure });
            break;
          case PAYMENT_METHODS.UPI:
            await razorpayService.processUPIPayment({ amount, planId, upiId, userEmail, userName, onSuccess: handlePaymentSuccess, onFailure: handlePaymentFailure });
            break;
          case PAYMENT_METHODS.NETBANKING:
            await razorpayService.processNetBankingPayment({ amount, planId, bankId: selectedBank, userEmail, userName, onSuccess: handlePaymentSuccess, onFailure: handlePaymentFailure });
            break;
          default:
            await razorpayService.processRazorpayPayment({ amount, planId, userEmail, userName, onSuccess: handlePaymentSuccess, onFailure: handlePaymentFailure });
        }
        return;
      }

      if (paymentResult.success) {
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        upgradeToPremium(planId, paymentResult.transactionId, expiresAt);
        setSuccess(true);
        setTimeout(() => router.push('/?paymentSuccess=true'), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPlan) return null;

  if (success) {
    return (
      <div className="checkout-container">
        <motion.div className="checkout-success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Welcome to {selectedPlan.name} plan</p>
          <p className="redirect-message">Redirecting you to the app...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <motion.div className="checkout-wrapper" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="checkout-header">
          <button className="back-button" onClick={() => router.back()}>← Back</button>
          <h1>Complete Your Purchase</h1>
        </div>
        <div className="checkout-content">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="plan-details">
              <h3>{selectedPlan.name}</h3>
              <div className="plan-price">
                <span>Total</span>
                <span>${selectedPlan.price}</span>
              </div>
            </div>
          </div>
          <div className="payment-section">
            <form onSubmit={(e) => { e.preventDefault(); processPayment(); }}>
              <button type="submit" className="submit-payment-btn" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : `Pay $${selectedPlan.price}`}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Checkout;
