import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import analyticsService from '../../services/analytics.service';
import '../../pages/Dashboard.css';
import './charts.css'
import CSVExportButton from '../CSVExportButton';

const RiskCategoriesChart = ({ startDate, endDate, taxType }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(null);
  const [records, setRecords] = useState([]);

  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        stackType: '100%',
        toolbar: {
          show: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '40%',
          endingShape: 'rounded',
          borderRadius: 20,
          dataLabels: {
            position: 'center',
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val > 0 ? `${val.toFixed(1)}%` : '';
        },
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: ['#fff'],
        },
        offsetY: 0,
        background: {
          enabled: false,
        },
        dropShadow: {
          enabled: true,
          opacity: 0.3,
          blur: 3,
          left: -2,
          top: 2,
        },
      },
      stroke: {
        show: true,
        width: 0,
        colors: ['transparent'],
      },
      xaxis: {
        categories: ['Micro', 'Small', 'Medium', 'Large'],
        title: {
          text: 'Segmentation',
        },
        labels: {
          style: {
            fontSize: '12px',
          },
        },
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: true,
        },
      },
      yaxis: {
        title: {
          text: 'Percentage of Taxpayers',
        },
        labels: {
          formatter: function (val) {
            return `${val}%`;
          },
        },
        min: 0,
        max: 100,
        tickAmount: 5,
      },
      fill: {
        opacity: 1,
        colors: ['#00E096', '#FF779D'],
        type: 'solid',
      },
      grid: {
        show: true,
        borderColor: '#f1f1f1',
        strokeDashArray: 4,
        position: 'back',
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        offsetY: 0,
      },
      tooltip: {
        y: {
          formatter: function (val, { seriesIndex, dataPointIndex }) {
            const segment = ['micro', 'small', 'medium', 'large'][
              dataPointIndex
            ];
            const data = rawData[segment];
            let actual = 0;
            let percent = 0;
            if (seriesIndex === 0) {
              // Non-Risk Flagged
              actual = data.total_taxpayers - data.risk_flagged_taxpayers;
              percent = 100 - data.risk_flagged_percentage;
            } else {
              // Risk Flagged
              actual = data.risk_flagged_taxpayers;
              percent = data.risk_flagged_percentage;
            }
            return `${percent.toFixed(
              2
            )}% (${actual.toLocaleString()} taxpayers)`;
          },
        },
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
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await analyticsService.getTotalVsFlaggedTaxpayers(
          startDate,
          endDate
        );

        if (!response || !response[taxType]) {
          setChartData((prevData) => ({
            ...prevData,
            series: [],
          }));
          return;
        }

        setRawData(response[taxType]);
        // const currentData = response[taxType];
        // let temp = [];
        // for (let i in currentData) {
        //   temp.push(...currentData[i].records);
        // }
        // setRecords(temp);
        const currentData = response[taxType];
        let temp = [];
        const result = Object.entries(currentData).flatMap(([category, { records }]) =>
          records.map(({ tin, taxpayer_name }) => ({
            Tin: tin,
            "Taxpayer Name": taxpayer_name,
            Segmentation: category,
          }))
        );
        for (let i in currentData) {
          temp.push(...currentData[i].records);
          temp = temp.map(item => { return { ...item, category: i } })
        }
        setRecords(result);

        const segments = ['micro', 'small', 'medium', 'large'];
        const series = [
          {
            name: 'Non-Risk Flagged',
            data: segments.map((segment) => {
              const data = response[taxType][segment];
              const nonFlagged =
                data.total_taxpayers - data.risk_flagged_taxpayers;
              return nonFlagged;
            }),
          },
          {
            name: 'Risk Flagged',
            data: segments.map((segment) => {
              const data = response[taxType][segment];
              return data.risk_flagged_taxpayers;
            }),
          },
        ];

        setChartData((prevData) => ({
          ...prevData,
          series: series,
          options: {
            ...prevData.options,
            tooltip: {
              y: {
                formatter: function (val, { seriesIndex, dataPointIndex }) {
                  const segment = ['micro', 'small', 'medium', 'large'][
                    dataPointIndex
                  ];
                  const data = response[taxType][segment];

                  if (seriesIndex === 0) {
                    // Non-Risk Flagged
                    const percentage = (
                      100 - data.risk_flagged_percentage
                    ).toFixed(2);
                    return `${percentage}% (${val.toLocaleString()} taxpayers)`;
                  } else {
                    // Risk Flagged
                    const percentage = data.risk_flagged_percentage.toFixed(2);
                    return `${percentage}% (${val.toLocaleString()} taxpayers)`;
                  }
                },
              },
            },
          },
        }));
      } catch (err) {
        console.error('Error fetching risk categories:', err);
        setError('Failed to load risk categories data');
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
  }, [startDate, endDate, taxType]);

  // Add a useEffect to monitor rawData changes
  // useEffect(() => {
  //   console.log('rawData changed:', rawData);
  // }, [rawData]);

  // // Add a useEffect to monitor chartData changes
  // useEffect(() => {
  //   console.log('chartData changed:', chartData);
  // }, [chartData]);

  if (loading) {
    return (
      <Card className="mb-4 box-background">
        <Card.Header className="chart-card-header">
          <span className="chart-headers">Risk Flagged vs Non-Risk Flagged Taxpayers</span>
        </Card.Header>
        <Card.Body
          className="d-flex align-items-center justify-content-center"
          style={{ height: '470px' }}
        >
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
        <Card.Header className="chart-card-header">
          <span className="chart-headers">Risk Flagged vs Non-Risk Flagged Taxpayers</span>
        </Card.Header>
        <Card.Body
          className="text-center text-danger"
          style={{ height: '430px' }}
        >
          {error}
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mb-4 box-background">
      <Card.Header className="chart-card-header">
        <div className='d-flex align-items-center justify-content-between'>
          <span className="chart-headers">Risk Flagged vs Non-Risk Flagged Taxpayers</span>
          <CSVExportButton
            records={records}
            filename="risk_taxpayers.csv"
            buttonLabel="Download Risk Taxpayers List"
          />
        </div>
      </Card.Header>
      <Card.Body>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={365}
        />
      </Card.Body>
    </Card>
  );
};

export default RiskCategoriesChart;
