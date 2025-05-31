import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import '../charts.css';
import { CardBody, CardHeader, Dropdown } from 'react-bootstrap';

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
      id: 'gst-benchmark-credits-profiling',
      type: 'bar',
      toolbar: { show: false },
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

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID(
      'gst-benchmark-credits-profiling'
    );
    if (!chart) return;
    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'gst-benchmark-credits-profiling.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'gst-benchmark-credits-profiling.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'gst-benchmark-credits-profiling',
      });
    }
  };
  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">
          GST Comparison - Input Credits vs Output Debits
        </div>
        <Dropdown>
          <Dropdown.Toggle
            variant="outline-default"
            size="sm"
            className="download-dropdown-btn"
          >
            Export
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleDownload('png')}>
              Download PNG
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleDownload('csv')}>
              Download CSV
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </CardHeader>
      <CardBody>
        {gstBenchmarkCreditsProfilingData && Object.keys(gstBenchmarkCreditsProfilingData).length > 0 ? 
        <Chart options={options} series={series} type="bar" height={430} />
        :   <div
        className="text-center text-muted"
        style={{
          height: '350px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        No Data Found
      </div>
}
      </CardBody>
        
    </>
  );
};

export default GSTBenchmarkCreditsProfilingChart;
