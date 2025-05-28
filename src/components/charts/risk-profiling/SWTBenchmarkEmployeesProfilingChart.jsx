import React from 'react';
import Chart from 'react-apexcharts';
import '../charts.css';
import { CardBody, CardHeader } from 'react-bootstrap';

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

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">
          SWT Comparison - Employees On Payroll Vs SWT Employees
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type="bar" height={430} />
      </CardBody>
    </>
  );
};

export default SWTBenchmarkEmployeesProfilingChart;
