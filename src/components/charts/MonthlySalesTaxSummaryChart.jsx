import { CardBody, CardHeader, Dropdown } from 'react-bootstrap';
import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { format, addMonths, isBefore } from 'date-fns';
import './charts.css';

const parseDDMMYYYY = (str) => {
  const [day, month, year] = str.split('-');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const MonthlySalesTaxSummaryChart = ({ salesData, start_date, end_date }) => {
  // Parse dates safely
  const startDate = start_date ? parseDDMMYYYY(start_date) : null;
  const endDate = end_date ? parseDDMMYYYY(end_date) : null;


  // Early return if dates aren't ready
  if (!startDate || !endDate) {
    return <div>Please provide valid start and end dates.</div>;
  }

  // Generate all month labels between start_date and end_date
  const generateMonthLabels = (start, end) => {
    const labels = [];
    let current = new Date(start);
    while (
      isBefore(current, end) ||
      (current.getMonth() === end.getMonth() &&
        current.getFullYear() === end.getFullYear())
    ) {
      labels.push(format(current, 'MMM yy')); // "Jan 22"
      current = addMonths(current, 1);
    }
    return labels;
  };

  const monthLabels = generateMonthLabels(startDate, endDate);

  // Create a map of data by "MMM yy" → entry
  const createMonthDataMap = (data = []) => {
    const map = {};
    data.forEach((yearData) => {
      const { year, monthly_summary = [] } = yearData;
      monthly_summary.forEach((entry) => {
        const date = new Date(year, entry.month);
        const label = format(date, 'MMM yy');
        map[label] = entry;
      });
    });
    return map;
  };

  const monthDataMap = createMonthDataMap(salesData?.records);

  const getSeriesData = (key) =>
    monthLabels.map((label) => monthDataMap[label]?.[key] ?? 0);

  const chartSeries = [
    {
      name: 'Sales Income',
      data: getSeriesData('total_sales_income'),
    },
    {
      name: 'Taxable Sales',
      data: getSeriesData('gst_taxable_sales'),
    },
    {
      name: 'Zero Rated Sales',
      data: getSeriesData('zero_rated_sales'),
    },
    {
      name: 'Exempt Sales',
      data: getSeriesData('exempt_sales'),
    },
  ];

  const chartOptions = {
    chart: {
      id: 'gst-sales-comparison',
      type: 'line',
      toolbar: { show: false },
    },
    stroke: {
      width: [3, 3, 2, 2],
      curve: 'smooth',
    },
    xaxis: {
      categories: monthLabels,
      title: { text: 'Month' },
    },
    yaxis: {
      labels: {
        formatter: (val) =>
          val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val,
      },
    },
    legend: {
      position: 'top',
    },
    colors: ["#6287FF", "#00E096", "#FFD12C", "#FF779D"],
    noData: {
      text: 'No Data Found',
      align: 'center',
      verticalAlign: 'middle',
      style: {
        color: '#6c757d',
        fontSize: '16px',
        fontFamily: 'inherit',
      },
    },
  };

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID('gst-sales-comparison');
    if (!chart) return;
    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'gst-sales-comparison.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'gst-sales-comparison.svg';
        link.click();
      });
    } else if (format === 'csv') {
      const csvRows = [];

      // Header row
      const headers = ['Date (MMM-YY)', ...chartSeries.map((s) => s.name)];
      csvRows.push(headers.join(','));

      // Row data
      for (let i = 0; i < monthLabels.length; i++) {
        const row = [monthLabels[i]];
        chartSeries.forEach((series) => {
          row.push(series.data[i] ?? 0);
        });
        csvRows.push(row.join(','));
      }

      // Convert to CSV and trigger download
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'gst-sales-comparison.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">GST Sales Comparison</div>
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
        {salesData?.records?.length > 0 ?
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="line"
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

export default MonthlySalesTaxSummaryChart;
