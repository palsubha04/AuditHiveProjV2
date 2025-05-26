import { Tally1 } from 'lucide-react';
import React from 'react';
import Chart from 'react-apexcharts';

const GSTBenchmarkCreditsProfilingChart = ({
  gstBenchmarkCreditsProfilingData,
}) => {
  const series = [
    {
      name: 'Input Credits',
      data: [
        gstBenchmarkCreditsProfilingData?.input_credits || 0,
        gstBenchmarkCreditsProfilingData?.average_input_credits || 0,
      ],
    },
    {
      name: 'Output Debits',
      data: [
        gstBenchmarkCreditsProfilingData?.output_debits || 0,
        gstBenchmarkCreditsProfilingData?.average_output_debits || 0,
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
        text: 'Credits',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const isOverall = dataPointIndex === 0;

        const ratio = isOverall
          ? gstBenchmarkCreditsProfilingData['output_debits'] != 0
            ? (
                gstBenchmarkCreditsProfilingData['input_credits'] /
                gstBenchmarkCreditsProfilingData['output_debits']
              ).toFixed(3)
            : 'N/A'
          : gstBenchmarkCreditsProfilingData['average_output_debits'] != 0
          ? (
              gstBenchmarkCreditsProfilingData['average_input_credits'] /
              gstBenchmarkCreditsProfilingData['average_output_debits']
            ).toFixed(3)
          : 'N/A';

        const ratioLabel = isOverall
          ? 'Input vs Output'
          : 'Average Input vs Average Output';

        const value = series[seriesIndex][dataPointIndex];

        const barLabel = seriesIndex === 0 ? 'Input Credits' : 'Output Debits';

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
          GST Comparison - Input Credits vs Output Debits
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

export default GSTBenchmarkCreditsProfilingChart;
