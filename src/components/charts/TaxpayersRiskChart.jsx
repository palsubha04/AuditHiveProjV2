import { CardBody, CardHeader, Dropdown } from 'react-bootstrap';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
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

const TaxpayersRiskChart = ({ data, start_date, end_date }) => {
  const startDate = start_date ? parseDDMMYYYY(start_date) : null;
  const endDate = end_date ? parseDDMMYYYY(end_date) : null;

  if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
    return <div>Invalid date range</div>;
  }

  const categories = generateMonthLabels(startDate, endDate);

  const gstPayableData = getMonthlyValues(
    data?.records || [],
    'gst_payable',
    categories
  );
  const gstRefundableData = getMonthlyValues(
    data?.records || [],
    'gst_refundable',
    categories
  );

  const series = [
    {
      name: 'GST Payable',
      data: gstPayableData,
    },
    {
      name: 'GST Refundable',
      data: gstRefundableData,
    },
  ];

  const options = {
    chart: {
      id: 'taxpayers-risk',
      type: 'bar',
      toolbar: { show: false },
      background: 'transparent',
    },
    zoom: {
      enabled: true,
      type: 'x', // Options: 'x', 'y', 'xy'
      autoScaleYaxis: true, // Automatically scale Y-axis on zoom
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '90%',
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    colors: ['#5B5FF6', '#7DD3FC'],
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: '14px',
          colors: '#A3A3C2',
        },
      },
      axisBorder: { show: true, color: '#e0e7ef' },
      axisTicks: { show: true, color: '#e0e7ef' },
      position: 'bottom',
    },
    yaxis: {
      labels: {
        formatter: (val) => `${Math.round(val / 1000)}K`,
        style: {
          fontSize: '14px',
          colors: '#A3A3C2',
        },
      },
      min: 0,
      max: Math.max(...gstPayableData, ...gstRefundableData) * 1.1,
      tickAmount: 4,
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      markers: { radius: 12 },
      labels: {
        colors: ['#5B5FF6', '#7DD3FC'],
      },
    },
    tooltip: {
      y: {
        formatter: (val) =>
          `${val.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`,
      },
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        const taxType = categories[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        const label = seriesIndex === 0 ? 'GST Payable' : 'GST Refundable';
        return `<div style="padding:10px 16px;background:#45457A;color:#fff;border-radius:10px;box-shadow:0 2px 8px #0002;">
          <div style="font-size:15px;font-weight:500;">${taxType} - ${label}</div>
          <div style="font-size:18px;font-weight:600;">${value.toLocaleString(
          'en-US'
        )}</div>
        </div>`;
      },
    },
    grid: {
      borderColor: '#E5E7EB',
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
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
    const chart = await ApexCharts.getChartByID('taxpayers-risk');
    if (!chart) return;
    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'taxpayers-risk.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'taxpayers-risk.svg';
        link.click();
      });
    } else if (format === 'csv') {
      // Generate CSV with 'Date (MMM-YY)' header
      const csvRows = [];

      // Header row
      const headers = ['Date (MMM-YY)', 'GST Payable', 'GST Refundable'];
      csvRows.push(headers.join(','));

      // Data rows
      for (let i = 0; i < categories.length; i++) {
        const row = [
          categories[i],
          series[0].data[i] ?? 0,
          series[1].data[i] ?? 0,
        ];
        csvRows.push(row.join(','));
      }

      // Convert to CSV and trigger download
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'taxpayers-risk.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">Taxpayers Risk</div>
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
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={430}
          />
          :
          <div
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

export default TaxpayersRiskChart;
