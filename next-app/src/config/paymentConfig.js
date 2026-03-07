/**
 * Payment Configuration
 * Handles environment-based payment settings
 * 
 * Environment Variables:
 * - REACT_APP_ENABLE_BETA_TESTING: If true, uses mock payments
 * - REACT_APP_STRIPE_PUBLISHABLE_KEY: Stripe publishable key for production
 * - REACT_APP_API_ENDPOINT: Backend API endpoint for payment processing
 */

export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  NETBANKING: 'netbanking',
  PAYPAL: 'paypal',
  STRIPE: 'stripe'
};

export const UPI_APPS = {
  GOOGLE_PAY: 'google_pay',
  PHONE_PE: 'phone_pe',
  PAYTM: 'paytm'
};

export const CARD_TYPES = {
  DEBIT: 'debit',
  CREDIT: 'credit'
};

// Check if we're in beta testing mode
export const isBetaTestingEnabled = () => {
  return process.env.REACT_APP_ENABLE_BETA_TESTING === 'true';
};

export const PAYMENT_CONFIG = {
  // Environment mode
  isBetaTesting: isBetaTestingEnabled(),
  
  // Razorpay Configuration (Primary payment gateway for Indian market)
  razorpay: {
    keyId: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
    enabled: !isBetaTestingEnabled(),
    currency: 'INR',
    supportedMethods: ['card', 'upi', 'netbanking', 'wallet']
  },
  
  // Stripe Configuration (Alternative for international payments)
  stripe: {
    publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE',
    enabled: false // Can be enabled for international payments
  },
  
  // PayPal Configuration
  paypal: {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || 'YOUR_PAYPAL_CLIENT_ID',
    enabled: false // Can be enabled if needed
  },
  
  // UPI Configuration
  upi: {
    merchantVPA: process.env.REACT_APP_UPI_MERCHANT_VPA || 'merchant@upi',
    merchantName: process.env.REACT_APP_UPI_MERCHANT_NAME || 'Impression',
    enabled: true // Available in both modes
  },
  
  // API Endpoint
  apiEndpoint: process.env.REACT_APP_API_ENDPOINT || 'https://your-backend.com/api',
  
  // Mock Payment Settings (for beta testing)
  mock: {
    enabled: isBetaTestingEnabled(),
    simulateDelay: true,
    delayMs: 2000,
    successRate: 1.0 // 100% success rate for testing
  }
};

export const SUPPORTED_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank' },
  { id: 'icici', name: 'ICICI Bank' },
  { id: 'sbi', name: 'State Bank of India' },
  { id: 'axis', name: 'Axis Bank' },
  { id: 'kotak', name: 'Kotak Mahindra Bank' },
  { id: 'pnb', name: 'Punjab National Bank' },
  { id: 'bob', name: 'Bank of Baroda' },
  { id: 'canara', name: 'Canara Bank' },
  { id: 'union', name: 'Union Bank of India' },
  { id: 'idbi', name: 'IDBI Bank' },
  { id: 'yes', name: 'Yes Bank' },
  { id: 'indusind', name: 'IndusInd Bank' }
];

export default PAYMENT_CONFIG;

