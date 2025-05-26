import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import './charts.css';
import { CardBody, CardHeader } from 'react-bootstrap';

const riskLevels = [
  'Critical Risk',
  'High Risk',
  'Moderate Risk',
  'Elevated Risk',
  'Low Risk',
  'Very Low Risk',
];

const RiskAnalysisByIndustryChart = ({ riskData }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [filteredData, setFilteredData] = useState({});

  const categories = riskData ? Object.keys(riskData) : [];
  const industries =
    selectedCategory && riskData?.[selectedCategory]
      ? Object.keys(riskData[selectedCategory])
      : [];

  useEffect(() => {
    if (riskData && selectedCategory && selectedIndustry) {
      const data = riskData[selectedCategory]?.[selectedIndustry];
      setFilteredData(data || {});
    } else {
      setFilteredData({});
    }
  }, [riskData, selectedCategory, selectedIndustry]);

  useEffect(() => {
    if (riskData) {
      const defaultCategory = Object.keys(riskData)[0] || '';
      const defaultIndustry = defaultCategory
        ? Object.keys(riskData[defaultCategory])[0] || ''
        : '';
      setSelectedCategory(defaultCategory);
      setSelectedIndustry(defaultIndustry);
    }
  }, [riskData]);

  const series =
    filteredData && typeof filteredData === 'object'
      ? riskLevels.map((risk) => ({
          name: risk,
          data: ['micro', 'small', 'medium', 'large'].map(
            (size) => filteredData[size]?.[risk] || 0
          ),
        }))
      : [];

  const options = {
    chart: {
      type: 'bar',
      stacked: false,
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: ['Micro', 'Small', 'Medium', 'Large'],
      title: {
        text: 'Business Size',
      },
    },
    yaxis: {
      title: {
        text: 'Risk Count',
      },
    },
    colors: ['#F36464', '#FF779D', '#f1c40f', '#FFD12C', '#00E096', '#34C759'],
    legend: {
      position: 'top',
    },
    tooltip: {
      shared: true,
      intersect: false,
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
  };

  return (
    <>
      <CardHeader className="chart-card-header">
        <span className="chart-headers">Risk Analysis By Industry</span>

        <div>
          <select
            className="chart-filter"
            value={selectedCategory}
            onChange={(e) => {
              const newCategory = e.target.value;
              const industryList = Object.keys(riskData?.[newCategory] || {});
              const firstIndustry = industryList[0] || '';
              setSelectedCategory(newCategory);
              setSelectedIndustry(firstIndustry);
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
          <span className="mx-2" style={{ color: '#7c879d', fontSize: '16px' }}>
            and
          </span>
          <select
            className="chart-filter"
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            disabled={!selectedCategory}
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind.charAt(0).toUpperCase() +
                  ind.slice(1).replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type="bar" height={400} />
      </CardBody>
    </>
  );
};

export default RiskAnalysisByIndustryChart;
