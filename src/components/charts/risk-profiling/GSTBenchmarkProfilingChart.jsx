import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import '../charts.css';
import { CardBody, CardHeader, Dropdown } from 'react-bootstrap';

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
      id: 'gst-benchmark-profiling',
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

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID('gst-benchmark-profiling');
    if (!chart) return;
    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'gst-benchmark-profiling.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'gst-benchmark-profiling.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'gst-benchmark-profiling',
      });
    }
  };

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="d-flex flex-row justify-content-between w-100 gap-2 align-items-center">
          <div className='chart-headers'>GST Comparison - Payable Vs Refundable</div>
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
