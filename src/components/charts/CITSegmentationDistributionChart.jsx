import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { Card, Spinner, Dropdown } from 'react-bootstrap';
import citService from '../../services/cit.service';
import "../../pages/Dashboard.css";
import './charts.css';

const CITSegmentationDistributionChart = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        id: "cit-segmentation-distribution-chart",
        type: "pie",
        height: 350,
        toolbar: {
          show: false,
        },
        stroke: {
          show: true,
          width: 0,
          colors: ["transparent"],
        },
      },
      labels: ["Micro", "Small", "Medium", "Large"],
      colors: ["#6287FF", "#00E096", "#FFD12C", "#FF779D"],
      legend: {
        position: "bottom",
      },
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
              position: "bottom",
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
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await citService.getSegmentationDistribution(startDate, endDate);

        // Process the response data
        const series = [
          response.micro || 0,
          response.small || 0,
          response.medium || 0,
          response.large || 0
        ];

        // Check if all values are zero
        const allZero = series.every(val => val === 0);

        setChartData(prevData => ({
          ...prevData,
          series: allZero ? [] : series
        }));
      } catch (err) {
        console.error('Error fetching segmentation distribution:', err);
        setError('Failed to load segmentation distribution data');
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    } else {
      setLoading(false);
      setChartData(prevData => ({
        ...prevData,
        series: []
      }));
    }
  }, [startDate, endDate]);

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID('cit-segmentation-distribution-chart');
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'cit-segmentation-distribution-chart.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'cit-segmentation-distribution-chart.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'cit-segmentation-distribution-chart',
      });
    }
  };

  if (loading) {
    return (
      <Card className="mb-4 box-background">
        <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
          <span className="chart-headers">Segmentation Distribution</span>
        </Card.Header>
        <Card.Body className="d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-4 box-background">
        <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
          <span className="chart-headers">Segmentation Distribution</span>
        </Card.Header>
        <Card.Body className="text-center text-danger" style={{ height: '400px' }}>
          {error}
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4 box-background">
      <Card.Header className="w-100 chart-card-header d-flex justify-content-between align-items-center">
        <span className="chart-headers">Segmentation Distribution</span>
        <div className="d-flex align-items-center gap-2">
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
        </div>
      </Card.Header>
      <Card.Body>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="pie"
          height={380}
        />
      </Card.Body>
    </Card>
  );
};

export default CITSegmentationDistributionChart; 