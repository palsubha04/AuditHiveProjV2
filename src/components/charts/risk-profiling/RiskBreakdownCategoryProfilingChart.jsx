import React, { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import '../charts.css';
import { CardBody, CardHeader, Dropdown } from 'react-bootstrap';

const RiskBreakdownCategoryProfilingChart = ({
  riskBreakdownByCategoryDataProfiling,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('gst');
  const [filteredData, setFilteredData] = useState([]);

  console.log(
    'riskBreakdownByCategoryDataProfiling',
    riskBreakdownByCategoryDataProfiling
  );

  const riskLevels = [
    'Critical Risk',
    'High Risk',
    'Moderate Risk',
    'Elevated Risk',
    'Low Risk',
    'Very Low Risk',
    'No Risk',
  ];

  useEffect(() => {
    if (riskBreakdownByCategoryDataProfiling && selectedCategory) {
      const rules =
        riskBreakdownByCategoryDataProfiling[selectedCategory] ?? {};
      console.log('Selected Category:', selectedCategory);
      console.log('Filtered Data:', rules);
      setFilteredData(rules);
    }
  }, [riskBreakdownByCategoryDataProfiling, selectedCategory]);

  const { labels, series } = useMemo(() => {
    const labels = [];
    const series = [];

    for (let i = 0; i < riskLevels.length; i++) {
      const riskLevel = riskLevels[i];
      if (filteredData[riskLevel]) {
        series.push(filteredData[riskLevel]['count']);
        if (riskLevel === 'Unknown') {
          labels.push('High');
        } else {
          labels.push(riskLevel);
        }
      }
    }
    return { labels, series };
  }, [filteredData]);

  const options = {
    chart: {
      id: 'risk-breakdown-catergory',
      type: 'pie',
      height: 350,
      toolbar: { show: false },
    },
    labels: labels,
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
    legend: {
      position: 'bottom',
      onItemClick: {
        toggleDataSeries: true, // explicitly allow toggling
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, w }) {
        const label = w.globals.labels[seriesIndex];
        const count = series[seriesIndex];
        const assessments =
          filteredData[label]?.assessments?.join(', ') || 'N/A';

        return `
          <div style="padding:8px;">
            <strong>${label}:</strong> ${count}<br/>
            <strong>Assessments:</strong> ${assessments}
          </div>
        `;
      },
    },
  };

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID('risk-breakdown-catergory');
    if (!chart) return;
    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'risk-breakdown-catergory.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'risk-breakdown-catergory.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'risk-breakdown-catergory',
      });
    }
  };
  return (
    <div>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">Risk Breakdown Category</div>
        <div className="d-flex flex-row gap-2 align-items-center">
          <select
            className="chart-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="gst">GST</option>
            <option value="swt">SWT</option>
            <option value="cit">CIT</option>
          </select>
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
              <Dropdown.Item onClick={() => handleDownload('csv')}>
                Download CSV
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </CardHeader>
      <CardBody>
        <ReactApexChart
          key={JSON.stringify(series)} // forces remount when data changes
          options={options}
          series={series}
          type="pie"
          width={500} // Adjust the width as needed
        />
      </CardBody>
    </div>
  );
};

export default RiskBreakdownCategoryProfilingChart;
