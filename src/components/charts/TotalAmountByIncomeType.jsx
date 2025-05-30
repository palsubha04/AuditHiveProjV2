import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import citService from '../../services/cit.service';

var data = [
    { source: "718.TAXABLE INCOME", total_amount: 1589320000.0 },
    { source: "710.Current Year Profit / Loss", total_amount: 1457600000.0 },
    { source: "10.Gross sales (cash / credit", total_amount: 1255804000.0 },
    { source: "90. Total Gross Income", total_amount: 856700000.0 },
    { source: "911.Total BPT  INCOME", total_amount: 435200000.0 },
    { source: "20.Other gross income", total_amount: 216000000.0 },
    { source: "15.Dividend income", total_amount: 118000000.0 },
    { source: "300.Non-assessable income", total_amount: 98500000.0 },
    { source: "17.Interest income", total_amount: 74300000.0 },
    { source: "18.Rental income", total_amount: 52800000.0 },
    { source: "310.Net exempt income", total_amount: 33400000.0 },
    { source: "603.s45B Export sales", total_amount: 21000000.0 },
    { source: "19.Royalty income", total_amount: 9700000.0 },
    { source: "543.Unearned revenue", total_amount: 4500000.0 },
    { source: "750.Plus Additional Profits Ta", total_amount: 1200000.0 }
  ];

const TotalAmountByIncomeType = ({ startDate, endDate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const chartOptions = {
        chart: {
          type: 'bar',
          height: 600,
          toolbar: { show: true }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '60%',
          },
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          title: {
            text: 'Amount (in Billion)',
          },
          labels: {
            formatter: (val) => `${(val / 1e9).toFixed(0)}B`
            //formatter: (val) => `${val.toLocaleString()}`
            
          }
        },
        yaxis: {
          labels: {
            style: {
              fontSize: '12px',
            }
          }
        },
        tooltip: {
          y: {
            formatter: (val) => `${val.toLocaleString()}`
            
          }
        },
        title: {
          text: 'Income Types Breakdown',
          align: 'center'
        }
      };
      const [chartData, setChartData] = useState({
        series: [],
        options: chartOptions
      })
      
      useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            setError(null);
            const response = await citService.getTotalAmountByIncomeType(startDate, endDate);
            var chart_Data = response.records
            var chartSeries = [{
                name: 'Total Amount',
                data: chart_Data.map(item => ({
                  x: item.source,
                  y: item.total_amount
                }))
              }]
    
            setChartData(prevData => ({
              ...prevData,
              series: chartSeries
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
          setChartData(prevData => ({
            ...prevData,
            series: []
          }));
        }
      }, [startDate, endDate]);

      if (loading) {
        return (
          <Card className="mb-4 box-background">
            <Card.Body className="d-flex align-items-center justify-content-center" style={{ height: '600px' }}>
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
            <Card.Body className="text-center text-danger" style={{ height: '600px' }}>
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
            <span className='chart-headers'>Total Amount By Income Type</span>
          </Col>
        </Row>
        <Chart options={chartData.options} series={chartData.series} type="bar" height={600} />
      </Card.Body>
    </Card>
  )
}

export default TotalAmountByIncomeType
