import { Tally1 } from 'lucide-react';
import React, { useEffect, useState, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import './charts.css';
import CSVExportButton from '../CSVExportButton';
import { CardBody, CardHeader } from 'react-bootstrap';
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

const RiskAnomalyFrequencyChart = ({ riskAnomalyFrequencyData, source }) => {
  const [selectedCategory, setSelectedCategory] = useState('gst');
  const [filteredData, setFilteredData] = useState([]);
  const categories = ['gst', 'swt', 'cit'];
  const [records, setRecords] = useState([]);

  console.log(
    'data received in RiskAnomalyFrequencyChart',
    riskAnomalyFrequencyData
  );
  useEffect(() => {
    if (riskAnomalyFrequencyData && selectedCategory) {
      const rules =
        riskAnomalyFrequencyData[selectedCategory]?.fraud_rules || [];
      setFilteredData(rules);
      if (source === 'Risk Assessment') {
        const result = rules.flatMap(({ rule, records }) =>
          records.map(({ tin, taxpayer_name, tax_period_year, tax_period_month  }) => ({
            Tin: tin,
            'Taxpayer Name': taxpayer_name,
            'Tax Period Year': tax_period_year,
          'Tax Period Month': monthMap[tax_period_month],
            Rule: rule,
          }))
        );

        setRecords(result);
      }
    }
  }, [riskAnomalyFrequencyData, selectedCategory]);

  const { labels, series } = useMemo(() => {
    if (!filteredData?.length) return { labels: [], series: [] };
    return {
      labels: filteredData.map((item) => item.rule),
      series: filteredData.map((item) => item.count),
    };
  }, [filteredData]);

  const options = {
    chart: {
      type: 'pie',
      height: 350,
      toolbar: { show: true },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, w }) {
        const value = series[seriesIndex];
        const total = series.reduce((acc, val) => acc + val, 0);
        const percentage = total ? ((value / total) * 100).toFixed(2) : 0;
        const label = w.globals.labels[seriesIndex];

        return `
          <div class="arrow_box" style="padding: 8px; line-height: 1.4">
            <span> ${label}</span><br/>
            <span><strong>Value:</strong> ${value.toLocaleString()}</span><br/>
            <span><strong>Percentage:</strong> ${percentage}%</span>
          </div>
        `;
      },
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
  };

  return (
    <>
      {/* Heading and dropdown */}
      <CardHeader className="chart-card-header">
        <div className="d-flex">
          <span className="chart-headers">Frequency Of Risk Anomalies</span>
          <div>
            <select
              className="chart-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        {source === 'Risk Assessment' && (
          <CSVExportButton
            records={records}
            filename="frequency_by_risk_anomalies_taxpayers.csv"
            buttonLabel="Download Frequency Of Risk Anomalies Taxpayer List"
          />
        )}
      </CardHeader>

      {/* Chart */}
      <CardBody>
        <ReactApexChart
          key={`${selectedCategory}-${series.length}`} // important for rerendering
          options={options}
          series={series}
          type="pie"
          width={500}
        />
      </CardBody>
    </>
  );
};

export default RiskAnomalyFrequencyChart;
