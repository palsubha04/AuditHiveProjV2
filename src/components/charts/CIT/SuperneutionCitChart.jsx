import React, { useEffect, useState } from 'react';
import { Card, Dropdown, Placeholder, Spinner } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import citService from '../../../services/cit.service';
import CSVExportButton from '../../CSVExportButton';

const sample = {
  png: 450,
  foreign: 50,
};

const SuperneutionCitChart = ({ startDate, endDate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [records, setRecords] = useState([]);
  const chartOptions = {
    chart: {
      id: 'superneution-cit-chart',
      width: 380,
      type: 'pie',
      toolbar: { show: false },
    },
    legend: {
      position: "bottom",
    },
    labels: ['PNG', 'Foreign'],
    colors:  ["#00E096", "#0095FF"],
    tooltip: {
      custom: function ({ series, seriesIndex, w }) {
        const value = series[seriesIndex];
        const total = series.reduce((acc, val) => acc + val, 0);
        const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
        const label = w.globals.labels[seriesIndex];

        return `
          <div class="arrow_box" style="padding: 8px; line-height: 1.4">
            <span> ${label}</span><br/>
            <span><strong>Value:</strong> ${value.toLocaleString()}</span><br/>
            <span><strong>Percentage:</strong> ${percentage}%</span>
          </div>
        `;
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    noData: {
      text: "No Data Found",
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "#6c757d",
        fontSize: "16px",
        fontFamily: "inherit",
      },
    },
  };
  const [chartData, setChartData] = useState({
    series: [sample.png, sample.foreign],
    options: chartOptions,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await citService.getPngvsForeignData(
          startDate,
          endDate
        );
        // const filteredData = response.map(({ interest_expense_png, interest_expense_foreign, ...rest }) => rest);
        const result = [];

        response.forEach(entry => {
          const { superannuation_png, superannuation_foreign, tax_period_year, records } = entry;

          records.forEach(record => {
            result.push({
              tin: record.tin,
              taxpayer_name: record.taxpayer_name,
              tax_period_year,
              superannuation_png,
              superannuation_foreign
            });
          });
        });
        setRecords(result);
        //var chart_Data = response;
        var superannuation_png = 0;
        var superannuation_foreign = 0;
        for (var i = 0; i < response.length; i++) {
          superannuation_png += response[i].superannuation_png || 0;
          superannuation_foreign += response[i].superannuation_foreign || 0;
        }

        var chartSeries = [
          superannuation_png,
          superannuation_foreign,
        ];


        setChartData((prevData) => ({
          ...prevData,
          series: chartSeries,
        }));
      } catch (err) {
        setError('Failed to load Total Amount By Expense Type data');
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    } else {
      setLoading(false);
      setChartData((prevData) => ({
        ...prevData,
        series: [],
      }));
    }
  }, [startDate, endDate]);

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID('superneution-cit-chart');
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'superneution-cit-chart.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'superneution-cit-chart.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'superneution-cit-chart',
      });
    }
  };

  if (loading) {
    return (
      <Card className="mb-4 box-background">
        <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
          <div className="chart-headers" style={{ height: "30px" }}>
            {/* Placeholder for the chart title */}
            <Placeholder as="span" animation="glow" xs={5} />
          </div>
          {/* Placeholder for the export dropdown */}
        </Card.Header>
        <Card.Body>
          <div
            style={{
              height: 350,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Placeholder
              as="div"
              animation="glow"
              // Set explicit equal width and height for a perfect circle
              style={{
                width: "250px", // Or any desired size, just make sure height matches
                height: "250px",
                borderRadius: "50%",
                backgroundColor: "#d5e6ff",
              }}
            />
          </div>
          <div className="d-flex justify-content-around mt-3">
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4 box-background">
        <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
          <span className="chart-headers">Superannuation PNG vs Foreign</span>
        </Card.Header>
        <Card.Body
          className="text-center text-danger"
          style={{ height: '400px' }}
        >
          {error}
        </Card.Body>
      </Card>
    );
  }
  
  if (!records || records.length === 0) {
    return (
      <Card className="mb-4 box-background">
        <Card.Header className="chart-card-header">
          <span className="chart-headers">Superannuation PNG vs Foreign</span>
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
      </Card>
    );
  }

  return (
    <Card className="mb-4 box-background">
      <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
        <span className="chart-headers">Superannuation PNG vs Foreign</span>
        <div className="d-flex gap-2">
          <Dropdown>
            <Dropdown.Toggle variant="outline-default" size="sm" className='download-dropdown-btn'>
              {/* <Download style={{height : "18px",width:"18px", color:'#5671ff'}}/> */}
              Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleDownload('png')}>Download PNG</Dropdown.Item>
              <Dropdown.Item onClick={() => handleDownload('csv')}>Download CSV</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <CSVExportButton
            records={records}
            filename="superannuation_png_vs_foreign_taxpayers.csv"
            buttonLabel="Download Superannuation PNG vs Foreign Taxpayer List"
          />
        </div>
      </Card.Header>
      <Card.Body>
        
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          height={350}
        />
      </Card.Body>
    </Card>
  );
};

export default SuperneutionCitChart;
