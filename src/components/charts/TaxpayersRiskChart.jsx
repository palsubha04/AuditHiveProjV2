import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './charts.css';
import { CardBody, CardHeader } from 'react-bootstrap';

const TaxpayersRiskChart = ({ data }) => {
  // Prepare data for the chart from the new data structure
  const monthlySummary = data?.records[0]?.monthly_summary || [];
  //console.log('data from chart', monthlySummary);

  // Map months to labels (e.g., Jan, Feb, ...)
  const monthLabels = [
    '',
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

  // Extract months present in the data and sort them
  const categories = monthlySummary
    .map((item) => monthLabels[item.month])
    .filter(Boolean);

  const gstPayableData = monthlySummary.map((item) => item.gst_payable);
  const gstRefundableData = monthlySummary.map((item) => item.gst_refundable);

  const series = [
    {
      name: 'GST Payable',
      data: gstPayableData,
    },
    {
      name: 'GST Refundable',
      data: gstRefundableData,
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '40%',
        borderRadius: 6,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    colors: ['#5B5FF6', '#7DD3FC'],
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '14px',
          colors: '#A3A3C2',
        },
      },
      axisBorder: { show: true, color: '#e0e7ef' },
      axisTicks: { show: true, color: '#e0e7ef' },
      position: 'bottom',
    },
    yaxis: {
      labels: {
        formatter: (val) => `${Math.round(val / 1000)}K`,
        style: {
          fontSize: '14px',
          colors: '#A3A3C2',
        },
      },
      min: 0,
      max: Math.max(...gstPayableData, ...gstRefundableData) * 1.1,
      tickAmount: 4,
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      markers: {
        radius: 12,
      },
      labels: {
        colors: ['#5B5FF6', '#7DD3FC'],
      },
    },
    tooltip: {
      y: {
        formatter: (val) =>
          `${val.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`,
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const taxType = categories[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        const label = seriesIndex === 0 ? 'GST Payable' : 'GST Refundable';
        return `<div style="padding:10px 16px;background:#45457A;color:#fff;border-radius:10px;box-shadow:0 2px 8px #0002;">
          <div style="font-size:15px;font-weight:500;">${taxType} - ${label}</div>
          <div style="font-size:18px;font-weight:600;">${value.toLocaleString(
            'en-US'
          )}</div>
        </div>`;
      },
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      yaxis: {
        lines: { show: true },
      },
      xaxis: {
        lines: { show: false },
      },
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

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">Taxpayers Risk</div>
      </CardHeader>
      <CardBody>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={430}
        />
      </CardBody>
    </>
  );
};

export default TaxpayersRiskChart;
