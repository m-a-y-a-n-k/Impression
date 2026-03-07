/**
 * Stripe Payment Integration
 * 
 * Setup Instructions:
 * 1. Sign up at https://stripe.com
 * 2. Get your publishable key from Stripe Dashboard
 * 3. Create products and prices in Stripe Dashboard
 * 4. Add your keys to environment variables
 * 5. Set up a backend webhook endpoint to handle subscription events
 */

import { PAYMENT_CONFIG } from '../config/paymentConfig';
import mockPaymentService from './mockPaymentService';

// In production, these should be environment variables
// Create a .env file with:
// REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
// REACT_APP_STRIPE_PREMIUM_PRICE_ID=price_...
// REACT_APP_STRIPE_PRO_PRICE_ID=price_...
// REACT_APP_ENABLE_BETA_TESTING=false

const STRIPE_CONFIG = {
  // Use test key for development
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_KEY_HERE',
  
  // Price IDs from Stripe Dashboard
  prices: {
    premium: process.env.REACT_APP_STRIPE_PREMIUM_PRICE_ID || 'price_premium_monthly',
    pro: process.env.REACT_APP_STRIPE_PRO_PRICE_ID || 'price_pro_monthly'
  },
  
  // Your backend API endpoint for creating checkout sessions
  apiEndpoint: process.env.REACT_APP_API_ENDPOINT || 'https://your-backend.com/api',
  
  // Check if beta testing is enabled
  isBetaTesting: PAYMENT_CONFIG.isBetaTesting
};

/**
 * Initialize Stripe checkout
 * This would typically redirect to Stripe Checkout
 * Uses mock payment service in beta testing mode
 */
export const initiateCheckout = async (planId, userEmail = null, amount = 0) => {
  try {
    // Check if beta testing is enabled
    if (STRIPE_CONFIG.isBetaTesting) {
      // Use mock payment service
      console.log('Beta testing mode: Using mock Stripe payment');
      return await mockPaymentService.processMockStripePayment(amount, planId);
    }

    // In production, this would call your backend API
    // Your backend creates a Stripe Checkout Session and returns the URL
    
    const response = await fetch(`${STRIPE_CONFIG.apiEndpoint}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId: STRIPE_CONFIG.prices[planId],
        customerEmail: userEmail,
        successUrl: `${window.location.origin}?checkout=success`,
        cancelUrl: `${window.location.origin}?checkout=cancel`,
      }),
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    if (session.url) {
      window.location.href = session.url;
    }

    return session;
  } catch (error) {
    console.error('Error initiating checkout:', error);
    throw new Error('Failed to start checkout process');
  }
};

/**
 * Load Stripe.js script
 */
export const loadStripe = () => {
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      resolve(window.Stripe(STRIPE_CONFIG.publishableKey));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    
    script.onload = () => {
      if (window.Stripe) {
        resolve(window.Stripe(STRIPE_CONFIG.publishableKey));
      } else {
        reject(new Error('Stripe failed to load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Stripe script'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Verify subscription status
 * Call your backend to verify the subscription
 * Uses mock verification in beta testing mode
 */
export const verifySubscription = async (customerId) => {
  try {
    // Check if beta testing is enabled
    if (STRIPE_CONFIG.isBetaTesting) {
      return await mockPaymentService.verifyMockPayment(customerId);
    }

    const response = await fetch(`${STRIPE_CONFIG.apiEndpoint}/verify-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying subscription:', error);
    return { active: false };
  }
};

/**
 * Create customer portal session for subscription management
 */
export const createPortalSession = async (customerId) => {
  try {
    const response = await fetch(`${STRIPE_CONFIG.apiEndpoint}/create-portal-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl: window.location.origin,
      }),
    });

    const session = await response.json();

    if (session.url) {
      window.location.href = session.url;
    }

    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw new Error('Failed to open subscription management');
  }
};

/**
 * Sample Backend Implementation (Node.js/Express)
 * 
 * You'll need to create these endpoints on your backend:
 * 
 * ```javascript
 * const express = require('express');
 * const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
 * const app = express();
 * 
 * // Create checkout session
 * app.post('/api/create-checkout-session', async (req, res) => {
 *   const { priceId, customerEmail, successUrl, cancelUrl } = req.body;
 *   
 *   try {
 *     const session = await stripe.checkout.sessions.create({
 *       mode: 'subscription',
 *       payment_method_types: ['card'],
 *       line_items: [{
 *         price: priceId,
 *         quantity: 1,
 *       }],
 *       customer_email: customerEmail,
 *       success_url: successUrl,
 *       cancel_url: cancelUrl,
 *     });
 *     
 *     res.json({ url: session.url });
 *   } catch (error) {
 *     res.status(500).json({ error: error.message });
 *   }
 * });
 * 
 * // Webhook to handle subscription events
 * app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
 *   const sig = req.headers['stripe-signature'];
 *   const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
 *   
 *   try {
 *     const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
 *     
 *     switch (event.type) {
 *       case 'customer.subscription.created':
 *       case 'customer.subscription.updated':
 *         // Update user's subscription in your database
 *         break;
 *       case 'customer.subscription.deleted':
 *         // Handle subscription cancellation
 *         break;
 *     }
 *     
 *     res.json({received: true});
 *   } catch (error) {
 *     res.status(400).send(`Webhook Error: ${error.message}`);
 *   }
 * });
 * 
 * // Create portal session
 * app.post('/api/create-portal-session', async (req, res) => {
 *   const { customerId, returnUrl } = req.body;
 *   
 *   try {
 *     const session = await stripe.billingPortal.sessions.create({
 *       customer: customerId,
 *       return_url: returnUrl,
 *     });
 *     
 *     res.json({ url: session.url });
 *   } catch (error) {
 *     res.status(500).json({ error: error.message });
 *   }
 * });
 * ```
 */

const stripeService = {
  initiateCheckout,
  loadStripe,
  verifySubscription,
  createPortalSession,
  config: STRIPE_CONFIG
};

export default stripeService;

