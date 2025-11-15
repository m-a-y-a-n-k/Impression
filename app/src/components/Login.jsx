import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../styles/Login.css';

/**
 * Login Component
 * Provides Google SSO authentication
 */

export default function Login({ onLoginSuccess }) {
  const { signInWithGoogle, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || t('login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="login-header">
          <h1 className="login-title">
            {t('login.welcome') || 'Welcome to Impression'}
          </h1>
          <p className="login-subtitle">
            {t('login.subtitle') || 'Sign in to access your practice sessions and track your progress'}
          </p>
        </div>

        <div className="login-body">
          <motion.button
            className="google-signin-btn"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>
              {isLoading ? (t('login.signing_in') || 'Signing in...') : (t('login.google') || 'Continue with Google')}
            </span>
          </motion.button>

          {(error || authError) && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error || authError}</span>
            </motion.div>
          )}
        </div>

        <div className="login-footer">
          <p className="login-terms">
            {t('login.terms_prefix') || 'By signing in, you agree to our'}{' '}
            <a href="#terms" className="login-link">
              {t('login.terms') || 'Terms of Service'}
            </a>{' '}
            {t('login.terms_and') || 'and'}{' '}
            <a href="#privacy" className="login-link">
              {t('login.privacy') || 'Privacy Policy'}
            </a>
          </p>
        </div>
      </motion.div>

      <div className="login-background">
        <div className="login-blob login-blob-1"></div>
        <div className="login-blob login-blob-2"></div>
        <div className="login-blob login-blob-3"></div>
      </div>
    </div>
  );
}

