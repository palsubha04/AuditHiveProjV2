import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { Card, Spinner, Dropdown, Placeholder } from 'react-bootstrap';
import swtService from '../../services/swt.service';
import "../../pages/Dashboard.css";
import './charts.css'

const SWTSalesComparison = ({ startDate, endDate }) => {
  
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [
      {
        name: 'Employees on Payroll',
        data: []
      },
      {
        name: 'Employees Paid SWT',
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
        const response = await swtService.getEmployeesComparison(startDate, endDate);

        // Process the response data
        const categories = [];
        const payrollData = [];
        const swtData = [];

        response.records.forEach(record => {
          record.monthly_summary.forEach(summary => {
            const date = new Date(record.year, summary.month - 1);
            categories.push(date.toLocaleString('default', { month: 'short', year: 'numeric' }));
            payrollData.push(summary.employees_on_payroll);
            swtData.push(summary.employees_paid_swt);
          });
        });

        setChartData({
          xAxis: categories,
          series: [
            {
              name: 'Employees on Payroll',
              data: payrollData
            },
            {
              name: 'Employees Paid SWT',
              data: swtData
            }
          ]
        });
      } catch (err) {
        setError('Failed to load employees comparison data');
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
            name: 'Employees on Payroll',
            data: []
          },
          {
            name: 'Employees Paid SWT',
            data: []
          }
        ]
      });
    }
  }, [startDate, endDate]);

  const chartOptions = {
    chart: {
      id: 'employees-comparison-chart',
      type: 'line',
      height: 350,
      toolbar: {
        show: false
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
        text: 'Number of Employees'
      }
    },
    tooltip: {
      shared: true,
      intersect: false
    },
    colors: ['#2E86C1', '#27AE60'],
    legend: {
      position: 'bottom'
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

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID('employees-comparison-chart');
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'employees-comparison-chart.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'employees-comparison-chart.svg';
        link.click();
      });
    } else if (format === 'csv') {
      const headers = ['Date [MMM-YYYY]', 'Employees on Payroll', 'Employees Paid SWT'];

    const rows = chartData.xAxis.map((month, index) => [
      month,
      chartData.series[0]?.data[index] ?? 0,
      chartData.series[1]?.data[index] ?? 0,
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
    link.download = 'employees-comparison-chart.csv';
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
            <span className="chart-headers">Employees Comparison</span>
          </div>
        </Card.Header>
        <Card.Body className="text-center text-danger" style={{ height: '350px' }}>
          {error}
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4 box-background">
      <Card.Header className="chart-card-header">
        <div className="align-items-center d-flex justify-content-between w-100">
          <span className="chart-headers">Employees Comparison</span>
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

export default SWTSalesComparison; 