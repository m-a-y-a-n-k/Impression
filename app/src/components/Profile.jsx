import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../styles/Profile.css';

/**
 * Profile Component
 * User profile management with subscription details
 */

export default function Profile({ isOpen, onClose }) {
  const { currentUser, userProfile, logout, updateUserProfile, updatePreferences } = useAuth();
  const { subscriptionStatus, getCurrentPlan, isPremium, isPro } = useSubscription();
  const { t, i18n } = useTranslation();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
    }
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (err) {
      console.error('Logout error:', err);
      setErrorMessage(t('profile.logout_error') || 'Failed to log out');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setSuccessMessage('');

      await updateUserProfile({
        displayName: displayName.trim()
      });

      setSuccessMessage(t('profile.update_success') || 'Profile updated successfully');
      setIsEditing(false);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Update error:', err);
      setErrorMessage(t('profile.update_error') || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = async (lang) => {
    try {
      await updatePreferences({ language: lang });
      i18n.changeLanguage(lang);
    } catch (err) {
      console.error('Language update error:', err);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const getPlanBadgeClass = () => {
    if (isPro()) return 'plan-badge-pro';
    if (isPremium()) return 'plan-badge-premium';
    return 'plan-badge-free';
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.2
      }
    }
  };

  if (!isOpen || !currentUser) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="profile-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="profile-modal"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="profile-header">
              <h2 className="profile-title">
                {t('profile.title') || 'Profile'}
              </h2>
              <button
                className="profile-close-btn"
                onClick={onClose}
                aria-label="Close profile"
              >
                ✕
              </button>
            </div>

            <div className="profile-content">
              {/* User Info Section */}
              <div className="profile-section">
                <div className="profile-avatar-container">
                  <img
                    src={currentUser.photoURL || 'https://via.placeholder.com/100'}
                    alt={currentUser.displayName || 'User'}
                    className="profile-avatar"
                  />
                  <span className={`plan-badge ${getPlanBadgeClass()}`}>
                    {getCurrentPlan().name}
                  </span>
                </div>

                <div className="profile-info">
                  {isEditing ? (
                    <div className="profile-edit-group">
                      <label htmlFor="displayName" className="profile-label">
                        {t('profile.display_name') || 'Display Name'}
                      </label>
                      <input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="profile-input"
                        placeholder="Enter your name"
                      />
                    </div>
                  ) : (
                    <h3 className="profile-name">
                      {currentUser.displayName || 'Anonymous User'}
                    </h3>
                  )}
                  <p className="profile-email">{currentUser.email}</p>
                </div>

                <div className="profile-actions">
                  {isEditing ? (
                    <>
                      <button
                        className="profile-btn profile-btn-primary"
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                      >
                        {isLoading ? (t('profile.saving') || 'Saving...') : (t('profile.save') || 'Save')}
                      </button>
                      <button
                        className="profile-btn profile-btn-secondary"
                        onClick={() => {
                          setIsEditing(false);
                          setDisplayName(currentUser.displayName || '');
                        }}
                        disabled={isLoading}
                      >
                        {t('profile.cancel') || 'Cancel'}
                      </button>
                    </>
                  ) : (
                    <button
                      className="profile-btn profile-btn-secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      {t('profile.edit') || 'Edit Profile'}
                    </button>
                  )}
                </div>

                {successMessage && (
                  <motion.div
                    className="profile-message profile-message-success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ✓ {successMessage}
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    className="profile-message profile-message-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    ⚠ {errorMessage}
                  </motion.div>
                )}
              </div>

              {/* Account Details */}
              <div className="profile-section">
                <h4 className="profile-section-title">
                  {t('profile.account_details') || 'Account Details'}
                </h4>
                <div className="profile-details">
                  <div className="profile-detail-item">
                    <span className="profile-detail-label">
                      {t('profile.member_since') || 'Member Since'}:
                    </span>
                    <span className="profile-detail-value">
                      {formatDate(userProfile?.createdAt)}
                    </span>
                  </div>
                  <div className="profile-detail-item">
                    <span className="profile-detail-label">
                      {t('profile.last_login') || 'Last Login'}:
                    </span>
                    <span className="profile-detail-value">
                      {formatDate(userProfile?.lastLoginAt)}
                    </span>
                  </div>
                  <div className="profile-detail-item">
                    <span className="profile-detail-label">
                      {t('profile.total_sessions') || 'Total Sessions'}:
                    </span>
                    <span className="profile-detail-value">
                      {userProfile?.stats?.totalSessions || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Subscription Status */}
              <div className="profile-section">
                <h4 className="profile-section-title">
                  {t('profile.subscription') || 'Subscription'}
                </h4>
                <div className="profile-subscription">
                  <div className="subscription-info">
                    <span className="subscription-plan">
                      {getCurrentPlan().name} Plan
                    </span>
                    {subscriptionStatus.active && (
                      <span className="subscription-status">
                        ● {t('profile.active') || 'Active'}
                      </span>
                    )}
                  </div>
                  <div className="subscription-features">
                    {getCurrentPlan().features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="feature-item">
                        ✓ {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="profile-section">
                <h4 className="profile-section-title">
                  {t('profile.preferences') || 'Preferences'}
                </h4>
                <div className="profile-preference-item">
                  <label className="profile-label">
                    {t('profile.language') || 'Language'}:
                  </label>
                  <select
                    value={userProfile?.preferences?.language || i18n.language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="profile-select"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="hi">हिन्दी</option>
                    <option value="zh">中文</option>
                    <option value="ja">日本語</option>
                    <option value="ar">العربية</option>
                    <option value="pt">Português</option>
                    <option value="ru">Русский</option>
                  </select>
                </div>
              </div>

              {/* Logout Button */}
              <div className="profile-section">
                <button
                  className="profile-btn profile-btn-logout"
                  onClick={handleLogout}
                >
                  {t('profile.logout') || 'Log Out'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

