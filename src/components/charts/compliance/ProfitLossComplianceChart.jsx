import { Tally1 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { Card, CardBody, CardHeader, Col, Dropdown, Row } from "react-bootstrap";
import CSVExportButton from "../../CSVExportButton";

const entityTypes = ['large', 'medium', 'small', 'micro'];

const ProfitLossComplianceChart = ({ profitLossComplianceData }) => {
  const [selectedCategory, setSelectedCategory] = useState("cit");
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (!profitLossComplianceData || !profitLossComplianceData[selectedCategory]) {
      setChartSeries([]);
      setChartOptions({});
      return;
    }

    const currentData = profitLossComplianceData[selectedCategory];
    const result = Object.entries(
      profitLossComplianceData[selectedCategory]
    ).flatMap(([category, { records }]) =>
      records.map(({ tin, taxpayer_name, tax_period_year, tax_period_month }) => ({
        Tin: tin,
        'Taxpayer Name': taxpayer_name,
        'Tax Period Year': tax_period_year,
        Segmentation: category,
      }))
    );

    setRecords(result);

    const totalSeries = entityTypes.map(
      (type) => currentData[type]?.profit_making_taxpayers ?? 0
    );
    const flaggedSeries = entityTypes.map(
      (type) => currentData[type]?.loss_making_taxpayers ?? 0
    );

    setChartSeries([
      { name: 'Profit', data: totalSeries },
      { name: 'Loss', data: flaggedSeries },
    ]);

    setChartOptions({
      chart: {
        id: 'profit-loss-chart',
        type: 'line',
        height: 350,
        toolbar: { show: false },
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
      colors: ['#2563eb', '#f97316'],
      markers: { size: 5 },
      tooltip: {
        shared: true,
        intersect: false,
        custom: function ({ series, dataPointIndex, w }) {
          const sizeLabel = w.globals.categoryLabels[dataPointIndex];
          const total = series[0]?.[dataPointIndex] ?? 0;
          const flagged = series[1]?.[dataPointIndex] ?? 0;

          return `
            <div style="padding: 8px 12px;">
              <strong>${sizeLabel}</strong><br/>
              Total Taxpayers: ${total}<br/>
              Risk-Flagged: ${flagged}<br/>
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
  }, [selectedCategory, profitLossComplianceData]);

  const isDataAvailable = profitLossComplianceData && profitLossComplianceData[selectedCategory];

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID('profit-loss-chart');
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'profit-loss-chart.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'profit-loss-chart.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'profit-loss-chart',
      });
    }
  };

  if (!records || records.length === 0) {
    return (
      <>
        <Card.Header className="chart-card-header">
          <span className="chart-headers">Profit vs Loss</span>
        </Card.Header>
        <Card.Body>
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
        </Card.Body>
      </>
    );
  }

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center gap-2">
            <span className="chart-headers">Profit vs Loss</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='chart-filter'
            >
              <option value="gst">GST</option>
              <option value="swt">SWT</option>
              <option value="cit">CIT</option>
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-default" size="sm" className='download-dropdown-btn'>
                Export
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleDownload('png')}>Download PNG</Dropdown.Item>
                <Dropdown.Item onClick={() => handleDownload('csv')}>Download CSV</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <CSVExportButton
              records={records}
              filename="profit_loss_taxpayers.csv"
              buttonLabel="Download Profit vs Loss Taxpayer List"
            />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={400}
        />
      </CardBody>
    </>
  );
};

export default ProfitLossComplianceChart;
