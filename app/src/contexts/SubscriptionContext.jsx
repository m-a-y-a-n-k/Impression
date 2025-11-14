import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Subscription Context
 * Manages user subscription status and premium features
 */

const SUBSCRIPTION_STORAGE_KEY = 'impression-subscription';

const SubscriptionContext = createContext();

export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: null,
    features: [
      '10 practice sessions',
      'Text & Audio modes',
      'Basic sentiment analysis',
      'Limited progress history (30 days)',
      'Basic feedback'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 12.99,
    interval: 'month',
    priceId: 'price_premium_monthly', // Stripe Price ID
    features: [
      'Unlimited practice sessions',
      'All modes (Text, Audio, Video, Q&A)',
      'Advanced NLP analysis',
      'Full progress tracking',
      'PDF export',
      'Priority support',
      'Advanced video analysis',
      'All question categories'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 24.99,
    interval: 'month',
    priceId: 'price_pro_monthly', // Stripe Price ID
    features: [
      'Everything in Premium',
      'Custom scenario creation',
      'Video library storage',
      'Detailed analytics & insights',
      'Team features (coming soon)',
      'Industry-specific scenarios',
      'Advanced comparison reports',
      'API access (coming soon)'
    ]
  }
};

export const SubscriptionProvider = ({ children }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(() => {
    try {
      const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {
        plan: 'free',
        active: false,
        expiresAt: null,
        customerId: null
      };
    } catch (err) {
      console.error('Error loading subscription:', err);
      return {
        plan: 'free',
        active: false,
        expiresAt: null,
        customerId: null
      };
    }
  });

  // Save subscription status to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscriptionStatus));
    } catch (err) {
      console.error('Error saving subscription:', err);
    }
  }, [subscriptionStatus]);

  const isPremium = () => {
    return subscriptionStatus.active && 
           (subscriptionStatus.plan === 'premium' || subscriptionStatus.plan === 'pro');
  };

  const isPro = () => {
    return subscriptionStatus.active && subscriptionStatus.plan === 'pro';
  };

  const isFree = () => {
    return !subscriptionStatus.active || subscriptionStatus.plan === 'free';
  };

  const upgradeToPremium = (planId, customerId, expiresAt) => {
    setSubscriptionStatus({
      plan: planId,
      active: true,
      expiresAt: expiresAt,
      customerId: customerId,
      activatedAt: new Date().toISOString()
    });
  };

  const cancelSubscription = () => {
    setSubscriptionStatus({
      plan: 'free',
      active: false,
      expiresAt: null,
      customerId: null,
      cancelledAt: new Date().toISOString()
    });
  };

  const getCurrentPlan = () => {
    return SUBSCRIPTION_PLANS[subscriptionStatus.plan] || SUBSCRIPTION_PLANS.free;
  };

  const hasFeatureAccess = (feature) => {
    // Premium and Pro have access to all features
    if (isPremium() || isPro()) return true;
    
    // Free tier restrictions
    const freeFeatures = ['text', 'audio', 'basic-analysis'];
    return freeFeatures.includes(feature);
  };

  const value = {
    subscriptionStatus,
    isPremium,
    isPro,
    isFree,
    upgradeToPremium,
    cancelSubscription,
    getCurrentPlan,
    hasFeatureAccess,
    plans: SUBSCRIPTION_PLANS
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
};

export default SubscriptionContext;

