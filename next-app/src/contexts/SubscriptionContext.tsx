"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SubscriptionStatus {
  plan: string;
  active: boolean;
  expiresAt: string | null;
  customerId: string | null;
  activatedAt?: string;
  cancelledAt?: string;
  isBetaTesting?: boolean;
}

interface SubscriptionContextType {
  subscriptionStatus: SubscriptionStatus;
  isPremium: () => boolean;
  isPro: () => boolean;
  isFree: () => boolean;
  upgradeToPremium: (planId: string, customerId: string, expiresAt: string) => void;
  cancelSubscription: () => void;
  getCurrentPlan: () => any;
  hasFeatureAccess: (feature: string) => boolean;
  plans: typeof SUBSCRIPTION_PLANS;
  enableBetaTesting: (planId?: string) => void;
  disableBetaTesting: () => void;
  toggleBetaPlan: (planId: string) => void;
  isBetaTesting: () => boolean;
}

const SUBSCRIPTION_STORAGE_KEY = 'impression-subscription';

export const SUBSCRIPTION_PLANS: any = {
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
    priceId: 'price_premium_monthly',
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
    priceId: 'price_pro_monthly',
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

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>(() => {
    if (typeof window === 'undefined') return { plan: 'free', active: false, expiresAt: null, customerId: null };
    try {
      const stored = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      return stored ? JSON.parse(stored) : { plan: 'free', active: false, expiresAt: null, customerId: null };
    } catch (err) {
      return { plan: 'free', active: false, expiresAt: null, customerId: null };
    }
  });

  useEffect(() => {
    localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscriptionStatus));
  }, [subscriptionStatus]);

  const isPremium = () => subscriptionStatus.active && (subscriptionStatus.plan === 'premium' || subscriptionStatus.plan === 'pro');
  const isPro = () => subscriptionStatus.active && subscriptionStatus.plan === 'pro';
  const isFree = () => !subscriptionStatus.active || subscriptionStatus.plan === 'free';

  const upgradeToPremium = (planId: string, customerId: string, expiresAt: string) => {
    setSubscriptionStatus({ plan: planId, active: true, expiresAt, customerId, activatedAt: new Date().toISOString() });
  };

  const cancelSubscription = () => {
    setSubscriptionStatus({ plan: 'free', active: false, expiresAt: null, customerId: null, cancelledAt: new Date().toISOString() });
  };

  const getCurrentPlan = () => SUBSCRIPTION_PLANS[subscriptionStatus.plan] || SUBSCRIPTION_PLANS.free;

  const hasFeatureAccess = (feature: string) => {
    if (isPremium() || isPro()) return true;
    const freeFeatures = ['text', 'audio', 'basic-analysis'];
    return freeFeatures.includes(feature);
  };

  const enableBetaTesting = (planId = 'premium') => {
    setSubscriptionStatus({
      plan: planId, active: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      customerId: 'beta-tester', isBetaTesting: true, activatedAt: new Date().toISOString()
    });
  };

  const disableBetaTesting = () => {
    setSubscriptionStatus({ plan: 'free', active: false, expiresAt: null, customerId: null, isBetaTesting: false, cancelledAt: new Date().toISOString() });
  };

  const toggleBetaPlan = (planId: string) => {
    if (subscriptionStatus.isBetaTesting && subscriptionStatus.plan === planId) disableBetaTesting();
    else enableBetaTesting(planId);
  };

  const isBetaTesting = () => subscriptionStatus.isBetaTesting === true;

  return (
    <SubscriptionContext.Provider value={{
      subscriptionStatus, isPremium, isPro, isFree, upgradeToPremium, cancelSubscription,
      getCurrentPlan, hasFeatureAccess, plans: SUBSCRIPTION_PLANS, enableBetaTesting,
      disableBetaTesting, toggleBetaPlan, isBetaTesting
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider');
  return context;
};

export default SubscriptionContext;
