import React from 'react';
import Chart from 'react-apexcharts';
import './charts.css'

// Risk Breakdown Data
const riskData = {
  year: 2024,
  total_companies: 100000,
  risk_assessment: {
    gst: {
      total: 42000,
      high_risk: { count: 1260, percentage: 3.0 },
      medium_risk: { count: 6300, percentage: 15.0 },
      low_risk: { count: 34440, percentage: 82.0 },
    },
    swt: {
      total: 36000,
      high_risk: { count: 900, percentage: 2.5 },
      medium_risk: { count: 5400, percentage: 15.0 },
      low_risk: { count: 29700, percentage: 82.5 },
    },
    cit: {
      total: 22000,
      high_risk: { count: 374, percentage: 1.7 },
      medium_risk: { count: 3300, percentage: 15.0 },
      low_risk: { count: 18326, percentage: 83.3 },
    },
  },
};

// Prepare data for ApexCharts
const categories = ['GST', 'SWT', 'CIT'];
const highRisk = [
  riskData.risk_assessment.gst.high_risk.count,
  riskData.risk_assessment.swt.high_risk.count,
  riskData.risk_assessment.cit.high_risk.count,
];
const mediumRisk = [
  riskData.risk_assessment.gst.medium_risk.count,
  riskData.risk_assessment.swt.medium_risk.count,
  riskData.risk_assessment.cit.medium_risk.count,
];
const lowRisk = [
  riskData.risk_assessment.gst.low_risk.count,
  riskData.risk_assessment.swt.low_risk.count,
  riskData.risk_assessment.cit.low_risk.count,
];

const series = [
  {
    name: 'High Risk',
    data: highRisk,
  },
  {
    name: 'Medium Risk',
    data: mediumRisk,
  },
  {
    name: 'Low Risk',
    data: lowRisk,
  },
];

const highRiskPercent = [
  riskData.risk_assessment.gst.high_risk.percentage,
  riskData.risk_assessment.swt.high_risk.percentage,
  riskData.risk_assessment.cit.high_risk.percentage,
];
const mediumRiskPercent = [
  riskData.risk_assessment.gst.medium_risk.percentage,
  riskData.risk_assessment.swt.medium_risk.percentage,
  riskData.risk_assessment.cit.medium_risk.percentage,
];
const lowRiskPercent = [
  riskData.risk_assessment.gst.low_risk.percentage,
  riskData.risk_assessment.swt.low_risk.percentage,
  riskData.risk_assessment.cit.low_risk.percentage,
];

const percentageSeries = [highRiskPercent, mediumRiskPercent, lowRiskPercent];

const options = {
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 4,
    },
  },
  xaxis: {
    categories: categories,
  },
  yaxis: {
    title: {
      text: 'Number of Companies',
    },
  },
  legend: {
    position: 'top',
  },
  fill: {
    opacity: 1,
  },
  colors: ['#e74c3c', '#f1c40f', '#2ecc71'], // High, Medium, Low
  tooltip: {
    y: {
      formatter: function (val, { seriesIndex, dataPointIndex }) {
        const percent = percentageSeries[seriesIndex][dataPointIndex];
        return `${val} companies (${percent}%)`;
      },
    },
  },
};

const RiskBreakdownChart = () => (
  <>
    <h3
      style={{
        fontWeight: 700,
        fontSize: 20,
        color: '#6366f1',
        letterSpacing: 1,
        minHeight: 28,
        marginBottom: 18,
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      Risk Breakdown By Category ({riskData.year})
    </h3>
    <Chart options={options} series={series} type="bar" height={350} />
  </>
);

export default RiskBreakdownChart;
