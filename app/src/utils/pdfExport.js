/**
 * PDF Export Utility for Progress Reports
 */

import jsPDF from 'jspdf';
import { getProgressStats } from './progressStorage';
import { getImprovementMetrics, getPracticeStreaks, getBestPerformances, getTimeSeriesData } from './advancedAnalytics';

/**
 * Generate and download a comprehensive PDF report
 */
export const exportProgressToPDF = async () => {
  try {
    // Create PDF document
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Get all data
    const stats = getProgressStats();
    const improvement = getImprovementMetrics();
    const streaks = getPracticeStreaks();
    const bestPerformances = getBestPerformances(3);
    const timeSeriesData = getTimeSeriesData('week');

    // Helper function to check page overflow
    const checkPageOverflow = (needed = 10) => {
      if (yPosition + needed > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Title
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Impression Progress Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const reportDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    pdf.text(`Generated on ${reportDate}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Divider line
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // === OVERVIEW SECTION ===
    checkPageOverflow(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Overview', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    const overviewData = [
      ['Total Practice Sessions:', stats.totalEntries.toString()],
      ['Average Score:', `${stats.averageScore}/100`],
      ['Highest Score:', `${stats.highestScore}/100`],
      ['Current Streak:', `${streaks.current} days`],
      ['Longest Streak:', `${streaks.longest} days`],
      ['Recent Trend:', stats.recentTrend.charAt(0).toUpperCase() + stats.recentTrend.slice(1)],
    ];

    overviewData.forEach(([label, value]) => {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label, margin + 5, yPosition);
      pdf.setFont('helvetica', 'normal');
      pdf.text(value, margin + 80, yPosition);
      yPosition += 7;
    });

    yPosition += 5;

    // === SENTIMENT DISTRIBUTION ===
    checkPageOverflow(40);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Sentiment Distribution', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');

    Object.entries(stats.sentimentDistribution).forEach(([sentiment, count]) => {
      const percentage = stats.totalEntries > 0
        ? Math.round((count / stats.totalEntries) * 100)
        : 0;
      
      pdf.text(`${sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}:`, margin + 5, yPosition);
      pdf.text(`${count} (${percentage}%)`, margin + 60, yPosition);
      
      // Draw bar
      const barWidth = percentage * 1.2;
      const barColor = getSentimentColor(sentiment);
      pdf.setFillColor(barColor.r, barColor.g, barColor.b);
      pdf.rect(margin + 100, yPosition - 4, barWidth, 5, 'F');
      
      yPosition += 8;
    });

    yPosition += 5;

    // === IMPROVEMENT METRICS ===
    if (improvement) {
      checkPageOverflow(40);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Improvement Metrics', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');

      const improvementData = [
        ['Score Improvement:', `${improvement.scoreImprovement > 0 ? '+' : ''}${improvement.scoreImprovement}%`],
        ['Filler Words Reduction:', `${improvement.fillerWordsReduction}%`],
        ['Consistency Score:', `${improvement.consistencyScore}%`],
        ['Recent Practices:', `${improvement.recentPractices} sessions`],
      ];

      improvementData.forEach(([label, value]) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(label, margin + 5, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(value, margin + 80, yPosition);
        yPosition += 7;
      });

      yPosition += 5;
    }

    // === BEST PERFORMANCES ===
    if (bestPerformances.length > 0) {
      checkPageOverflow(60);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Top Performances', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      
      bestPerformances.forEach((perf, index) => {
        checkPageOverflow(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. Score: ${perf.score}/100`, margin + 5, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`${perf.date}`, margin + 50, yPosition);
        yPosition += 5;
        
        if (perf.transcript) {
          pdf.setFontSize(9);
          pdf.setFont('helvetica', 'italic');
          const lines = pdf.splitTextToSize(perf.transcript, pageWidth - margin * 2 - 10);
          pdf.text(lines, margin + 10, yPosition);
          yPosition += (lines.length * 4) + 3;
        }
        yPosition += 5;
      });
    }

    // === WEEKLY TRENDS ===
    if (timeSeriesData.length > 0) {
      checkPageOverflow(50);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Recent Weekly Activity', margin, yPosition);
      yPosition += 10;

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      
      // Table headers
      pdf.text('Period', margin + 5, yPosition);
      pdf.text('Sessions', margin + 50, yPosition);
      pdf.text('Avg Score', margin + 85, yPosition);
      pdf.text('Avg Words', margin + 120, yPosition);
      yPosition += 6;

      pdf.setFont('helvetica', 'normal');
      
      timeSeriesData.slice(-8).forEach((data) => {
        checkPageOverflow(10);
        pdf.text(data.period, margin + 5, yPosition);
        pdf.text(data.practices.toString(), margin + 50, yPosition);
        pdf.text(data.avgScore.toString(), margin + 85, yPosition);
        pdf.text(data.avgWords.toString(), margin + 120, yPosition);
        yPosition += 6;
      });
    }

    // Footer
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Generated by Impression - Practice Makes Perfect', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save PDF
    const fileName = `Impression-Progress-Report-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

/**
 * Get RGB color for sentiment
 */
const getSentimentColor = (sentiment) => {
  const colors = {
    positive: { r: 56, g: 161, b: 105 },
    negative: { r: 229, g: 62, b: 62 },
    neutral: { r: 113, g: 128, b: 150 },
    mixed: { r: 214, g: 158, b: 46 },
  };
  return colors[sentiment] || colors.neutral;
};

