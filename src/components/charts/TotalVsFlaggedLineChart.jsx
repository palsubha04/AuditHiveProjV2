import { useState, useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts'; // Added useRef
import ReactApexChart from 'react-apexcharts';
import './charts.css';
// import CSVExportButton from '../CSVExportButton';
import { CardBody, CardHeader, Dropdown } from 'react-bootstrap';
// import { Menu } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState('gst');
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [records, setRecords] = useState([]);
  const [showMenu, setShowMenu] = useState(false); // State for menu visibility // Ref for ApexChart

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
        records.map(
          ({ tin, taxpayer_name, tax_period_year, tax_period_month }) => ({
            Tin: tin,
            'Taxpayer Name': taxpayer_name,
            'Tax Period Year': tax_period_year,
            'Tax Period Month': monthMap[tax_period_month] || tax_period_month,
            Segmentation: category,
          })
        )
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
        id: 'total-taxpayers-vs-risk-flagged',
        type: 'line',
        height: 350,
        toolbar: {
          show: false, // Keep this true if you want default toolbar, or manage custom exports
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
      legend: { position: 'bottom' },
      colors: ['#347AE2', '#FF779D'],
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
              <span style="color:#FF779D;">Risk Percentage: ${percent}%</span>
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

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID(
      'total-taxpayers-vs-risk-flagged'
    );
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'total-taxpayers-vs-risk-flagged.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'total-taxpayers-vs-risk-flagged.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'total-taxpayers-vs-risk-flagged',
      });
    }
  };
  if (!records || records.length === 0) {
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
        <div className="d-flex align-items-center gap-2">
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
          <CSVExportButton
            records={records}
            filename="risk_taxpayers.csv"
            buttonLabel="Download Risk Taxpayer List"
          />
        </div>
      </CardHeader>
        <CardBody>
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
        </CardBody>
        </>
    );
  }

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
        <div className="d-flex align-items-center gap-2">
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
          <CSVExportButton
            records={records}
            filename="risk_taxpayers.csv"
            buttonLabel="Download Risk Taxpayer List"
          />
        </div>
      </CardHeader>
      <CardBody>
        <ReactApexChart
          // ref={chartRef} // Assign ref here
          options={chartOptions}
          series={chartSeries}
          type="line"
        />
      </CardBody>
    </>
  );
};

export default TotalVsFlaggedLineChart;
