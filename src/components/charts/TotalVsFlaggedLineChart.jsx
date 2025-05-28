import { useState, useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts'; // Added useRef
import ReactApexChart from 'react-apexcharts';
import './charts.css';
// import CSVExportButton from '../CSVExportButton';
import { CardBody, CardHeader } from 'react-bootstrap';
import { Menu } from 'lucide-react';
import CSVExportButton from '../CSVExportButton';

const entityTypes = ['large', 'medium', 'small', 'micro'];

const monthMap = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

const TotalVsFlaggedLineChart = ({ totalTaxPayerVsRiskFlagged }) => {
  console.log('TotalVsFlaggedLineChart from chart', totalTaxPayerVsRiskFlagged);
  const [selectedCategory, setSelectedCategory] = useState('gst');
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [records, setRecords] = useState([]);
  const [showMenu, setShowMenu] = useState(false); // State for menu visibility
  const chartRef = useRef(null); // Ref for ApexChart

  useEffect(() => {
    if (
      !totalTaxPayerVsRiskFlagged ||
      !totalTaxPayerVsRiskFlagged[selectedCategory]
    ) {
      setChartSeries([]);
      setChartOptions({});
      return;
    }

    const currentData = totalTaxPayerVsRiskFlagged[selectedCategory];

    const result = Object.entries(currentData).flatMap(
      ([category, { records }]) =>
      records.map(({ tin, taxpayer_name, tax_period_year, tax_period_month }) => ({
        Tin: tin,
        'Taxpayer Name': taxpayer_name,
        'Tax Period Year': tax_period_year,
        'Tax Period Month': monthMap[tax_period_month] || tax_period_month,
        Segmentation: category,
      }))
    );
    setRecords(result);

    const totalSeries = entityTypes.map(
      (type) => currentData[type]?.total_taxpayers ?? 0
    );
    const flaggedSeries = entityTypes.map(
      (type) => currentData[type]?.risk_flagged_taxpayers ?? 0
    );
    const riskPercentages = entityTypes.map(
      (type) => currentData[type]?.risk_flagged_percentage ?? 0
    );

    setChartSeries([
      { name: 'Total Taxpayers', data: totalSeries },
      { name: 'Risk-Flagged Taxpayers', data: flaggedSeries },
    ]);

    setChartOptions({
      chart: {
        id: 'total-vs-flagged-chart',
        type: 'line',
        height: 350,
        toolbar: {
          show: false, // Keep this true if you want default toolbar, or manage custom exports
          tools: {
            download: false, // Disable default download if using custom menu
            zoomin: false,
            zoomout: false,
            zoom: false,
            pan: false,
            reset: false,
          },
        },
      },
      stroke: {
        width: 3,
        curve: 'smooth',
      },
      xaxis: {
        categories: ['Large', 'Medium', 'Small', 'Micro'],
        title: { text: 'Segmentation' },
        labels: {
          style: { fontWeight: 500, color: '#334155', fontSize: '14px' },
        },
      },
      yaxis: {
        title: { text: 'Number of Taxpayers' },
        labels: { style: { fontWeight: 500, color: '#334155' } },
      },
      legend: { position: 'top', fontWeight: 600 },
      colors: ['#2563eb', '#f97316'],
      markers: { size: 5 },
      tooltip: {
        shared: true,
        intersect: false,
        custom: function ({ series, dataPointIndex, w }) {
          const sizeLabel = w.globals.categoryLabels[dataPointIndex];
          const total = series[0]?.[dataPointIndex] ?? 0;
          const flagged = series[1]?.[dataPointIndex] ?? 0;
          const percent = riskPercentages?.[dataPointIndex] ?? 0;

          return `
            <div style="padding: 8px 12px;">
              <strong>${sizeLabel}</strong><br/>
              Total Taxpayers: ${total}<br/>
              Risk-Flagged: ${flagged}<br/>
              <span style="color:#f97316;">Risk Percentage: ${percent}%</span>
            </div>
          `;
        },
        style: { fontSize: '15px' },
      },
      grid: { borderColor: '#e0e7ef', strokeDashArray: 4 },
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
    });
  }, [selectedCategory, totalTaxPayerVsRiskFlagged]);

  const toggleMenu = () => setShowMenu(!showMenu);

  const handleExport = async (format) => {
    const chart = await ApexCharts.getChartByID('total-vs-flagged-chart');
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'total-vs-flagged-chart.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'total-vs-flagged-chart.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'total-vs-flagged-data',
      });
    }
  };

  // Logic for CSVExportButton if you want to use the `records` data
  const handleRecordsCSVExport = () => {
    // This is a placeholder for how you might trigger the CSV export for `records`
    // You would typically use a library like 'papaparse' or a custom function
    // to convert `records` (JSON) to CSV and trigger a download.
    // For now, let's simulate the CSVExportButton's functionality if it were a direct function call.
    if (records.length > 0) {
      const header = Object.keys(records[0]).join(',');
      const csv = records.map((row) => Object.values(row).join(',')).join('\n');
      const csvData = `\uFEFF${header}\n${csv}`;
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'total_vs_flagged_data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
    setShowMenu(false);
  };

  const isDataAvailable =
    totalTaxPayerVsRiskFlagged && totalTaxPayerVsRiskFlagged[selectedCategory];

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="d-flex">
          <span className="chart-headers">Total Taxpayers vs Risk-Flagged</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="chart-filter"
          >
            <option value="gst">GST</option>
            <option value="swt">SWT</option>
            <option value="cit">CIT</option>
          </select>
        </div>
        <CSVExportButton
          records={records}
          filename="risk_taxpayers.csv"
          buttonLabel="Download Risk Taxpayer List"
        />
        <div style={{ position: 'relative' }}>
          {' '}
          {/* Container for menu positioning */}
          <Menu onClick={toggleMenu} style={{ cursor: 'pointer' }} />
          {showMenu && (
            <div
              style={{
                position: 'absolute',
                top: '100%', // Position below the icon
                right: 0,
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                zIndex: 1000, // Ensure it's above other elements
                minWidth: '150px',
              }}
            >
              <ul style={{ listStyle: 'none', margin: 0, padding: '5px 0' }}>
                <li
                  onClick={() => handleExport('svg')}
                  style={{ padding: '8px 15px', cursor: 'pointer' }}
                  className="chart-menu-item"
                >
                  Download SVG
                </li>
                <li
                  onClick={() => handleExport('png')}
                  style={{ padding: '8px 15px', cursor: 'pointer' }}
                  className="chart-menu-item"
                >
                  Download PNG
                </li>
                <li
                  onClick={handleRecordsCSVExport} // Use this for your 'records' data
                  // onClick={() => handleExport('csv')} // Use this for ApexCharts internal CSV export
                  style={{ padding: '8px 15px', cursor: 'pointer' }}
                  className="chart-menu-item"
                >
                  Download CSV
                </li>
              </ul>
            </div>
          )}
        </div>
      </CardHeader>
      <CardBody>
        <ReactApexChart
          ref={chartRef} // Assign ref here
          options={chartOptions}
          series={chartSeries}
          type="line"
        />
      </CardBody>
      {/* <EmployeeLineChart options={chartOptions} series={chartSeries} /> */}
      {/* {isDataAvailable ? (
        <EmployeeLineChart options={chartOptions} series={chartSeries} />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
          No data available for the selected category.
        </div>
      )} */}
    </>
  );
};

export default TotalVsFlaggedLineChart;
