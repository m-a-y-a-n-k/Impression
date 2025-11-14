import "../styles/UpgradePrompt.css";
import { motion, AnimatePresence } from "framer-motion";

/**
 * UpgradePrompt Component
 * Nudges users to upgrade when they're running low on free sessions
 */
const UpgradePrompt = ({ remainingSessions, onUpgrade, onDismiss, show = true }) => {
  if (!show) return null;

  const getMessage = () => {
    if (remainingSessions === 0) {
      return {
        title: "🎯 You've reached your limit!",
        message: "Upgrade to Premium for unlimited practice sessions",
        urgency: "high"
      };
    } else if (remainingSessions <= 2) {
      return {
        title: "⚠️ Only " + remainingSessions + " sessions left!",
        message: "Don't let your progress stop. Upgrade now for unlimited access.",
        urgency: "high"
      };
    } else if (remainingSessions <= 3) {
      return {
        title: "🚀 Running low on sessions",
        message: "You have " + remainingSessions + " sessions remaining. Upgrade for unlimited practice!",
        urgency: "medium"
      };
    }
    
    return {
      title: "💡 Unlock unlimited practice",
      message: remainingSessions + " free sessions left. Upgrade for premium features!",
      urgency: "low"
    };
  };

  const { title, message, urgency } = getMessage();

  return (
    <AnimatePresence>
      <motion.div
        className={`upgrade-prompt upgrade-prompt-${urgency}`}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <div className="upgrade-prompt-content">
          <div className="upgrade-prompt-header">
            <h3 className="upgrade-prompt-title">{title}</h3>
            <button 
              className="upgrade-prompt-dismiss"
              onClick={onDismiss}
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
          <p className="upgrade-prompt-message">{message}</p>
          <div className="upgrade-prompt-actions">
            <motion.button
              className="upgrade-prompt-button primary"
              onClick={onUpgrade}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ⚡ Upgrade to Premium
            </motion.button>
            {urgency !== "high" && (
              <button
                className="upgrade-prompt-button secondary"
                onClick={onDismiss}
              >
                Maybe Later
              </button>
            )}
          </div>
        </div>

        {/* Progress bar showing sessions used */}
        <div className="upgrade-prompt-progress">
          <div 
            className="upgrade-prompt-progress-bar"
            style={{ 
              width: `${Math.max(0, ((10 - remainingSessions) / 10) * 100)}%`,
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UpgradePrompt;

