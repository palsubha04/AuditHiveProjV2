import React from 'react';
import Chart from 'react-apexcharts';
import '../charts.css';
import { CardBody, CardHeader } from 'react-bootstrap';

const GSTBenchmarkProfilingChart = ({ gstBenchmarkProfilingData }) => {
  const series = [
    {
      name: 'Payable',
      data: [
        gstBenchmarkProfilingData?.gst_payable || 0,
        gstBenchmarkProfilingData?.average_gst_payable || 0,
      ],
    },
    {
      name: 'Refundable',
      data: [
        gstBenchmarkProfilingData?.gst_refundable || 0,
        gstBenchmarkProfilingData?.average_gst_refundable || 0,
      ],
    },
  ];

  const options = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
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
    xaxis: {
      categories: ['Overall', 'Industry cum Segment Average'],
    },
    yaxis: {
      title: {
        text: 'PGK (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const isOverall = dataPointIndex === 0;

        const ratio = isOverall
          ? gstBenchmarkProfilingData['gst_refundable'] != 0
            ? (
                gstBenchmarkProfilingData['gst_payable'] /
                gstBenchmarkProfilingData['gst_refundable']
              ).toFixed(3)
            : 'N/A'
          : gstBenchmarkProfilingData['average_gst_refundable'] != 0
          ? (
              gstBenchmarkProfilingData['average_gst_payable'] /
              gstBenchmarkProfilingData['average_gst_refundable']
            ).toFixed(3)
          : 'N/A';

        const ratioLabel = isOverall
          ? 'Payable vs Refundable'
          : 'Average Payable vs Average Refundable';

        const value = series[seriesIndex][dataPointIndex];

        const barLabel = seriesIndex === 0 ? 'Payable' : 'Refundable';

        return `
          <div style="padding: 8px; font-size: 14px;">
            <div><strong>${barLabel}: PGK ${value.toLocaleString()}</strong></div>
            <div style="color: #6c757d; margin-top: 4px;">${ratioLabel}: ${ratio}</div>
          </div>
        `;
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
        <div className="chart-headers">
          GST Comparison - Payable Vs Refundable
        </div>
      </CardHeader>
      <CardBody>
        <div className="chart-container">
          <Chart options={options} series={series} type="bar" height={430} />
        </div>
      </CardBody>
    </>
  );
};

export default GSTBenchmarkProfilingChart;
