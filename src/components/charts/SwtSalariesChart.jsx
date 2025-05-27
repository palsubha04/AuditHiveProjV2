import React from 'react';
import Chart from 'react-apexcharts';
import './charts.css';
import { CardBody, CardHeader } from 'react-bootstrap';

const SwtSalariesChart = ({ data }) => {
  // SWT Salaries Comparison Data
  const monthlySummary = data?.records[0]?.monthly_summary || [];

  const swtSalariesMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const swtSalariesChartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      // background: '#fff' // Remove this line to eliminate white background
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: [2, 2, 2],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.45,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: swtSalariesMonths,
      title: { text: 'Month' },
      labels: {
        style: { colors: '#888', fontWeight: 500, fontSize: '14px' },
      },
      axisBorder: { show: true, color: '#e0e7ef' }, // Ensure border is visible and matches other chart
      axisTicks: { show: true, color: '#e0e7ef' }, // Ensure ticks are visible and matches other chart
      offsetY: 0, // Align with EmployeeLineChart
      position: 'bottom',
    },
    yaxis: {
      labels: {
        style: { colors: '#888', fontWeight: 500, fontSize: '14px' },
        formatter: (val) =>
          val >= 1000 ? `${(val / 1000000).toFixed(1)}M` : val,
      },
    },
    legend: {
      position: 'top',
      fontWeight: 700,
      labels: {
        colors: ['#4338ca', '#22c55e', '#f59e42'],
      },
    },
    colors: ['#4338ca', '#22c55e', '#f59e42'],
    tooltip: {
      shared: true,
      intersect: false,
      style: { fontSize: '15px' },
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
    },
    noData: {
      text: 'No Data Found',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#6c757d',
        fontSize: '16px',
        fontFamily: 'inherit',
      },
    },
  };

  const swtSalariesChartSeries = [
    {
      name: 'Total Salary Wages Paid',
      data:
        monthlySummary && monthlySummary.map((m) => m.total_salary_wages_paid),
    },
    {
      name: 'SW Paid for SWT Deduction',
      data:
        monthlySummary &&
        monthlySummary.map((m) => m.sw_paid_for_swt_deduction),
    },
    {
      name: 'Total SWT Tax Deducted',
      data:
        monthlySummary && monthlySummary.map((m) => m.total_swt_tax_deducted),
    },
  ];

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">SWT Salaries Comparison</div>
      </CardHeader>
      <CardBody>
        <Chart
          options={swtSalariesChartOptions}
          series={swtSalariesChartSeries}
          type="area"
          height={430}
        />
      </CardBody>
    </>
  );
};

export default SwtSalariesChart;
