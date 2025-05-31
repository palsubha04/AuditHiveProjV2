import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import '../charts.css';
import { CardBody, CardHeader, Dropdown } from 'react-bootstrap';

const SWTBenchmarkEmployeesProfilingChart = ({
  swtBenchmarkEmployeesProfilingData,
}) => {
  const series = [
    {
      name: 'Payroll Employees',
      data: [
        swtBenchmarkEmployeesProfilingData?.employees_on_payroll || 0,
        swtBenchmarkEmployeesProfilingData?.average_employees_on_payroll || 0,
      ],
    },
    {
      name: 'SWT Employees',
      data: [
        swtBenchmarkEmployeesProfilingData?.swt_employees || 0,
        swtBenchmarkEmployeesProfilingData?.average_swt_employees || 0,
      ],
    },
  ];

  const options = {
    chart: {
      id: 'swt-benchmark-employees-profiling',
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
        text: 'Employee Count',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const isOverall = dataPointIndex === 0;

        const ratio = isOverall
          ? swtBenchmarkEmployeesProfilingData['swt_employees'] != 0
            ? (
                swtBenchmarkEmployeesProfilingData['employees_on_payroll'] /
                swtBenchmarkEmployeesProfilingData['swt_employees']
              ).toFixed(3)
            : 'N/A'
          : swtBenchmarkEmployeesProfilingData['average_swt_employees'] != 0
          ? (
              swtBenchmarkEmployeesProfilingData[
                'average_employees_on_payroll'
              ] / swtBenchmarkEmployeesProfilingData['average_swt_employees']
            ).toFixed(3)
          : 'N/A';

        const ratioLabel = isOverall
          ? 'Payroll vs SWT'
          : 'Average Payroll vs Average SWT';

        const value = series[seriesIndex][dataPointIndex];

        const barLabel =
          seriesIndex === 0 ? 'Payroll Employees' : 'SWT Employees';

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
      'swt-benchmark-employees-profiling'
    );
    if (!chart) return;
    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'swt-benchmark-employees-profiling.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'swt-benchmark-employees-profiling.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'swt-benchmark-employees-profiling',
      });
    }
  };
  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">
          SWT Comparison - Employees On Payroll Vs SWT Employees
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
      {swtBenchmarkEmployeesProfilingData && Object.keys(swtBenchmarkEmployeesProfilingData).length > 0  ?
      <Chart options={options} series={series} type="bar" height={430} />
      :  <div
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

export default SWTBenchmarkEmployeesProfilingChart;
