import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/ThemePicker.css';

const ThemePicker = () => {
  const { currentTheme, theme, changeTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const togglePicker = () => {
    setIsOpen(!isOpen);
  };

  const handleThemeSelect = (themeId) => {
    changeTheme(themeId);
    setIsOpen(false);
  };

  return (
    <div className="theme-picker-container">
      <motion.button
        className="theme-toggle-btn"
        onClick={togglePicker}
        aria-label="Change theme"
        title={`Current theme: ${theme.name}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.span
          className="theme-icon"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {theme.icon}
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="theme-picker-overlay"
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.div
              className="theme-picker-panel"
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{ duration: 0.3, type: "spring" }}
            >
              <h3 className="theme-picker-title">Choose Your Theme</h3>
              <div className="theme-grid">
                {availableThemes.map((themeOption) => (
                  <motion.button
                    key={themeOption.id}
                    className={`theme-option ${currentTheme === themeOption.id ? 'active' : ''}`}
                    onClick={() => handleThemeSelect(themeOption.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: themeOption.colors.backgroundSecondary,
                    }}
                  >
                    <span className="theme-option-icon">{themeOption.icon}</span>
                    <span className="theme-option-name">{themeOption.name}</span>
                    {currentTheme === themeOption.id && (
                      <motion.div
                        className="theme-option-check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemePicker;

