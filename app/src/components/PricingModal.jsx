import "../styles/PricingModal.css";
import { motion, AnimatePresence } from "framer-motion";
import { useSubscription } from "../contexts/SubscriptionContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const PricingModal = ({ isOpen, onClose, currentSessionCount }) => {
  const { plans, getCurrentPlan } = useSubscription();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = (planId) => {
    setIsProcessing(true);
    setSelectedPlan(planId);
    
    // Navigate to checkout page with selected plan
    navigate('/checkout', { state: { planId } });
    
    // Close the pricing modal
    onClose();
    
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  const currentPlan = getCurrentPlan();

  return (
    <AnimatePresence>
      <motion.div
        className="pricing-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="pricing-modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="pricing-modal-close" onClick={onClose}>
            ✕
          </button>

          <div className="pricing-header">
            <h2 className="pricing-title">Upgrade to Premium</h2>
            {currentSessionCount !== undefined && (
              <p className="pricing-subtitle">
                You've used {currentSessionCount} of 10 free sessions. 
                Unlock unlimited practice now! 🚀
              </p>
            )}
          </div>

          <div className="pricing-plans">
            {/* Free Plan (Current) */}
            <motion.div 
              className={`pricing-card ${currentPlan.id === 'free' ? 'current-plan' : ''}`}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {currentPlan.id === 'free' && (
                <div className="current-plan-badge">Current Plan</div>
              )}
              <div className="plan-header">
                <h3 className="plan-name">{plans.free.name}</h3>
                <div className="plan-price">
                  <span className="price-amount">$0</span>
                  <span className="price-interval">/forever</span>
                </div>
              </div>
              <ul className="plan-features">
                {plans.free.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="plan-button disabled" disabled>
                Current Plan
              </button>
            </motion.div>

            {/* Premium Plan */}
            <motion.div 
              className={`pricing-card recommended ${currentPlan.id === 'premium' ? 'current-plan' : ''}`}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="recommended-badge">Most Popular 🔥</div>
              {currentPlan.id === 'premium' && (
                <div className="current-plan-badge">Current Plan</div>
              )}
              <div className="plan-header">
                <h3 className="plan-name">{plans.premium.name}</h3>
                <div className="plan-price">
                  <span className="price-amount">${plans.premium.price}</span>
                  <span className="price-interval">/month</span>
                </div>
              </div>
              <ul className="plan-features">
                {plans.premium.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className="plan-button premium"
                onClick={() => handleSubscribe('premium')}
                disabled={isProcessing || currentPlan.id === 'premium'}
              >
                {isProcessing && selectedPlan === 'premium' ? (
                  <>
                    <span className="button-spinner"></span>
                    Processing...
                  </>
                ) : currentPlan.id === 'premium' ? (
                  'Current Plan'
                ) : (
                  'Upgrade to Premium'
                )}
              </button>
            </motion.div>

            {/* Pro Plan */}
            <motion.div 
              className={`pricing-card ${currentPlan.id === 'pro' ? 'current-plan' : ''}`}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              {currentPlan.id === 'pro' && (
                <div className="current-plan-badge">Current Plan</div>
              )}
              <div className="plan-header">
                <h3 className="plan-name">{plans.pro.name}</h3>
                <div className="plan-price">
                  <span className="price-amount">${plans.pro.price}</span>
                  <span className="price-interval">/month</span>
                </div>
              </div>
              <ul className="plan-features">
                {plans.pro.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
              <button 
                className="plan-button pro"
                onClick={() => handleSubscribe('pro')}
                disabled={isProcessing || currentPlan.id === 'pro'}
              >
                {isProcessing && selectedPlan === 'pro' ? (
                  <>
                    <span className="button-spinner"></span>
                    Processing...
                  </>
                ) : currentPlan.id === 'pro' ? (
                  'Current Plan'
                ) : (
                  'Upgrade to Pro'
                )}
              </button>
            </motion.div>
          </div>

          <div className="pricing-footer">
            <p className="pricing-note">
              💳 Secure payment powered by Stripe • Cancel anytime • 30-day money-back guarantee
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PricingModal;

