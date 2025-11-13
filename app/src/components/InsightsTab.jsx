import { motion } from 'framer-motion';
import {
  getImprovementMetrics,
  getPracticeStreaks,
  getBestPerformances,
  getCalendarHeatmapData,
} from '../utils/advancedAnalytics';

const InsightsTab = () => {
  const improvement = getImprovementMetrics();
  const streaks = getPracticeStreaks();
  const bestPerformances = getBestPerformances(5);
  const calendarData = getCalendarHeatmapData();

  const getIntensityColor = (count) => {
    if (count === 0) return 'var(--card-border)';
    if (count === 1) return 'rgba(var(--theme-primary-rgb), 0.3)';
    if (count === 2) return 'rgba(var(--theme-primary-rgb), 0.5)';
    if (count === 3) return 'rgba(var(--theme-primary-rgb), 0.7)';
    return 'var(--theme-primary)';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#38a169';
    if (score >= 60) return '#d69e2e';
    if (score >= 40) return '#ed8936';
    return '#e53e3e';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="insights-content"
    >
      <h3 className="section-title">💡 Insights & Achievements</h3>

      {/* Practice Streaks */}
      <div className="insights-section">
        <h4 className="insights-subtitle">🔥 Practice Streaks</h4>
        <div className="streaks-grid">
          <div className="streak-card">
            <div className="streak-icon">🔥</div>
            <div className="streak-value">{streaks.current}</div>
            <div className="streak-label">Current Streak</div>
            <div className="streak-sublabel">
              {streaks.current === 1 ? 'day' : 'days'}
            </div>
          </div>
          <div className="streak-card">
            <div className="streak-icon">🏆</div>
            <div className="streak-value">{streaks.longest}</div>
            <div className="streak-label">Longest Streak</div>
            <div className="streak-sublabel">
              {streaks.longest === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>
        {streaks.current > 0 && (
          <div className="streak-encouragement">
            <p>
              {streaks.current >= 7 
                ? '🎉 Amazing consistency! Keep it up!'
                : streaks.current >= 3
                ? '👏 Great momentum! Keep going!'
                : '💪 You\'re on a roll! Practice tomorrow to keep your streak alive!'}
            </p>
          </div>
        )}
      </div>

      {/* Practice Calendar Heatmap */}
      <div className="insights-section">
        <h4 className="insights-subtitle">📅 Practice Calendar (Last 12 Weeks)</h4>
        <div className="calendar-heatmap">
          <div className="calendar-days-labels">
            <div className="day-label">Sun</div>
            <div className="day-label">Mon</div>
            <div className="day-label">Tue</div>
            <div className="day-label">Wed</div>
            <div className="day-label">Thu</div>
            <div className="day-label">Fri</div>
            <div className="day-label">Sat</div>
          </div>
          <div className="calendar-grid">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="calendar-week">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="calendar-day"
                    style={{ backgroundColor: getIntensityColor(day.count) }}
                    title={`${day.date}: ${day.count} ${day.count === 1 ? 'practice' : 'practices'}${day.avgScore > 0 ? ` (Avg: ${day.avgScore})` : ''}`}
                  >
                    <span className="calendar-day-number">{day.day}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="calendar-legend">
            <span className="legend-label">Less</span>
            <div className="legend-boxes">
              <div className="legend-box" style={{ backgroundColor: 'var(--card-border)' }}></div>
              <div className="legend-box" style={{ backgroundColor: 'rgba(102, 126, 234, 0.3)' }}></div>
              <div className="legend-box" style={{ backgroundColor: 'rgba(102, 126, 234, 0.5)' }}></div>
              <div className="legend-box" style={{ backgroundColor: 'rgba(102, 126, 234, 0.7)' }}></div>
              <div className="legend-box" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
            </div>
            <span className="legend-label">More</span>
          </div>
        </div>
      </div>

      {/* Improvement Metrics */}
      {improvement && (
        <div className="insights-section">
          <h4 className="insights-subtitle">📈 Your Progress</h4>
          <div className="improvement-grid">
            <div className="improvement-card">
              <div className="improvement-icon">📊</div>
              <div className="improvement-value" style={{
                color: improvement.scoreImprovement > 0 ? '#38a169' : improvement.scoreImprovement < 0 ? '#e53e3e' : '#718096'
              }}>
                {improvement.scoreImprovement > 0 ? '+' : ''}{improvement.scoreImprovement}%
              </div>
              <div className="improvement-label">Score Improvement</div>
              <div className="improvement-hint">vs. your first 10 sessions</div>
            </div>

            <div className="improvement-card">
              <div className="improvement-icon">🎯</div>
              <div className="improvement-value" style={{
                color: improvement.fillerWordsReduction > 0 ? '#38a169' : '#e53e3e'
              }}>
                {improvement.fillerWordsReduction > 0 ? '↓' : '↑'} {Math.abs(improvement.fillerWordsReduction)}%
              </div>
              <div className="improvement-label">Filler Words</div>
              <div className="improvement-hint">
                {improvement.fillerWordsReduction > 0 ? 'Great reduction!' : 'Room to improve'}
              </div>
            </div>

            <div className="improvement-card">
              <div className="improvement-icon">⚡</div>
              <div className="improvement-value">{improvement.consistencyScore}%</div>
              <div className="improvement-label">Consistency</div>
              <div className="improvement-hint">Last 7 days</div>
            </div>

            <div className="improvement-card">
              <div className="improvement-icon">📝</div>
              <div className="improvement-value">{improvement.totalPractices}</div>
              <div className="improvement-label">Total Sessions</div>
              <div className="improvement-hint">All time</div>
            </div>
          </div>

          {/* Motivational message based on metrics */}
          <div className="improvement-message">
            {improvement.scoreImprovement > 10 && improvement.consistencyScore > 70 ? (
              <p className="message-excellent">
                🌟 Excellent! You're improving consistently and maintaining great practice habits!
              </p>
            ) : improvement.scoreImprovement > 0 && improvement.consistencyScore > 50 ? (
              <p className="message-good">
                👍 Good progress! Keep practicing regularly to see even better results!
              </p>
            ) : improvement.consistencyScore < 30 ? (
              <p className="message-encourage">
                💪 Practice more consistently to unlock your full potential!
              </p>
            ) : (
              <p className="message-neutral">
                📊 Keep practicing! Consistency is key to improvement!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Best Performances */}
      {bestPerformances.length > 0 && (
        <div className="insights-section">
          <h4 className="insights-subtitle">🏆 Your Best Performances</h4>
          <div className="best-performances-list">
            {bestPerformances.map((performance, index) => (
              <motion.div
                key={performance.id}
                className="performance-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="performance-rank">
                  <span className="rank-number">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </span>
                </div>
                <div className="performance-content">
                  <div className="performance-header">
                    <div 
                      className="performance-score"
                      style={{ color: getScoreColor(performance.score) }}
                    >
                      {performance.score}/100
                    </div>
                    <div className="performance-date">{performance.date}</div>
                  </div>
                  <div className="performance-sentiment">
                    <span 
                      className="sentiment-badge"
                      style={{ 
                        backgroundColor: performance.sentiment === 'positive' ? '#38a169' :
                          performance.sentiment === 'negative' ? '#e53e3e' :
                          performance.sentiment === 'mixed' ? '#d69e2e' : '#718096'
                      }}
                    >
                      {performance.sentiment}
                    </span>
                  </div>
                  {performance.transcript && (
                    <div className="performance-transcript">
                      "{performance.transcript}"
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {!improvement && bestPerformances.length === 0 && (
        <div className="empty-insights">
          <div className="empty-icon">💡</div>
          <p>Complete more sessions to unlock insights!</p>
          <p className="empty-hint">You need at least 10 sessions to see improvement metrics.</p>
        </div>
      )}
    </motion.div>
  );
};

export default InsightsTab;

