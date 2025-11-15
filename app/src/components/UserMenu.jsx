import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Profile from './Profile';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../styles/UserMenu.css';

/**
 * UserMenu Component
 * Displays user avatar and provides access to profile
 */

export default function UserMenu() {
  const { currentUser, logout } = useAuth();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  if (!currentUser) {
    return null;
  }

  const handleLogout = async () => {
    try {
      setIsMenuOpen(false);
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const handleProfileClick = () => {
    setIsMenuOpen(false);
    setIsProfileOpen(true);
  };

  const menuVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: -10
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 20,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: {
        duration: 0.15
      }
    }
  };

  return (
    <>
      <div className="user-menu-container">
        <button
          className="user-menu-trigger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="User menu"
        >
          <img
            src={currentUser.photoURL || 'https://via.placeholder.com/40'}
            alt={currentUser.displayName || 'User'}
            className="user-avatar"
          />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <div
                className="user-menu-backdrop"
                onClick={() => setIsMenuOpen(false)}
              />
              <motion.div
                className="user-menu-dropdown"
                variants={menuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="user-menu-header">
                  <img
                    src={currentUser.photoURL || 'https://via.placeholder.com/48'}
                    alt={currentUser.displayName || 'User'}
                    className="user-menu-avatar"
                  />
                  <div className="user-menu-info">
                    <div className="user-menu-name">
                      {currentUser.displayName || 'Anonymous User'}
                    </div>
                    <div className="user-menu-email">
                      {currentUser.email}
                    </div>
                  </div>
                </div>

                <div className="user-menu-divider" />

                <button
                  className="user-menu-item"
                  onClick={handleProfileClick}
                >
                  <span className="user-menu-icon">👤</span>
                  <span>{t('user_menu.profile') || 'Profile'}</span>
                </button>

                <div className="user-menu-divider" />

                <button
                  className="user-menu-item user-menu-item-logout"
                  onClick={handleLogout}
                >
                  <span className="user-menu-icon">🚪</span>
                  <span>{t('user_menu.logout') || 'Log Out'}</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
}

