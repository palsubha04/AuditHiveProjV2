import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import './charts.css';
import CSVExportButton from '../CSVExportButton';
import { CardBody, CardHeader } from 'react-bootstrap';

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
        records.map(({ tin, taxpayer_name }) => ({
          Tin: tin,
          'Taxpayer Name': taxpayer_name,
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
      type: 'bar',
      stacked: true,
      toolbar: { show: true },
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
      position: 'top',
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
        records.map(({ tin, taxpayer_name }) => ({
          tin,
          taxpayer_name,
          Segmentation: category,
        }))
    );

    setRecords(result);
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
        <CSVExportButton
          records={records}
          filename="risk_breakdown_category.csv"
          buttonLabel="Download Risk Breakdown By Category Taxpayer List"
        />
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
