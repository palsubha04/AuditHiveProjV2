import { Tally1 } from "lucide-react";
import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";
import { Card, CardBody, CardHeader, Col, Dropdown, Row } from "react-bootstrap";
import CSVExportButton from "../../CSVExportButton";

const monthMap = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};

const TaxDelayComplianceChart = ({ taxDelayComplianceData }) => {
  const [selectedCategory, setSelectedCategory] = useState('gst');
  const [selectedSegment, setSelectedSegment] = useState('large');
  const [filterData, setFilterData] = useState({});
  const [records, setRecords] = useState([]);

  useEffect(() => {
    let updatedData = [];

    if (taxDelayComplianceData && selectedCategory && selectedSegment) {
      const data = taxDelayComplianceData[selectedCategory]?.[selectedSegment];
      setFilterData(data || {});

      updatedData = data?.records?.map(item => ({
        ...item,
        tax_period_month: monthMap[item.tax_period_month] || item.tax_period_month
      })) || [];
    } else {
      setFilterData({});
    }

    setRecords(updatedData);
  }, [taxDelayComplianceData, selectedCategory, selectedSegment]);


  const series = [filterData?.delayed || 0, filterData?.non_delayed || 0];
  const options = {
    chart: {
      id: 'delayed-ontime-chart',
      width: 380,
      type: 'pie',
      toolbar: { show: false },
    },
    legend : {
      position : 'bottom'
    },
    labels: ['Delayed', 'Non Delayed'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
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
    const chart = await ApexCharts.getChartByID('delayed-ontime-chart');
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'delayed-ontime-chart.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'delayed-ontime-chart.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'delayed-ontime-chart',
      });
    }
  };

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center gap-2">
            <span className="chart-headers">Delayed vs On-Time Returns</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='chart-filter'
            >
              <option value="gst">GST</option>
              <option value="swt">SWT</option>
              <option value="cit">CIT</option>
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-default" size="sm" className='download-dropdown-btn'>
                Export
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleDownload('png')}>Download PNG</Dropdown.Item>
                <Dropdown.Item onClick={() => handleDownload('csv')}>Download CSV</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <CSVExportButton
              records={records}
              filename="delayes_vs_ontime_taxpayer.csv"
              buttonLabel="Download Delayed vs On-Time Returns Taxpayer List"
            />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type="pie" height={420} />
      </CardBody>
    </>
  );
};

export default TaxDelayComplianceChart;
