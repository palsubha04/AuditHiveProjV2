import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import citService from '../../services/cit.service';
import "../../pages/Dashboard.css";
import './charts.css';

const CITSegmentationDistributionChart = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "pie",
        height: 350,
        toolbar: {
          show: true,
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

  if (loading) {
    return (
      <Card className="mb-4 box-background">
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
        <Card.Body className="text-center text-danger" style={{ height: '400px' }}>
          {error}
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4 box-background">
      <Card.Body>
        <Row className="mb-4">
          <Col>
            <span className='chart-headers'>Segmentation Distribution</span>
          </Col>
        </Row>
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