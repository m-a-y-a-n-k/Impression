import "../styles/TextInput.css";
import { useState } from "react";
import { Textarea } from "@fluentui/react-components";
import { motion } from "framer-motion";

const TextInput = ({ updateUserFeedback, onBack }) => {
  const [text, setText] = useState("");

  const handleHome = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleSubmit = () => {
    if (text.trim()) {
      updateUserFeedback(text);
      setText(""); // Clear after submission
    }
  };

  const handleKeyPress = (e) => {
    // Submit on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="text-input-container">
      {onBack && (
        <button
          className="home-button"
          onClick={handleHome}
          aria-label="Go to home"
          title="Go to home"
        >
          <span className="home-icon">🏠</span>
          <span className="home-text">Home</span>
        </button>
      )}
      
      <div className="text-input-content">
        <div className="text-input-header">
          <span className="text-input-icon">✍️</span>
          <h2 className="text-input-title">Type Your Speech</h2>
          <p className="text-input-subtitle">
            Practice your presentation by typing it out. Get instant feedback on sentiment, clarity, and structure.
          </p>
        </div>

        <div className="textarea-wrapper">
          <Textarea
            value={text}
            onChange={(event) => {
              setText(event.target.value);
            }}
            onKeyDown={handleKeyPress}
            placeholder="Type your speech or presentation here... 
            
Tip: Use complete sentences and natural language. The more detailed your text, the better the feedback!

Press Ctrl+Enter (⌘+Enter on Mac) to submit."
            size="large"
            resize="vertical"
            className="custom-text-textarea"
            rows={12}
          />
          <div className="textarea-footer">
            <span className="char-count">{text.length} characters</span>
            <span className="word-count">
              {text.trim() ? text.trim().split(/\s+/).length : 0} words
            </span>
          </div>
        </div>

        <div className="quick-tips">
          <h4 className="tips-title">💡 Quick Tips:</h4>
          <ul className="tips-list">
            <li>Write in complete sentences</li>
            <li>Use natural, conversational language</li>
            <li>Include transitions between ideas</li>
            <li>Aim for clarity and conciseness</li>
          </ul>
        </div>
      </div>

      <motion.button
        className="text-submit-btn"
        onClick={handleSubmit}
        disabled={!text.trim()}
        whileHover={text.trim() ? { scale: 1.02 } : {}}
        whileTap={text.trim() ? { scale: 0.98 } : {}}
      >
        <span className="submit-icon">📤</span>
        <span className="submit-text">Analyze My Text</span>
      </motion.button>
    </div>
  );
};

export default TextInput;

