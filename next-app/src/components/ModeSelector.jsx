"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSubscription } from '@/contexts/SubscriptionContext';

const ModeSelector = ({ mode, onSelectMode, onStartSession, stopAudio, setShowPricingModal }) => {
  const { t } = useTranslation();
  const { isFree } = useSubscription();

  const handleModeClick = (selectedMode) => {
    if ((selectedMode === 'video' || selectedMode === 'qna') && isFree()) {
      setShowPricingModal(true);
      return;
    }

    if (!onStartSession()) return;
    
    onSelectMode(selectedMode);
    stopAudio();
  };

  const modes = [
    { id: 'text', icon: 'modes.text.icon', label: 'modes.text.label', desc: 'modes.text.description', premium: false },
    { id: 'audio', icon: 'modes.audio.icon', label: 'modes.audio.label', desc: 'modes.audio.description', premium: false },
    { id: 'video', icon: 'modes.video.icon', label: 'modes.video.label', desc: 'modes.video.description', premium: true },
    { id: 'qna', icon: 'modes.qna.icon', label: 'modes.qna.label', desc: 'modes.qna.description', premium: true },
  ];

  return (
    <motion.div
      className="mode-selector"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mode-selector-title">{t('modes.title')}</h2>
      <div className="mode-buttons">
        {modes.map((m) => (
          <motion.button
            key={m.id}
            className={`mode-btn ${mode === m.id ? "active" : ""} ${m.premium && isFree() ? 'premium-feature' : ''}`}
            onClick={() => handleModeClick(m.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {m.premium && isFree() && <span className="premium-badge">{t('premium.badge')}</span>}
            <span className="mode-icon">{t(m.icon)}</span>
            <span className="mode-label">{t(m.label)}</span>
            <span className="mode-description">{t(m.desc)}</span>
            {m.premium && isFree() && <span className="lock-icon">{t('premium.locked')}</span>}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ModeSelector;
