/**
 * Razorpay Payment Integration
 * 
 * Setup Instructions:
 * 1. Sign up at https://razorpay.com
 * 2. Get your API Key from Razorpay Dashboard (Settings > API Keys)
 * 3. Add your key to environment variables
 * 4. For production, use live key (not test key)
 * 
 * Environment Variables Required:
 * - REACT_APP_RAZORPAY_KEY_ID: Your Razorpay Key ID (rzp_live_... for production)
 * - REACT_APP_RAZORPAY_KEY_SECRET: Keep this secure in backend only
 * - REACT_APP_ENABLE_BETA_TESTING: Set to 'false' for production
 */

import { PAYMENT_CONFIG } from '../config/paymentConfig';
import mockPaymentService from './mockPaymentService';

const RAZORPAY_CONFIG = {
  keyId: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
  keySecret: process.env.REACT_APP_RAZORPAY_KEY_SECRET, // This should only be used on backend
  currency: 'INR',
  name: 'Impression',
  description: 'Premium Subscription',
  image: '/impression.webp',
  theme: {
    color: '#3399cc'
  }
};

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpay = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        reject(new Error('Razorpay failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay script'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Create Razorpay order
 * In production, this should call your backend to create an order
 * For now, we'll use client-side integration
 */
const createOrder = async (amount, planId, currency = 'INR') => {
  // In production, call your backend API:
  // const response = await fetch(`${PAYMENT_CONFIG.apiEndpoint}/create-razorpay-order`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ amount, currency, planId })
  // });
  // return await response.json();

  // For client-side integration (less secure, but works without backend)
  // Note: In production, always create orders from backend
  return {
    id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount: amount * 100, // Razorpay expects amount in paise
    currency: currency,
    receipt: `receipt_${planId}_${Date.now()}`
  };
};

/**
 * Process payment using Razorpay
 */
export const processRazorpayPayment = async (options) => {
  const { 
    amount, 
    planId, 
    userEmail = '', 
    userName = 'User',
    onSuccess, 
    onFailure 
  } = options;

  try {
    // Check if beta testing is enabled
    if (PAYMENT_CONFIG.isBetaTesting) {
      console.log('Beta testing mode: Using mock payment');
      return await mockPaymentService.processMockCardPayment({}, amount, planId);
    }

    // Load Razorpay script
    await loadRazorpay();

    // Create order
    const order = await createOrder(amount, planId);

    // Configure Razorpay options
    const razorpayOptions = {
      key: RAZORPAY_CONFIG.keyId,
      amount: order.amount,
      currency: order.currency,
      name: RAZORPAY_CONFIG.name,
      description: `${planId.toUpperCase()} Plan Subscription`,
      image: RAZORPAY_CONFIG.image,
      order_id: order.id,
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: RAZORPAY_CONFIG.theme,
      handler: function (response) {
        // Payment successful
        const paymentData = {
          success: true,
          transactionId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          planId: planId,
          amount: amount,
          timestamp: new Date().toISOString()
        };

        // In production, verify signature on backend
        // await verifyPaymentSignature(paymentData);

        if (onSuccess) {
          onSuccess(paymentData);
        }
      },
      modal: {
        ondismiss: function() {
          const error = {
            success: false,
            error: 'Payment cancelled by user',
            code: 'PAYMENT_CANCELLED'
          };
          
          if (onFailure) {
            onFailure(error);
          }
        }
      }
    };

    // Open Razorpay checkout
    const razorpayInstance = new window.Razorpay(razorpayOptions);
    
    razorpayInstance.on('payment.failed', function (response) {
      const error = {
        success: false,
        error: response.error.description,
        code: response.error.code,
        reason: response.error.reason,
        step: response.error.step,
        source: response.error.source
      };
      
      if (onFailure) {
        onFailure(error);
      }
    });

    razorpayInstance.open();

    // Return a promise that will be resolved by the handlers
    return new Promise((resolve, reject) => {
      razorpayOptions.handler = function(response) {
        const paymentData = {
          success: true,
          transactionId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
          planId: planId,
          amount: amount,
          timestamp: new Date().toISOString()
        };
        
        if (onSuccess) onSuccess(paymentData);
        resolve(paymentData);
      };

      razorpayOptions.modal.ondismiss = function() {
        const error = new Error('Payment cancelled by user');
        if (onFailure) onFailure(error);
        reject(error);
      };

      razorpayInstance.on('payment.failed', function (response) {
        const error = new Error(response.error.description);
        if (onFailure) onFailure(error);
        reject(error);
      });
    });

  } catch (error) {
    console.error('Razorpay payment error:', error);
    throw error;
  }
};

/**
 * Verify payment signature (should be done on backend)
 * This ensures the payment response hasn't been tampered with
 */
export const verifyPaymentSignature = async (paymentData) => {
  // In production, call your backend:
  // const response = await fetch(`${PAYMENT_CONFIG.apiEndpoint}/verify-payment`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(paymentData)
  // });
  // return await response.json();

  // For now, just return true
  // WARNING: In production, ALWAYS verify on backend using crypto
  console.warn('Payment signature verification should be done on backend!');
  return { verified: true };
};

/**
 * Process UPI payment through Razorpay
 */
export const processUPIPayment = async (options) => {
  const { amount, planId, upiId, userEmail, userName } = options;

  try {
    if (PAYMENT_CONFIG.isBetaTesting) {
      return await mockPaymentService.processMockUPIPayment({ upiId }, amount, planId);
    }

    // Razorpay handles UPI automatically in their checkout
    // Just call the main payment method
    return await processRazorpayPayment({
      amount,
      planId,
      userEmail,
      userName,
      paymentMethod: 'upi'
    });
  } catch (error) {
    console.error('UPI payment error:', error);
    throw error;
  }
};

/**
 * Process Net Banking payment through Razorpay
 */
export const processNetBankingPayment = async (options) => {
  const { amount, planId, bankId, userEmail, userName } = options;

  try {
    if (PAYMENT_CONFIG.isBetaTesting) {
      return await mockPaymentService.processMockNetBankingPayment({ bankId }, amount, planId);
    }

    // Razorpay handles net banking automatically in their checkout
    return await processRazorpayPayment({
      amount,
      planId,
      userEmail,
      userName,
      paymentMethod: 'netbanking'
    });
  } catch (error) {
    console.error('Net banking payment error:', error);
    throw error;
  }
};

/**
 * Process Card payment through Razorpay
 */
export const processCardPayment = async (options) => {
  const { amount, planId, userEmail, userName } = options;

  try {
    if (PAYMENT_CONFIG.isBetaTesting) {
      return await mockPaymentService.processMockCardPayment({}, amount, planId);
    }

    // Razorpay handles card payments automatically in their checkout
    return await processRazorpayPayment({
      amount,
      planId,
      userEmail,
      userName,
      paymentMethod: 'card'
    });
  } catch (error) {
    console.error('Card payment error:', error);
    throw error;
  }
};

const razorpayService = {
  processRazorpayPayment,
  processUPIPayment,
  processNetBankingPayment,
  processCardPayment,
  loadRazorpay,
  verifyPaymentSignature,
  config: RAZORPAY_CONFIG
};

export default razorpayService;

