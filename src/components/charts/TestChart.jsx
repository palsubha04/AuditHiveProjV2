import React, { useState } from "react";
import Chart from "react-apexcharts";

// Sample risk data structured by sector
const riskData = {
  "banks_and_saving_and_loan_societies": {
    micro: { "Critical Risk": 1, "High Risk": 0, "Moderate Risk": 0, "Elevated Risk": 0, "Low Risk": 0, "Very Low Risk": 0 },
    small: { "Critical Risk": 13, "High Risk": 2, "Moderate Risk": 0, "Elevated Risk": 0, "Low Risk": 0, "Very Low Risk": 0 },
    medium: { "Critical Risk": 1, "High Risk": 2, "Moderate Risk": 0, "Elevated Risk": 0, "Low Risk": 0, "Very Low Risk": 0 },
    large: { "Critical Risk": 5, "High Risk": 0, "Moderate Risk": 0, "Elevated Risk": 0, "Low Risk": 0, "Very Low Risk": 0 }
  },
  "extraction_of_petroleum": {
    medium: { "Critical Risk": 13, "High Risk": 1, "Moderate Risk": 0, "Elevated Risk": 0, "Low Risk": 0, "Very Low Risk": 0 }
  },
  "computer_and_related_services": {
    small: { "Critical Risk": 5, "High Risk": 0, "Moderate Risk": 0, "Elevated Risk": 0, "Low Risk": 0, "Very Low Risk": 0 }
  }
  // Add more sectors as needed
};

const businessSizes = ["micro", "small", "medium", "large"];
const riskLevels = ["Critical Risk", "High Risk", "Moderate Risk", "Elevated Risk", "Low Risk", "Very Low Risk"];

const RiskChartPage = () => {
  const [selectedSector, setSelectedSector] = useState("banks_and_saving_and_loan_societies");

  const generateSeries = () => {
    return riskLevels.map((risk) => ({
      name: risk,
      data: businessSizes.map((size) => {
        return riskData[selectedSector]?.[size]?.[risk] || 0;
      })
    }));
  };

  const chartOptions = {
    chart: {
      type: "bar",
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
      },
    },
    xaxis: {
      categories: businessSizes.map((s) => s.charAt(0).toUpperCase() + s.slice(1)),
    },
    yaxis: {
      title: {
        text: "Number of Risks",
      },
    },
    legend: {
      position: "top",
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
    colors: ['#FF4560', '#FEB019', '#00E396', '#775DD0', '#008FFB', '#FF66C3']
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "2rem" }}>
      <h2>Grouped Risk Bar Chart by Business Size</h2>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="sector-select">Select Sector: </label>
        <select
          id="sector-select"
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
          style={{ marginLeft: "1rem", padding: "0.5rem" }}
        >
          {Object.keys(riskData).map((sectorKey) => (
            <option key={sectorKey} value={sectorKey}>
              {sectorKey.replaceAll("_", " ")}
            </option>
          ))}
        </select>
      </div>
      <Chart options={chartOptions} series={generateSeries()} type="bar" height={400} />
    </div>
  );
};

export default RiskChartPage;
