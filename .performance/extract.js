import fs from 'node:fs';

const [, , name] = process.argv;

const reportPath = `.performance/reports/${name}.json`;
const summaryPath = '.performance/reports/0.summary.json';

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

const result = {
  name,
  performance: report.categories.performance.score * 100,
  firstContentfulPaint: report.audits['first-contentful-paint'].numericValue,
  largestContentfulPaint: report.audits['largest-contentful-paint'].numericValue,
  totalBlockingTime: report.audits['total-blocking-time'].numericValue,
  cumulativeLayoutShift: report.audits['cumulative-layout-shift'].numericValue,
  speedIndex: report.audits['speed-index'].numericValue
};

const summary = fs.existsSync(summaryPath) ? JSON.parse(fs.readFileSync(summaryPath, 'utf8')) : [];

summary.push(result);

fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
