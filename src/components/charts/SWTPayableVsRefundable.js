import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import swtService from '../../services/swt.service';
import "../../pages/Dashboard.css";
import './charts.css'

const SWTPayableVsRefundable = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [
      {
        name: 'Total Salary Wages Paid',
        data: []
      },
      {
        name: 'Salary Wages Paid for SWT Deduction',
        data: []
      },
      {
        name: 'Total SWT Tax Deducted',
        data: []
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await swtService.getSalariesComparison(startDate, endDate);
        
        // Process the response data
        const categories = [];
        const totalSalaryData = [];
        const swtDeductionData = [];
        const taxDeductedData = [];

        response.records.forEach(record => {
          record.monthly_summary.forEach(summary => {
            const date = new Date(record.year, summary.month - 1);
            categories.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
            totalSalaryData.push(summary.total_salary_wages_paid);
            swtDeductionData.push(summary.sw_paid_for_swt_deduction);
            taxDeductedData.push(summary.total_swt_tax_deducted);
          });
        });

        setChartData({
          xAxis: categories,
          series: [
            {
              name: 'Total Salary Wages Paid',
              data: totalSalaryData
            },
            {
              name: 'Salary Wages Paid for SWT Deduction',
              data: swtDeductionData
            },
            {
              name: 'Total SWT Tax Deducted',
              data: taxDeductedData
            }
          ]
        });
        console.log('try');
      } catch (err) {
        console.log('catch');
        console.error('Error fetching salaries comparison:', err);
        setError('Failed to load salaries comparison data');
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    } else {
      setLoading(false);
      setChartData({
        xAxis: [],
        series: [
          {
            name: 'Total Salary Wages Paid',
            data: []
          },
          {
            name: 'Salary Wages Paid for SWT Deduction',
            data: []
          },
          {
            name: 'Total SWT Tax Deducted',
            data: []
          }
        ]
      });
    }
  }, [startDate, endDate]);

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      categories: chartData.xAxis,
      labels: {
        rotate: -45
      }
    },
    yaxis: {
      title: {
        text: 'Amount (K)'
      },
      labels: {
        formatter: (value) => `K${(value / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
    },
    tooltip: {
      y: {
        formatter: (value) => `K${(value / 1000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
    },
    colors: ['#2E86C1', '#27AE60', '#E74C3C'],
    legend: {
      position: 'top'
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
        fontFamily: 'inherit'
      }
    }
  };

  if (loading) {
    return (
      <Card className="mb-4 box-background">
        <Card.Body className="d-flex align-items-center justify-content-center" style={{ height: '350px' }}>
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
        <Card.Body className="text-center text-danger" style={{ height: '350px' }}>
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
            <h5 className="card-title">Salaries Comparison</h5>
          </Col>
        </Row>
        <ReactApexChart
          options={chartOptions}
          series={chartData.series}
          type="line"
          height={350}
        />
      </Card.Body>
    </Card>
  );
};

export default SWTPayableVsRefundable; 