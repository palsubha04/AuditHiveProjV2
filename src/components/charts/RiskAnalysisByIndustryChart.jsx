import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import './charts.css';
import { CardBody, CardHeader, Dropdown } from 'react-bootstrap';

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
      id: 'risk-analysis-industry-chart',
      type: 'bar',
      stacked: false,
      toolbar: { show: false },
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
    colors: ['#FF779D', '#FFD12C', '#20E5F3', '#6287FF', '#347AE2', '#00E096'],
    legend: {
      position: 'bottom',
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

  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID('risk-analysis-industry-chart');
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'risk-analysis-industry-chart.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'risk-analysis-industry-chart.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'risk-analysis-industry-chart',
      });
    }
  };

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className='d-flex justify-content-between align-items-center w-100'>
          <div className='d-flex justify-content-between align-items-center gap-2'>
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
          </div>
          <div className='d-flex justify-content-between align-items-center gap-2'>
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
        </div>

      </CardHeader>
      <CardBody>
        {filteredData && Object.keys(filteredData).length > 0 ?
        <Chart options={options} series={series} type="bar" height={400} />
        :  <div
        className="text-center text-muted"
        style={{
          height: '350px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        No Data Found
      </div>}
        
      </CardBody>
    </>
  );
};

export default RiskAnalysisByIndustryChart;
