import { Tally1 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { CardBody, CardHeader } from 'react-bootstrap';
import '../charts.css';

const TaxDelayComplianceChart = ({ taxDelayComplianceData }) => {
  const [selectedCategory, setSelectedCategory] = useState('gst');
  const [selectedSegment, setSelectedSegment] = useState('large');
  const [filterData, setFilterData] = useState({});
  console.log('taxDelayComplianceData inside', taxDelayComplianceData);

  useEffect(() => {
    if (taxDelayComplianceData && selectedCategory && selectedSegment) {
      const data = taxDelayComplianceData[selectedCategory]?.[selectedSegment];
      setFilterData(data || {});
    } else {
      setFilterData({});
    }
  }, [taxDelayComplianceData, selectedCategory, selectedSegment]);

  const series = [filterData?.delayed || 0, filterData?.non_delayed || 0];
  const options = {
    chart: {
      width: 380,
      type: 'pie',
      toolbar: { show: true },
    },
    // tooltip: {
    //   custom: function ({ series, seriesIndex, w }) {
    //     const value = series[seriesIndex];
    //     const total = series.reduce((acc, val) => acc + val, 0);
    //     const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
    //     const label = w.globals.labels[seriesIndex];

    //     return `
    //       <div class="arrow_box" style="padding: 8px; line-height: 1.4">
    //         <span> ${label}</span><br/>
    //         <span><strong>Value:</strong> ${value.toLocaleString()}</span><br/>
    //         <span><strong>Percentage:</strong> ${percentage}%</span>
    //       </div>
    //     `;
    //   },
    // },
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

  return (
    <>
      <CardHeader className="chart-card-header">
        <span className="chart-headers">Delayed vs On-Time Returns</span>
        {/* <Tally1 style={{ color: "#7c879d" }} /> */}
        <span
          style={{
            color: '#7c879d',
            fontSize: '16px',
            marginRight: '10px',
          }}
        >
          Filter By :{' '}
        </span>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="chart-filter"
        >
          <option value="gst">GST</option>
          <option value="swt">SWT</option>
          <option value="cit">CIT</option>
        </select>

        <select
          value={selectedSegment}
          onChange={(e) => setSelectedSegment(e.target.value)}
          className="chart-filter"
        >
          <option value="large">Large</option>
          <option value="medium">Medium</option>
          <option value="small">Small</option>
          <option value="micro">Micro</option>
        </select>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type="pie" height={350} />
      </CardBody>
    </>
  );
};

export default TaxDelayComplianceChart;
