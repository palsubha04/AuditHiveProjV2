import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { Card, Spinner, Dropdown, Placeholder } from 'react-bootstrap';
import swtService from '../../services/swt.service';
import '../../pages/Dashboard.css';
import './charts.css';

const SWTPayableVsRefundable = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [
      {
        name: 'Total Salary Wages Paid',
        data: [],
      },
      {
        name: 'Salary Wages Paid for SWT Deduction',
        data: [],
      },
      {
        name: 'Total SWT Tax Deducted',
        data: [],
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await swtService.getSalariesComparison(
          startDate,
          endDate
        );

        // Process the response data
        const categories = [];
        const totalSalaryData = [];
        const swtDeductionData = [];
        const taxDeductedData = [];

        response.records.forEach((record) => {
          record.monthly_summary.forEach((summary) => {
            const date = new Date(record.year, summary.month - 1);
            categories.push(
              date.toLocaleString('default', {
                month: 'short',
                year: 'numeric',
              })
            );
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
              data: totalSalaryData,
            },
            {
              name: 'Salary Wages Paid for SWT Deduction',
              data: swtDeductionData,
            },
            {
              name: 'Total SWT Tax Deducted',
              data: taxDeductedData,
            },
          ],
        });
      } catch (err) {
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
            data: [],
          },
          {
            name: 'Salary Wages Paid for SWT Deduction',
            data: [],
          },
          {
            name: 'Total SWT Tax Deducted',
            data: [],
          },
        ],
      });
    }
  }, [startDate, endDate]);

  const chartOptions = {
    chart: {
      id: 'salaries-comparison-chart',
      type: 'line',
      height: 350,
      toolbar: {
        show: false,
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
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      title: {
        text: 'Amount (PGK)',
      },
      labels: {
        formatter: (value) =>
          `PGK ${(value / 1000).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
    },
    tooltip: {
      y: {
        formatter: (value) =>
          `PGK ${(value / 1000).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
    },
    colors: ['#2E86C1', '#27AE60', '#E74C3C'],
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

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID('salaries-comparison-chart');
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'salaries-comparison-chart.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'salaries-comparison-chart.svg';
        link.click();
      });
    } else if (format === 'csv') {
      const headers = [
        'Date [MMM-YY]',
        'Total Salary Wages Paid',
        'Salary Wages Paid for SWT Deduction',
        'Total SWT Tax Deducted',
      ];
  
      const rows = chartData.xAxis.map((month, index) => [
        month,
        chartData.series[0]?.data[index] ?? 0,
        chartData.series[1]?.data[index] ?? 0,
        chartData.series[2]?.data[index] ?? 0,
      ]);
  
      const csvContent = [headers, ...rows]
        .map(row =>
          row
            .map(cell =>
              typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
            )
            .join(',')
        )
        .join('\n');
  
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'salaries-comparison-chart.csv';
      link.click();
    }
  };

  if (loading) {
    return (
      <Card className="mb-4 box-background">
        <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
          <div className="chart-headers" style={{ height: "30px" }}></div>
        </Card.Header>
        <Card.Body>
          <Placeholder as="div" animation="glow" style={{ height: 350 }}>
            <Placeholder
              xs={12}
              style={{
                height: "100%",
                borderRadius: "0.25rem",
                backgroundColor: "#d5e6ff",
              }}
            />
          </Placeholder>
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
        <Card.Header className="chart-card-header">
          <div className="align-items-center d-flex justify-content-between w-100">
            <span className="chart-headers">Salaries Comparison</span>
          </div>
        </Card.Header>
        <Card.Body
          className="text-center text-danger"
          style={{ height: '350px' }}
        >
          {error}
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4 box-background">
      <Card.Header className="chart-card-header">
        <div className="align-items-center d-flex justify-content-between w-100">
          <span className="chart-headers">Salaries Comparison</span>
        </div>
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
