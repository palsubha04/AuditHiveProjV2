import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import './charts.css';
import CSVExportButton from '../CSVExportButton';
import { CardBody, CardHeader, Dropdown } from 'react-bootstrap';

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

const RiskBreakdownByCategoryChart = ({ riskBreakdownByCategoryData }) => {
  //console.log("data received in RiskBreakdownByCategoryChart", riskBreakdownByCategoryData);
  const [filterData, setFilterData] = useState(
    riskBreakdownByCategoryData ? riskBreakdownByCategoryData['gst'] ?? {} : {}
  );
  const [records, setRecords] = useState([]);

  const defaultCategory = 'gst';
  useEffect(() => {
    if (riskBreakdownByCategoryData?.[defaultCategory]) {
      setFilterData(riskBreakdownByCategoryData[defaultCategory]);
      const result = Object.entries(
        riskBreakdownByCategoryData[defaultCategory]
      ).flatMap(([category, { records }]) =>
        records.map(({ tin, taxpayer_name, tax_period_year, tax_period_month }) => ({
          Tin: tin,
          'Taxpayer Name': taxpayer_name,
          'Tax Period Year': tax_period_year,
          'Tax Period Month': monthMap[tax_period_month] || tax_period_month,
          Segmentation: category,
        }))
      );

      setRecords(result);
    }
  }, [riskBreakdownByCategoryData]);

  // Define categories for x-axis
  const categories = ['large', 'medium', 'small', 'micro'];

  // Risk levels to be used for each series
  const riskLevels = [
    { key: 'Critical', color: '#c0392b' },
    { key: 'High', color: '#e74c3c' },
    { key: 'Moderate', color: '#f39c12' },
    { key: 'Elevated', color: '#f1c40f' },
    { key: 'Low', color: '#2ecc71' },
    { key: 'Very Low', color: '#1abc9c' },
  ];

  const series = riskLevels.map((level) => ({
    name: level.key,
    data: categories.map(
      (cat) => filterData?.[cat]?.[level.key + ' Risk'] ?? 0
    ),
  }));

  const options = {
    chart: {
      id: 'risk-breakdown-chart',
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
      },
    },
    xaxis: {
      categories: categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)), // Capitalize
    },
    yaxis: {
      title: {
        text: 'Number of Taxpayers',
      },
    },
    legend: {
      position: 'bottom',
    },
    fill: {
      opacity: 1,
    },
    colors: riskLevels.map((level) => level.color),
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

  const changeCategoryData = (category) => {
    const selectedData = riskBreakdownByCategoryData?.[category] ?? {};
    setFilterData(selectedData);

    const result = Object.entries(selectedData).flatMap(
      ([category, { records }]) =>
        records.map(({ tin, taxpayer_name, tax_period_year, tax_period_month }) => ({
          Tin: tin,
          'Taxpayer Name': taxpayer_name,
          'Tax Period Year': tax_period_year,
          'Tax Period Month': monthMap[tax_period_month],
          Segmentation: category,
        }))
    );

    setRecords(result);
  };

  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID('risk-breakdown-chart');
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'risk-breakdown-chart.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'risk-breakdown-chart.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'risk-breakdown-chart',
      });
    }
  };

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="d-flex">
          <span className="chart-headers">Risk Breakdown By Category</span>
          <div className="">
            <select
              className="chart-filter"
              onChange={(e) => changeCategoryData(e.target.value)}
            >
              <option value="gst">GST</option>
              <option value="swt">SWT</option>
              <option value="cit">CIT</option>
            </select>
          </div>
        </div>
        <div className='d-flex flex-row gap-2 align-items-center'>
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
          <CSVExportButton
            records={records}
            filename="risk_breakdown_category.csv"
            buttonLabel="Download Risk Breakdown By Category Taxpayer List"
          />
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type="bar" height={350} />
      </CardBody>
      {/* Only render chart if series data exists */}
      {/* {riskBreakdownByCategoryData ? (series.length > 0 && (
        <Chart options={options} series={series} type="bar" height={350} />
      )) : <div>No data available</div>} */}
    </>
  );
};

export default RiskBreakdownByCategoryChart;
