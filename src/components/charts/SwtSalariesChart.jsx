import { CardBody, CardHeader, Dropdown } from 'react-bootstrap';
import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { format, addMonths } from 'date-fns';
import './charts.css';

// Parse "DD-MM-YYYY" to Date
const parseDDMMYYYY = (str) => {
  const [day, month, year] = str.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

// Generate month labels like ['May 19', 'Jun 19', ...]
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

const SwtSalariesChart = ({ data, start_date, end_date }) => {
  const startDate = start_date ? parseDDMMYYYY(start_date) : null;
  const endDate = end_date ? parseDDMMYYYY(end_date) : null;

  if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
    return <div>Invalid date range</div>;
  }

  const categories = generateMonthLabels(startDate, endDate);

  const totalSalaryWagesPaid = getMonthlyValues(
    data?.records || [],
    'total_salary_wages_paid',
    categories
  );
  const swPaidForSwtDeduction = getMonthlyValues(
    data?.records || [],
    'sw_paid_for_swt_deduction',
    categories
  );
  const totalSwtTaxDeducted = getMonthlyValues(
    data?.records || [],
    'total_swt_tax_deducted',
    categories
  );

  const series = [
    {
      name: 'Total Salary Wages Paid',
      data: totalSalaryWagesPaid,
    },
    {
      name: 'SW Paid for SWT Deduction',
      data: swPaidForSwtDeduction,
    },
    {
      name: 'Total SWT Tax Deducted',
      data: totalSwtTaxDeducted,
    },
  ];

  const options = {
    chart: {
      id: 'swt-salaries-comparison',
      type: 'area',
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: 'smooth',
      width: [2, 2, 2],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.45,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories,
      title: { text: 'Month' },
      labels: {
        style: { colors: '#888', fontWeight: 500, fontSize: '14px' },
      },
      axisBorder: { show: true, color: '#e0e7ef' },
      axisTicks: { show: true, color: '#e0e7ef' },
      offsetY: 0,
      position: 'bottom',
    },
    yaxis: {
      labels: {
        style: { colors: '#888', fontWeight: 500, fontSize: '14px' },
        formatter: (val) =>
          val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val,
      },
    },
    legend: {
      position: 'top',
      fontWeight: 700,
      labels: {
        colors: ['#FF779D', '#f1c40f', '#2ecc71'],
      },
    },
    colors: ['#FF779D', '#f1c40f', '#2ecc71'],
    tooltip: {
      shared: true,
      intersect: false,
      style: { fontSize: '15px' },
    },
    grid: {
      borderColor: '#e5e7eb',
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
    const chart = await ApexCharts.getChartByID('swt-salaries-comparison');
    if (!chart) return;
    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'swt-salaries-comparison.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'swt-salaries-comparison.svg';
        link.click();
      });
    } else if (format === 'csv') {
      const csvRows = [];

      // Header row
      csvRows.push([
        'Date (MMM-YY)',
        'Total Salary Wages Paid',
        'SW Paid for SWT Deduction',
        'Total SWT Tax Deducted',
      ].join(','));

      // Data rows
      for (let i = 0; i < categories.length; i++) {
        csvRows.push([
          categories[i],
          series[0].data[i] ?? 0,
          series[1].data[i] ?? 0,
          series[2].data[i] ?? 0,
        ].join(','));
      }

      // Convert to blob and download
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'swt-salaries-comparison.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">SWT Salaries Comparison</div>
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
          <Chart options={options} series={series} type="area" height={430} />
          : <div
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

export default SwtSalariesChart;
