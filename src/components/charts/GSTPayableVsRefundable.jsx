import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, Row, Col } from 'react-bootstrap';
import gstService from '../../services/gst.service';
import '../../pages/Dashboard.css';
import './charts.css';

const GSTPayableVsRefundable = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'GST Payable',
        data: [],
      },
      {
        name: 'GST Refundable',
        data: [],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
          borderRadius: 6,
          //borderRadiusWhenStacked: 'last',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [],
        title: {
          text: 'Month',
        },
      },
      yaxis: {
        title: {
          text: 'Amount (PGK)',
        },
        labels: {
          formatter: function (value) {
            return (
              'PGK ' +
              value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            );
          },
        },
      },
      fill: {
        opacity: 1,
        colors: ['#0095FF', '#00E096'],
      },
      tooltip: {
        y: {
          formatter: function (value) {
            return (
              'PGK ' +
              value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            );
          },
        },
      },
      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
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

  const [totals, setTotals] = useState({
    payable: 0,
    refundable: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await gstService.getPayableVsRefundable(
          startDate,
          endDate
        );

        // Process the response data
        const categories = [];
        const payableData = [];
        const refundableData = [];

        response.records.forEach((record) => {
          record.monthly_summary.forEach((summary) => {
            const date = new Date(record.year, summary.month - 1);
            categories.push(
              date.toLocaleString('default', {
                month: 'short',
                year: 'numeric',
              })
            );
            payableData.push(summary.gst_payable);
            refundableData.push(summary.gst_refundable);
          });
        });

        // Check if all values are zero
        const allZero =
          payableData.every((val) => val === 0) &&
          refundableData.every((val) => val === 0);

        setChartData((prevData) => ({
          ...prevData,
          series: allZero
            ? []
            : [
                {
                  name: 'GST Payable',
                  data: payableData,
                },
                {
                  name: 'GST Refundable',
                  data: refundableData,
                },
              ],
          options: {
            ...prevData.options,
            xaxis: {
              ...prevData.options.xaxis,
              categories: categories,
            },
          },
        }));

        setTotals({
          payable: response.total_gst_payable,
          refundable: response.total_gst_refundable,
        });
      } catch (error) {
        console.error('Error fetching GST data:', error);
      }
    };

    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);

  return (
    <Card className="mb-4 box-background">
      <Card.Header className="chart-card-header">
        <div className="align-items-center d-flex justify-content-between">
          <div className="col-auto">
            <span className="chart-headers">GST Payable vs Refundable</span>
          </div>
          <div className="d-flex align-items-center justify-content-end gap-3">
            <div className="col-auto">
              <div className="d-flex align-items-center">
                <div
                  className="me-2"
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#008FFB',
                    borderRadius: '50%',
                  }}
                ></div>
                <span>
                  Sum of GST Payable: PGK
                  {totals.payable.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex align-items-center">
                <div
                  className="me-2"
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#00E396',
                    borderRadius: '50%',
                  }}
                ></div>
                <span>
                  Sum of GST Refundable: PGK
                  {totals.refundable.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <div id="chart">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={350}
          />
        </div>
      </Card.Body>
    </Card>
  );
};

export default GSTPayableVsRefundable;
