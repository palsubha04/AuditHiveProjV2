import { CardBody, CardHeader, Dropdown } from 'react-bootstrap';
import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { format, addMonths } from 'date-fns';
import './charts.css';

// Util to parse DD-MM-YYYY
const parseDDMMYYYY = (str) => {
  const [day, month, year] = str.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

// Generate labels from start to end
const generateMonthLabels = (start, end) => {
  const labels = [];
  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);

  while (current <= last) {
    labels.push(format(current, 'MMM yy'));
    current = addMonths(current, 1);
  }

  return labels;
};

// Map data to month label -> value
const getMonthlyValues = (data, key, labels) => {
  const map = new Map();
  data?.forEach((yearData) => {
    const year = yearData.year;
    yearData.monthly_summary.forEach((item) => {
      const label = format(new Date(year, item.month), 'MMM yy');
      map.set(label, item[key]);
    });
  });

  return labels.map((label) => map.get(label) || 0);
};

const EmployeeLineChart = ({ data, start_date, end_date }) => {
  const startDate = start_date ? parseDDMMYYYY(start_date) : null;
  const endDate = end_date ? parseDDMMYYYY(end_date) : null;

  if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
    return <div>Invalid date range</div>;
  }

  const categories = generateMonthLabels(startDate, endDate);

  const employeesOnPayroll = getMonthlyValues(
    data?.records || [],
    'employees_on_payroll',
    categories
  );
  const employeesPaidSWT = getMonthlyValues(
    data?.records || [],
    'employees_paid_swt',
    categories
  );

  const series = [
    {
      name: 'Employees on Payroll',
      data: employeesOnPayroll,
    },
    {
      name: 'Employees Paid SWT',
      data: employeesPaidSWT,
    },
  ];

  const options = {
    chart: {
      id: 'employees-on-payroll-vs-paid-swt',
      type: 'line',
      toolbar: { show: false },
    },
    stroke: {
      width: 3,
      curve: 'smooth',
    },
    xaxis: {
      categories,
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

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID(
      'employees-on-payroll-vs-paid-swt'
    );
    if (!chart) return;
    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'employees-on-payroll-vs-paid-swt.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'employees-on-payroll-vs-paid-swt.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'employees-on-payroll-vs-paid-swt',
      });
    }
  };

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">Employees on Payroll vs Paid SWT</div>
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
        {data?.records?.length > 0 ? 
        <Chart options={options} series={series} type="line" height={430} />
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

export default EmployeeLineChart;
