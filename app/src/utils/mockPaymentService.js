/**
 * Mock Payment Service
 * Used for beta testing and development environments
 * Simulates payment processing without actual transactions
 */

import { PAYMENT_CONFIG } from '../config/paymentConfig';

/**
 * Simulate payment processing delay
 */
const simulateDelay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate a mock transaction ID
 */
const generateTransactionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `MOCK_TXN_${timestamp}_${random}`;
};

/**
 * Mock Card Payment
 */
export const processMockCardPayment = async (cardDetails, amount, planId) => {
  if (!PAYMENT_CONFIG.mock.enabled) {
    throw new Error('Mock payments are not enabled');
  }

  // Simulate API delay
  if (PAYMENT_CONFIG.mock.simulateDelay) {
    await simulateDelay(PAYMENT_CONFIG.mock.delayMs);
  }

  // Validate card details
  const { cardNumber, cardholderName, expiryMonth, expiryYear, cvv, cardType } = cardDetails;
  
  if (!cardNumber || !cardholderName || !expiryMonth || !expiryYear || !cvv || !cardType) {
    throw new Error('Invalid card details');
  }

  // Check for test failure scenario (card number ending in 0000)
  if (cardNumber.endsWith('0000')) {
    throw new Error('Payment declined by bank. Please try a different card.');
  }

  // Simulate random failure based on success rate
  if (Math.random() > PAYMENT_CONFIG.mock.successRate) {
    throw new Error('Payment failed. Please try again.');
  }

  // Return mock success response
  return {
    success: true,
    transactionId: generateTransactionId(),
    amount: amount,
    currency: 'USD',
    planId: planId,
    paymentMethod: `${cardType}_card`,
    timestamp: new Date().toISOString(),
    status: 'completed',
    message: 'Payment successful (Mock Mode)',
    isMock: true
  };
};

/**
 * Mock UPI Payment
 */
export const processMockUPIPayment = async (upiDetails, amount, planId) => {
  if (!PAYMENT_CONFIG.mock.enabled) {
    throw new Error('Mock payments are not enabled');
  }

  // Simulate API delay
  if (PAYMENT_CONFIG.mock.simulateDelay) {
    await simulateDelay(PAYMENT_CONFIG.mock.delayMs);
  }

  const { upiId, upiApp } = upiDetails;

  if (!upiId || !upiApp) {
    throw new Error('Invalid UPI details');
  }

  // Validate UPI ID format
  const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
  if (!upiRegex.test(upiId)) {
    throw new Error('Invalid UPI ID format');
  }

  return {
    success: true,
    transactionId: generateTransactionId(),
    amount: amount,
    currency: 'USD',
    planId: planId,
    paymentMethod: 'upi',
    upiApp: upiApp,
    timestamp: new Date().toISOString(),
    status: 'completed',
    message: 'Payment successful via UPI (Mock Mode)',
    isMock: true
  };
};

/**
 * Mock Net Banking Payment
 */
export const processMockNetBankingPayment = async (bankingDetails, amount, planId) => {
  if (!PAYMENT_CONFIG.mock.enabled) {
    throw new Error('Mock payments are not enabled');
  }

  // Simulate API delay
  if (PAYMENT_CONFIG.mock.simulateDelay) {
    await simulateDelay(PAYMENT_CONFIG.mock.delayMs);
  }

  const { bankId, accountNumber } = bankingDetails;

  if (!bankId || !accountNumber) {
    throw new Error('Invalid banking details');
  }

  return {
    success: true,
    transactionId: generateTransactionId(),
    amount: amount,
    currency: 'USD',
    planId: planId,
    paymentMethod: 'netbanking',
    bank: bankId,
    timestamp: new Date().toISOString(),
    status: 'completed',
    message: 'Payment successful via Net Banking (Mock Mode)',
    isMock: true
  };
};

/**
 * Mock PayPal Payment
 */
export const processMockPayPalPayment = async (amount, planId) => {
  if (!PAYMENT_CONFIG.mock.enabled) {
    throw new Error('Mock payments are not enabled');
  }

  // Simulate API delay
  if (PAYMENT_CONFIG.mock.simulateDelay) {
    await simulateDelay(PAYMENT_CONFIG.mock.delayMs);
  }

  return {
    success: true,
    transactionId: generateTransactionId(),
    amount: amount,
    currency: 'USD',
    planId: planId,
    paymentMethod: 'paypal',
    timestamp: new Date().toISOString(),
    status: 'completed',
    message: 'Payment successful via PayPal (Mock Mode)',
    isMock: true
  };
};

/**
 * Mock Stripe Payment
 */
export const processMockStripePayment = async (amount, planId) => {
  if (!PAYMENT_CONFIG.mock.enabled) {
    throw new Error('Mock payments are not enabled');
  }

  // Simulate API delay
  if (PAYMENT_CONFIG.mock.simulateDelay) {
    await simulateDelay(PAYMENT_CONFIG.mock.delayMs);
  }

  return {
    success: true,
    transactionId: generateTransactionId(),
    amount: amount,
    currency: 'USD',
    planId: planId,
    paymentMethod: 'stripe',
    timestamp: new Date().toISOString(),
    status: 'completed',
    message: 'Payment successful via Stripe (Mock Mode)',
    isMock: true
  };
};

/**
 * Verify mock payment status
 */
export const verifyMockPayment = async (transactionId) => {
  if (!PAYMENT_CONFIG.mock.enabled) {
    throw new Error('Mock payments are not enabled');
  }

  await simulateDelay(500);

  return {
    transactionId: transactionId,
    status: 'completed',
    verified: true,
    timestamp: new Date().toISOString(),
    isMock: true
  };
};

const mockPaymentService = {
  processMockCardPayment,
  processMockUPIPayment,
  processMockNetBankingPayment,
  processMockPayPalPayment,
  processMockStripePayment,
  verifyMockPayment,
  generateTransactionId
};

export default mockPaymentService;

