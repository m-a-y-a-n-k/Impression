import { useState } from "react";
import { motion } from "framer-motion";
import { PRACTICE_SCENARIOS, getAllScenarioIds } from "../config/practiceScenarios";
import "../styles/ScenarioSelector.css";

const ScenarioSelector = ({ onSelectScenario, onClose }) => {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const handleSelect = (scenarioId) => {
    setSelectedScenario(scenarioId);
  };

  const handleConfirm = () => {
    if (selectedScenario) {
      onSelectScenario(selectedScenario);
    }
  };

  const scenarios = getAllScenarioIds().map(id => PRACTICE_SCENARIOS[id]);

  return (
    <div className="scenario-selector-overlay">
      <motion.div
        className="scenario-selector-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <div className="scenario-selector-header">
          <h2>Choose a Practice Scenario</h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close scenario selector"
          >
            ✕
          </button>
        </div>

        <div className="scenarios-grid">
          {scenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              className={`scenario-card ${selectedScenario === scenario.id ? 'selected' : ''}`}
              onClick={() => handleSelect(scenario.id)}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="scenario-icon">{scenario.icon}</div>
              <h3 className="scenario-name">{scenario.name}</h3>
              <p className="scenario-description">{scenario.description}</p>
              <div className="scenario-duration">
                Max duration: {Math.floor(scenario.duration / 60)} min
              </div>
              {selectedScenario === scenario.id && (
                <motion.div
                  className="selected-indicator"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="scenario-selector-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={!selectedScenario}
          >
            Start Practice
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScenarioSelector;

