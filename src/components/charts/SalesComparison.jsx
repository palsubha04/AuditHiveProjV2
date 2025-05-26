import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, Row, Col } from 'react-bootstrap';
import gstService from '../../services/gst.service';
import '../../pages/Dashboard.css';
import './charts.css';

const SalesComparison = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [
      {
        name: 'Total Sales Income',
        data: [],
      },
      {
        name: 'Exempt Sales',
        data: [],
      },
      {
        name: 'Zero Rated Sales',
        data: [],
      },
      {
        name: 'GST Taxable Sales',
        data: [],
      },
    ],
  });

  const colors = ['#347AE2', '#FF779D', '#FFD12C', '#20E5F3'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await gstService.getSalesComparison(
          startDate,
          endDate
        );

        // Process the response data
        const categories = [];
        const totalSalesData = [];
        const exemptSalesData = [];
        const zeroRatedSalesData = [];
        const gstTaxableSalesData = [];

        response.records.forEach((record) => {
          record.monthly_summary.forEach((summary) => {
            const date = new Date(record.year, summary.month - 1);
            categories.push(
              date.toLocaleString('default', {
                month: 'short',
                year: 'numeric',
              })
            );
            totalSalesData.push(summary.total_sales_income);
            exemptSalesData.push(summary.exempt_sales);
            zeroRatedSalesData.push(summary.zero_rated_sales);
            gstTaxableSalesData.push(summary.gst_taxable_sales);
          });
        });

        // Check if all values are zero
        const allZero =
          totalSalesData.every((val) => val === 0) &&
          exemptSalesData.every((val) => val === 0) &&
          zeroRatedSalesData.every((val) => val === 0) &&
          gstTaxableSalesData.every((val) => val === 0);

        setChartData({
          xAxis: categories,
          series: allZero
            ? []
            : [
                {
                  name: 'Total Sales Income',
                  data: totalSalesData,
                },
                {
                  name: 'Exempt Sales',
                  data: exemptSalesData,
                },
                {
                  name: 'Zero Rated Sales',
                  data: zeroRatedSalesData,
                },
                {
                  name: 'GST Taxable Sales',
                  data: gstTaxableSalesData,
                },
              ],
        });
      } catch (error) {
        console.error('Error fetching sales comparison data:', error);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const chartOptions = {
    chart: {
      type: 'line',
      height: 350,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: chartData.xAxis,
    },
    yaxis: {
      title: {
        text: 'Amount (PGK)',
      },
      labels: {
        formatter: (value) =>
          `PGK ${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
    },
    tooltip: {
      y: {
        formatter: (value) =>
          `PGK ${value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
    },
    colors: colors,
    legend: {
      position: 'bottom',
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

  return (
    <Card className="mb-4 box-background">
      <Card.Header className="chart-card-header">
        <span className="chart-headers">Sales Comparison</span>
      </Card.Header>
      <Card.Body>
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

export default SalesComparison;
