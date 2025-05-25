import { Tally1 } from 'lucide-react';
import React, { use, useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Chart from 'react-apexcharts';

var riskData = {
  gst: {
    High: {
      count: 2,
      assessments: [1, 2],
    },
    Moderate: {
      count: 1,
      assessments: [3],
    },
  },
  swt: {
    High: {
      count: 1,
      assessments: [5],
    },
    Low: {
      count: 2,
      assessments: [7, 8],
    },
  },
};

const RiskBreakdownCategoryProfilingChart = ({
  riskBreakdownByCategoryDataProfiling,
}) => {
  //const [filterData, setFilterData] = useState(riskData ? riskData["gst"] ?? {} : {});
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

    console.log('Chart Labels:', labels);
    console.log('Chart Series:', series);

    return { labels, series };
  }, [filteredData]);

  const options = {
    chart: {
      type: 'pie',
      height: 350,
      toolbar: { show: true },
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

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <h4
          className="mb-0 me-3 fw-bold"
          style={{
            color: '#05004E',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '0px',
            lineHeight: '32px',
          }}
        >
          Risk Breakdown Category
        </h4>
        <Tally1 style={{ color: '#7c879d' }} />
        <span
          style={{ color: '#7c879d', fontSize: '16px', marginRight: '10px' }}
        >
          Filter By :{' '}
        </span>
        <div>
          <select
            style={{
              marginRight: 8,
              padding: '4px 8px',
              borderRadius: 4,
              border: '1px solid #ccc',
            }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="gst">GST</option>
            <option value="swt">SWT</option>
            <option value="cit">CIT</option>
          </select>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <ReactApexChart
          key={JSON.stringify(series)} // forces remount when data changes
          options={options}
          series={series}
          type="pie"
          width={500} // Adjust the width as needed
        />
      </div>
    </div>
  );
};

export default RiskBreakdownCategoryProfilingChart;
