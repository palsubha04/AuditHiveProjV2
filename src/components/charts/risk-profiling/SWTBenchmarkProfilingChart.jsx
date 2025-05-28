import React from 'react';
import Chart from 'react-apexcharts';
import '../charts.css';
import { CardBody, CardHeader } from 'react-bootstrap';

const SWTBenchmarkProfilingChart = ({ swtBenchmarkProfilingData }) => {
  const series = [
    {
      name: 'Salary Wage',
      data: [
        swtBenchmarkProfilingData?.total_salary_wages_paid || 0,
        swtBenchmarkProfilingData?.average_salary_wages_paid || 0,
      ],
    },
    {
      name: 'SWT Tax',
      data: [
        swtBenchmarkProfilingData?.total_swt_tax_deducted || 0,
        swtBenchmarkProfilingData?.average_swt_tax_deducted || 0,
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
        text: 'Amount',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const isOverall = dataPointIndex === 0;

        const ratio = isOverall
          ? swtBenchmarkProfilingData['total_swt_tax_deducted'] != 0
            ? (
                swtBenchmarkProfilingData['total_salary_wages_paid'] /
                swtBenchmarkProfilingData['total_swt_tax_deducted']
              ).toFixed(3)
            : 'N/A'
          : swtBenchmarkProfilingData['average_swt_tax_deducted'] != 0
          ? (
              swtBenchmarkProfilingData['average_salary_wages_paid'] /
              swtBenchmarkProfilingData['average_swt_tax_deducted']
            ).toFixed(3)
          : 'N/A';

        const ratioLabel = isOverall
          ? 'Salary vs Tax'
          : 'Average Salary vs Average Tax';

        const value = series[seriesIndex][dataPointIndex];

        const barLabel = seriesIndex === 0 ? 'Salary Wage' : 'SWT Tax';

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
          SWT Comparison - Salary Wages Paid Vs SWT Tax Deducted
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type="bar" height={430} />
      </CardBody>
    </>
  );
};

export default SWTBenchmarkProfilingChart;
