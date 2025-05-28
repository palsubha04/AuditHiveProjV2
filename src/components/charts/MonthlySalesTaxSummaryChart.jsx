import React from 'react';
import Chart from 'react-apexcharts';
import './charts.css';
import { CardBody, CardHeader } from 'react-bootstrap';

const MonthlySalesTaxSummaryChart = ({ salesData }) => {
  let chartData = {};
  if (salesData && Object.keys(salesData).length > 0 && salesData.records) {
    chartData = salesData.records[0];
  }

  const months = [
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

  const chartSeries = [
    {
      name: 'Sales Income',
      data: chartData?.monthly_summary?.map((m) => m.total_sales_income) || [],
    },
    {
      name: 'Taxable Sales',
      data: chartData?.monthly_summary?.map((m) => m.gst_taxable_sales) || [],
    },
    {
      name: 'Zero Rated Sales',
      data: chartData?.monthly_summary?.map((m) => m.zero_rated_sales) || [],
    },
    {
      name: 'Exempt Sales',
      data: chartData?.monthly_summary?.map((m) => m.exempt_sales) || [],
    },
  ];

  const chartOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
    },
    stroke: {
      width: [3, 3, 2, 2],
      curve: 'smooth',
    },
    xaxis: {
      categories: months,
      title: { text: 'Month' },
    },
    yaxis: {
      labels: {
        formatter: (val) =>
          val >= 1000 ? `${(val / 1000000).toFixed(1)}M` : val,
      },
    },
    legend: {
      position: 'top',
    },
    colors: ['#2563eb', '#22c55e', '#f59e42', '#a0aec0'],
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
  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">GST Sales Comparison</div>
      </CardHeader>
      <CardBody>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={430}
        />
      </CardBody>
    </>
  );
};

export default MonthlySalesTaxSummaryChart;
