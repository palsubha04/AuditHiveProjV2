import React from 'react';
import Chart from 'react-apexcharts';
import './charts.css';
import { CardBody, CardHeader } from 'react-bootstrap';

const EmployeeLineChart = ({ data }) => {
  // let employeeData = {};
  // if (data && Object.keys(data).length > 0 && data.records) {
  //   employeeData = data?.records[0];
  // }
  const monthlySummary = data?.records[0]?.monthly_summary || [];
  // console.log('Data from chart: ', employeeData);

  const employeeMonths = [
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
  const employeeLineSeries = [
    {
      name: 'Employees on Payroll',
      data: monthlySummary?.map((m) => m.employees_on_payroll),
    },
    {
      name: 'Employees Paid SWT',
      data: monthlySummary?.map((m) => m.employees_paid_swt),
    },
  ];
  const employeeLineOptions = {
    chart: {
      type: 'line',
      toolbar: { show: false },
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    xaxis: {
      categories: employeeMonths,
      title: { text: 'Month' },
      labels: {
        style: { fontWeight: 500, color: '#334155', fontSize: '14px' },
      },
    },
    yaxis: {
      title: { text: 'Employees' },
      labels: {
        style: { fontWeight: 500, color: '#334155' },
      },
    },
    legend: {
      position: 'top',
      fontWeight: 600,
    },
    colors: ['#2563eb', '#22c55e'],
    markers: {
      size: 5,
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: { fontSize: '15px' },
    },
    grid: {
      borderColor: '#e0e7ef',
      strokeDashArray: 4,
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
        <div className="chart-headers">Employees on Payroll vs Paid SWT</div>
      </CardHeader>
      <CardBody>
        <Chart
          options={employeeLineOptions}
          series={employeeLineSeries}
          type="line"
          height={430}
        />
      </CardBody>
    </>
  );
};

export default EmployeeLineChart;
