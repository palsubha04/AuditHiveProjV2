import { Tally1 } from 'lucide-react';
import React from 'react';
import Chart from 'react-apexcharts';

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
            <div><strong>${barLabel}: $ ${value.toLocaleString()}</strong></div>
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
    <div>
      <div
        style={{
          display: 'flex',
          // justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h4
          className="mb-0 me-3 fw-bold"
          style={{
            color: '#05004E',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '0px',
            lineHeight: '32px',
          }}
        >
          SWT Comparison - Salary Wages Paid Vs SWT Tax Deducted
        </h4>
        {/* <Tally1 style={{ color: "#7c879d" }} /> */}
      </div>
      <Chart options={options} series={series} type="bar" height={430} />
      {/* Only render chart if series data exists */}
      {/* {riskBreakdownByCategoryData ? (series.length > 0 && (
            <Chart options={options} series={series} type="bar" height={350} />
          )) : <div>No data available</div>} */}
    </div>
  );
};

export default SWTBenchmarkProfilingChart;
