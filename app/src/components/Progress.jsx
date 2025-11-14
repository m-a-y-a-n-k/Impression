import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Progress.css";
import {
  getProgressStats,
  getProgressHistory,
  clearProgressHistory,
  exportProgressHistory,
  getFavoriteEntries,
  isFavorite,
  toggleFavorite
} from "../utils/progressStorage";
import { exportProgressToPDF } from "../utils/pdfExport";
import AnalyticsTab from "./AnalyticsTab";
import InsightsTab from "./InsightsTab";
import PricingModal from "./PricingModal";
import { useSubscription } from "../contexts/SubscriptionContext";
import { getSessionLimitInfo } from "../utils/sessionTracking";

const Progress = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'analytics', 'insights', 'history', or 'favorites'
  const [showPricingModal, setShowPricingModal] = useState(false);
  
  const { isPremium, isPro, isFree, getCurrentPlan } = useSubscription();
  const [sessionInfo, setSessionInfo] = useState(getSessionLimitInfo());

  useEffect(() => {
    if (isOpen) {
      setStats(getProgressStats());
      setHistory(getProgressHistory());
      setFavorites(getFavoriteEntries());
      setSessionInfo(getSessionLimitInfo());
    }
  }, [isOpen]);

  const handleClearHistory = () => {
    clearProgressHistory();
    setStats(getProgressStats());
    setHistory([]);
    setShowConfirmClear(false);
  };

  const handleExport = () => {
    const data = exportProgressHistory();
    if (data) {
      // Add UTF-8 BOM for proper Excel compatibility
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `impression-progress-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handlePDFExport = async () => {
    const success = await exportProgressToPDF();
    if (!success) {
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: '#38a169',
      negative: '#e53e3e',
      neutral: '#718096',
      mixed: '#d69e2e'
    };
    return colors[sentiment] || colors.neutral;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#38a169';
    if (score >= 60) return '#d69e2e';
    if (score >= 40) return '#ed8936';
    return '#e53e3e';
  };

  if (!stats) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="progress-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Progress Panel */}
          <motion.div
            className="progress-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="progress-header">
              <h2 className="progress-title">
                <span className="progress-icon">📊</span>
                Your Progress
              </h2>
              <button
                className="progress-close-btn"
                onClick={onClose}
                aria-label="Close progress"
              >
                ✕
              </button>
            </div>

            {/* Subscription Status Card */}
            <div className={`subscription-status-card ${isFree() ? 'free-tier' : 'premium-tier'}`}>
              <div className="subscription-info">
                <div className="subscription-plan-badge">
                  {isPro() && '👑'}
                  {isPremium() && !isPro() && '⚡'}
                  {isFree() && '📦'}
                  <span className="plan-name">{getCurrentPlan().name}</span>
                </div>
                {isFree() && (
                  <div className="subscription-details">
                    <div className="sessions-remaining">
                      <span className="sessions-text">
                        {sessionInfo.remaining} of {sessionInfo.total} free sessions left
                      </span>
                      <div className="sessions-progress-bar">
                        <div 
                          className="sessions-progress-fill"
                          style={{ width: `${sessionInfo.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {(isPremium() || isPro()) && (
                  <div className="subscription-details premium">
                    <span className="unlimited-badge">♾️ Unlimited Sessions</span>
                  </div>
                )}
              </div>
              {isFree() && (
                <button 
                  className="upgrade-btn-small"
                  onClick={() => setShowPricingModal(true)}
                >
                  ⚡ Upgrade
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="progress-tabs">
              <button
                className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                📊 Analytics
              </button>
              <button
                className={`tab-btn ${activeTab === 'insights' ? 'active' : ''}`}
                onClick={() => setActiveTab('insights')}
              >
                💡 Insights
              </button>
              <button
                className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
                onClick={() => setActiveTab('history')}
              >
                History ({history.length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab('favorites');
                  setFavorites(getFavoriteEntries());
                }}
              >
                ⭐ Favorites ({favorites.length})
              </button>
            </div>

            <div className="progress-content">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="overview-content"
                >
                  {/* Stats Grid */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">📝</div>
                      <div className="stat-value">{stats.totalEntries}</div>
                      <div className="stat-label">Total Entries</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">⭐</div>
                      <div className="stat-value" style={{ color: getScoreColor(stats.averageScore) }}>
                        {stats.averageScore}
                      </div>
                      <div className="stat-label">Average Score</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">🏆</div>
                      <div className="stat-value" style={{ color: '#38a169' }}>
                        {stats.highestScore}
                      </div>
                      <div className="stat-label">Best Score</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon">📈</div>
                      <div className="stat-value">
                        {stats.recentTrend === 'improving' && '📈'}
                        {stats.recentTrend === 'declining' && '📉'}
                        {stats.recentTrend === 'stable' && '➡️'}
                      </div>
                      <div className="stat-label">Trend</div>
                    </div>
                  </div>

                  {/* Sentiment Distribution */}
                  <div className="sentiment-section">
                    <h3 className="section-title">Sentiment Distribution</h3>
                    <div className="sentiment-bars">
                      {Object.entries(stats.sentimentDistribution).map(([sentiment, count]) => {
                        const percentage = stats.totalEntries > 0
                          ? Math.round((count / stats.totalEntries) * 100)
                          : 0;
                        return (
                          <div key={sentiment} className="sentiment-bar-item">
                            <div className="sentiment-bar-header">
                              <span className="sentiment-label" style={{ color: getSentimentColor(sentiment) }}>
                                {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
                              </span>
                              <span className="sentiment-count">{count} ({percentage}%)</span>
                            </div>
                            <div className="sentiment-bar-container">
                              <motion.div
                                className="sentiment-bar"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                style={{ backgroundColor: getSentimentColor(sentiment) }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Score History Chart */}
                  {stats.scoreHistory.length > 0 && (
                    <div className="score-chart-section">
                      <h3 className="section-title">Score Trend (Last 30 Entries)</h3>
                      <div className="score-chart">
                        {stats.scoreHistory.map((entry, index) => {
                          const height = entry.score > 0 ? (entry.score / 100) * 100 : 0;
                          return (
                            <div key={index} className="chart-bar-container">
                              <motion.div
                                className="chart-bar"
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ duration: 0.5, delay: index * 0.02 }}
                                style={{
                                  backgroundColor: getScoreColor(entry.score),
                                  opacity: entry.score > 0 ? 1 : 0.3
                                }}
                                title={`Score: ${entry.score} - ${formatShortDate(entry.timestamp)}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="progress-actions">
                    <button className="action-btn export-btn" onClick={handleExport}>
                      <span className="btn-icon">📥</span>
                      Export CSV
                    </button>
                    <button className="action-btn pdf-btn" onClick={handlePDFExport}>
                      <span className="btn-icon">📄</span>
                      Export PDF
                    </button>
                    {!showConfirmClear ? (
                      <button
                        className="action-btn clear-btn"
                        onClick={() => setShowConfirmClear(true)}
                      >
                        <span className="btn-icon">🗑️</span>
                        Clear History
                      </button>
                    ) : (
                      <div className="confirm-clear">
                        <p className="confirm-text">Clear all progress?</p>
                        <div className="confirm-buttons">
                          <button
                            className="confirm-btn confirm-yes"
                            onClick={handleClearHistory}
                          >
                            Yes
                          </button>
                          <button
                            className="confirm-btn confirm-no"
                            onClick={() => setShowConfirmClear(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && <AnalyticsTab />}

              {activeTab === 'insights' && <InsightsTab />}

              {activeTab === 'history' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="history-content"
                >
                  {history.length === 0 ? (
                    <div className="empty-history">
                      <div className="empty-icon">📭</div>
                      <p>No progress history yet</p>
                      <p className="empty-hint">Start analyzing your speech to see your progress!</p>
                    </div>
                  ) : (
                    <div className="history-list">
                      {history.map((entry) => {
                        const entryIsFavorite = isFavorite(entry.id);
                        return (
                          <motion.div
                            key={entry.id}
                            className={`history-item ${entryIsFavorite ? 'favorite-item' : ''}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: history.indexOf(entry) * 0.05 }}
                          >
                            <div className="history-item-header">
                              <div className="history-date">{formatDate(entry.timestamp)}</div>
                              <div className="history-item-actions">
                                <button
                                  className="favorite-toggle-btn"
                                  onClick={() => {
                                    toggleFavorite(entry.id);
                                    setFavorites(getFavoriteEntries());
                                  }}
                                  aria-label={entryIsFavorite ? "Remove from favorites" : "Add to favorites"}
                                  title={entryIsFavorite ? "Remove from favorites" : "Add to favorites"}
                                >
                                  {entryIsFavorite ? "⭐" : "☆"}
                                </button>
                                <div
                                  className="history-sentiment-badge"
                                  style={{ backgroundColor: getSentimentColor(entry.sentiment) }}
                                >
                                  {entry.sentiment}
                                </div>
                              </div>
                            </div>
                          {entry.transcript && (
                            <div className="history-transcript">
                              "{entry.transcript.length > 100 
                                ? entry.transcript.substring(0, 100) + '...' 
                                : entry.transcript}"
                            </div>
                          )}
                          <div className="history-item-footer">
                            <div
                              className="history-score"
                              style={{ color: getScoreColor(entry.score) }}
                            >
                              Score: {entry.score}
                            </div>
                            {entry.feedback && (
                              <div className="history-feedback">{entry.feedback}</div>
                            )}
                          </div>
                        </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'favorites' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="favorites-content"
                >
                  {favorites.length === 0 ? (
                    <div className="empty-history">
                      <div className="empty-icon">⭐</div>
                      <p>No favorites yet</p>
                      <p className="empty-hint">Mark your best performances as favorites to easily find them later!</p>
                    </div>
                  ) : (
                    <div className="history-list">
                      {favorites.map((entry) => (
                        <motion.div
                          key={entry.id}
                          className="history-item favorite-item"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: favorites.indexOf(entry) * 0.05 }}
                        >
                          <div className="history-item-header">
                            <div className="history-date">{formatDate(entry.timestamp)}</div>
                            <div className="history-item-actions">
                              <button
                                className="favorite-toggle-btn"
                                onClick={() => {
                                  toggleFavorite(entry.id);
                                  setFavorites(getFavoriteEntries());
                                }}
                                aria-label="Remove from favorites"
                                title="Remove from favorites"
                              >
                                ⭐
                              </button>
                              <div
                                className="history-sentiment-badge"
                                style={{ backgroundColor: getSentimentColor(entry.sentiment) }}
                              >
                                {entry.sentiment}
                              </div>
                            </div>
                          </div>
                          {entry.transcript && (
                            <div className="history-transcript">
                              "{entry.transcript.length > 100 
                                ? entry.transcript.substring(0, 100) + '...' 
                                : entry.transcript}"
                            </div>
                          )}
                          <div className="history-item-footer">
                            <div
                              className="history-score"
                              style={{ color: getScoreColor(entry.score) }}
                            >
                              Score: {entry.score}
                            </div>
                            {entry.feedback && (
                              <div className="history-feedback">{entry.feedback}</div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Pricing Modal */}
          <PricingModal
            isOpen={showPricingModal}
            onClose={() => setShowPricingModal(false)}
            currentSessionCount={sessionInfo.used}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default Progress;

