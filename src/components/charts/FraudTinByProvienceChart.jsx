import React, { useState, useEffect } from 'react';
import ApexCharts from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import {
  Card,
  Dropdown,
  Placeholder,
  CardBody,
  CardHeader,
} from 'react-bootstrap';
import gstService from '../../services/gst.service';
import '../../pages/Dashboard.css';
import './charts.css';
// import CSVExportButton from '../CSVExportButton';

const FraudTinByProvienceChart = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        id: 'fraud-tin-by-province-chart',
        height: 350,
        type: 'treemap',
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: ['#fff'],
        },
        formatter: function (val, opts) {
          return opts.w.globals.labels[opts.seriesIndex] + ': ' + val;
        },
      },
      colors: ['#0095FF', '#00E396', '#FEB019', '#FF4560', '#775DD0'],
      legend: {
        show: false,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val ? val.toFixed(0) + ' cases' : '0 cases';
          },
        },
      },
      noData: {
        text: 'No Data Found',
        align: 'center',
        verticalAlign: 'middle',
        style: {
          color: '#6c757d',
          fontSize: '16px',
          fontFamily: 'inherit',
        },
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await gstService.getFraudTinByProvince(
          startDate,
          endDate
        );
        setData(response);

        // Transform data for treemap
        if (response && Object.keys(response).length > 0) {
          const provinces = Object.keys(response);
          //   const fraudTypes = Object.keys(response[provinces[0]] || {});
          let treemapData = [];
          provinces.forEach((province) => {
            treemapData.push({
              x:
                province.charAt(0).toUpperCase() +
                province.slice(1).replace(/_/g, ' '),
              y: response[province]['count'] || 0,
            });
          });
          setChartData((prevState) => ({
            ...prevState,
            series: [{ data: treemapData }],
          }));
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch fraud TIN by province data');
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID('fraud-tin-by-province-chart');
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'fraud-tin-by-province-chart.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'fraud-tin-by-province-chart.svg';
        link.click();
      });
    }
  };

  //   const exportToCSV = () => {
  //     if (!data || Object.keys(data).length === 0) return;

  //     // Prepare CSV data
  //     const provinces = Object.keys(data);
  //     const fraudTypes = Object.keys(data[provinces[0]] || {});

  //     const csvData = [
  //       [
  //         'Province',
  //         ...fraudTypes.map(
  //           (type) =>
  //             type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')
  //         ),
  //       ],
  //       ...provinces.map((province) => [
  //         province.charAt(0).toUpperCase() + province.slice(1).replace(/_/g, ' '),
  //         ...fraudTypes.map((type) => data[province][type] || 0),
  //       ]),
  //     ];

  //     return csvData;
  //   };

  if (loading) {
    return (
      <Card className="mb-4 box-background">
        <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
          <div className="chart-headers" style={{ height: '30px' }}></div>
        </Card.Header>
        <Card.Body>
          <Placeholder as="div" animation="glow" style={{ height: 350 }}>
            <Placeholder
              xs={12}
              style={{
                height: '100%',
                borderRadius: '0.25rem',
                backgroundColor: '#d5e6ff',
              }}
            />
          </Placeholder>
          <div className="d-flex justify-content-around mt-3">
            <Placeholder xs={2} style={{ backgroundColor: '#d5e6ff' }} />
            <Placeholder xs={2} style={{ backgroundColor: '#d5e6ff' }} />
            <Placeholder xs={2} style={{ backgroundColor: '#d5e6ff' }} />
            <Placeholder xs={2} style={{ backgroundColor: '#d5e6ff' }} />
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="box-background">
        <Card.Header className="chart-card-header">
          <span className="chart-headers">
            Fraud TIN Distribution by Province
          </span>
        </Card.Header>
        <Card.Body>
          <div className="text-center text-danger">{error}</div>
        </Card.Body>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="box-background">
        <Card.Header className="chart-card-header">
          <span className="chart-headers">
            Fraud TIN Distribution by Province
          </span>
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
    <Card className="box-background">
      <CardHeader className="chart-card-header d-flex justify-content-between align-items-center">
        <span className="chart-headers">
          Fraud TIN Distribution by Province
        </span>
        <div className="d-flex justify-content-between align-items-center gap-2">
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
              <Dropdown.Item onClick={() => handleDownload('svg')}>
                Download SVG
              </Dropdown.Item>
              {/* <CSVExportButton
                data={exportToCSV()}
                filename="fraud-tin-by-province-data"
                label="Download CSV"
                className="dropdown-item"
              /> */}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </CardHeader>
      <CardBody>
        <div id="chart">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="treemap"
            height={350}
          />
        </div>
      </CardBody>
    </Card>
  );
};

export default FraudTinByProvienceChart;
