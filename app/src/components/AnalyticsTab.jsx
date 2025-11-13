import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  getTimeSeriesData,
  getVocabularyTrends,
  getPaceTrends,
  getFillerWordsAnalysis,
} from '../utils/advancedAnalytics';

const AnalyticsTab = () => {
  const [timePeriod, setTimePeriod] = useState('day');
  
  const timeSeriesData = getTimeSeriesData(timePeriod);
  const vocabularyData = getVocabularyTrends();
  const paceData = getPaceTrends();
  const fillerWordsData = getFillerWordsAnalysis();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="analytics-content"
    >
      <div className="analytics-header">
        <h3 className="section-title">📊 Analytics Dashboard</h3>
        <div className="time-period-selector">
          <button
            className={`period-btn ${timePeriod === 'day' ? 'active' : ''}`}
            onClick={() => setTimePeriod('day')}
          >
            Daily
          </button>
          <button
            className={`period-btn ${timePeriod === 'week' ? 'active' : ''}`}
            onClick={() => setTimePeriod('week')}
          >
            Weekly
          </button>
          <button
            className={`period-btn ${timePeriod === 'month' ? 'active' : ''}`}
            onClick={() => setTimePeriod('month')}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Practice Activity Over Time */}
      {timeSeriesData.length > 0 && (
        <div className="chart-container">
          <h4 className="chart-title">Practice Activity & Scores</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--theme-primary)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--theme-primary)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPractices" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--theme-accent)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--theme-accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis 
                dataKey="period" 
                stroke="var(--card-text-secondary)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--card-text-secondary)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="avgScore"
                stroke="var(--theme-primary)"
                fillOpacity={1}
                fill="url(#colorScore)"
                name="Avg Score"
              />
              <Area
                type="monotone"
                dataKey="practices"
                stroke="var(--theme-accent)"
                fillOpacity={1}
                fill="url(#colorPractices)"
                name="Sessions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Word Count Trends */}
      {timeSeriesData.length > 0 && (
        <div className="chart-container">
          <h4 className="chart-title">Speaking Volume (Avg. Words)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis 
                dataKey="period" 
                stroke="var(--card-text-secondary)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--card-text-secondary)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="avgWords" 
                fill="var(--theme-primary)" 
                name="Avg Words"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Vocabulary Diversity */}
      {vocabularyData.length > 0 && (
        <div className="chart-container">
          <h4 className="chart-title">Vocabulary Diversity (Last 30 Sessions)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={vocabularyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis 
                dataKey="index" 
                stroke="var(--card-text-secondary)"
                style={{ fontSize: '12px' }}
                label={{ value: 'Session #', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                stroke="var(--card-text-secondary)"
                style={{ fontSize: '12px' }}
                label={{ value: '%', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="diversity" 
                stroke="var(--theme-accent)" 
                strokeWidth={2}
                dot={{ fill: 'var(--theme-accent)', r: 4 }}
                name="Diversity %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Speaking Pace */}
      {paceData.length > 0 && (
        <div className="chart-container">
          <h4 className="chart-title">Speaking Pace (Words Per Minute)</h4>
          <p className="chart-subtitle">Optimal range: 120-160 WPM</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={paceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis 
                dataKey="index" 
                stroke="var(--card-text-secondary)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--card-text-secondary)"
                style={{ fontSize: '12px' }}
                domain={[0, 200]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="pace" 
                stroke="var(--theme-primary)" 
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={payload.optimal ? '#38a169' : '#e53e3e'}
                    />
                  );
                }}
                name="WPM"
              />
              {/* Optimal range reference lines */}
              <Line 
                type="monotone" 
                dataKey={() => 120} 
                stroke="#38a169" 
                strokeDasharray="5 5"
                strokeWidth={1}
                dot={false}
                name="Min Optimal"
              />
              <Line 
                type="monotone" 
                dataKey={() => 160} 
                stroke="#38a169" 
                strokeDasharray="5 5"
                strokeWidth={1}
                dot={false}
                name="Max Optimal"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filler Words Analysis */}
      {fillerWordsData.trends.length > 0 && (
        <div className="chart-container">
          <h4 className="chart-title">Filler Words Trend</h4>
          <div className="filler-words-stats">
            <div className="stat-badge">
              <span className="stat-badge-label">Total</span>
              <span className="stat-badge-value">{fillerWordsData.total}</span>
            </div>
            <div className="stat-badge">
              <span className="stat-badge-label">Average</span>
              <span className="stat-badge-value">{fillerWordsData.average}</span>
            </div>
            <div className="stat-badge">
              <span className="stat-badge-label">Improvement</span>
              <span className="stat-badge-value" style={{ 
                color: fillerWordsData.improvement > 0 ? '#38a169' : '#e53e3e' 
              }}>
                {fillerWordsData.improvement > 0 ? '↓' : '↑'} {Math.abs(fillerWordsData.improvement)}%
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fillerWordsData.trends}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
              <XAxis 
                dataKey="index" 
                stroke="var(--card-text-secondary)"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="var(--card-text-secondary)"
                style={{ fontSize: '12px' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="count" 
                fill="#e53e3e" 
                name="Filler Words"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {timeSeriesData.length === 0 && vocabularyData.length === 0 && (
        <div className="empty-analytics">
          <div className="empty-icon">📊</div>
          <p>No analytics data available yet</p>
          <p className="empty-hint">Complete more practice sessions to see detailed analytics!</p>
        </div>
      )}
    </motion.div>
  );
};

export default AnalyticsTab;

