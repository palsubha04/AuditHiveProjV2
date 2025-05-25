import { useState, useEffect } from "react";
import { Tally1 } from "lucide-react";
import ReactApexChart from "react-apexcharts";
import "./charts.css";
import CSVExportButton from "../CSVExportButton";

const entityTypes = ["large", "medium", "small", "micro"];

const sampleData = {
  total_taxpayers: 67706,
  risk_flagged_taxpayers: 3025,
  risk_flagged_percentage: 4.47,
  records: [
    {
      tin: 500000232,
      taxpayer_name: "KENTZ MEPC (MALAYSIA) SDN. BHD.",
    },
    {
      tin: 500000232,
      taxpayer_name: "KENTZ MEPC (MALAYSIA) SDN. BHD.",
    },
    {
      tin: 500000232,
      taxpayer_name: "KENTZ MEPC (MALAYSIA) SDN. BHD.",
    },
    {
      tin: 500000250,
      taxpayer_name: "POSCO INTERNATIONAL POWER (PNGPOM) LIMITED",
    },
    {
      tin: 500000483,
      taxpayer_name: "MOKI NO 10 LIMITED",
    },
    {
      tin: 500000571,
      taxpayer_name: "CONSOLIDATED CONTRACTORS (PNG) COMPANY LIMITED",
    },
    {
      tin: 500000571,
      taxpayer_name: "CONSOLIDATED CONTRACTORS (PNG) COMPANY LIMITED",
    },
    {
      tin: 500000571,
      taxpayer_name: "CONSOLIDATED CONTRACTORS (PNG) COMPANY LIMITED",
    },
    {
      tin: 500000571,
      taxpayer_name: "CONSOLIDATED CONTRACTORS (PNG) COMPANY LIMITED",
    },
    {
      tin: 500000571,
      taxpayer_name: "CONSOLIDATED CONTRACTORS (PNG) COMPANY LIMITED",
    },
  ],
};

const TotalVsFlaggedLineChart = ({ totalTaxPayerVsRiskFlagged }) => {
  console.log("TotalVsFlaggedLineChart from chart", totalTaxPayerVsRiskFlagged);
  const [selectedCategory, setSelectedCategory] = useState("gst");
  const [chartSeries, setChartSeries] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (
      !totalTaxPayerVsRiskFlagged ||
      !totalTaxPayerVsRiskFlagged[selectedCategory]
    ) {
      setChartSeries([]);
      setChartOptions({});
      return;
    }

    const currentData = totalTaxPayerVsRiskFlagged[selectedCategory];
    let temp = [];
    const result = Object.entries(currentData).flatMap(([category, { records }]) =>
      records.map(({ tin, taxpayer_name }) => ({
        tin,
        taxpayer_name,
        segmentation : category,
      }))
    );
    // for (let i in currentData) {
    //   temp.push(...currentData[i].records);
    //   temp = temp.map(item => {return {...item, category : i}})
    // }
    setRecords(result);

    const totalSeries = entityTypes.map(
      (type) => currentData[type]?.total_taxpayers ?? 0
    );
    const flaggedSeries = entityTypes.map(
      (type) => currentData[type]?.risk_flagged_taxpayers ?? 0
    );
    const riskPercentages = entityTypes.map(
      (type) => currentData[type]?.risk_flagged_percentage ?? 0
    );

    setChartSeries([
      { name: "Total Taxpayers", data: totalSeries },
      { name: "Risk-Flagged Taxpayers", data: flaggedSeries },
    ]);

    setChartOptions({
      chart: {
        type: "line",
        height: 350,
        toolbar: { show: true },
      },
      stroke: {
        width: 3,
        curve: "smooth",
      },
      xaxis: {
        categories: ["Large", "Medium", "Small", "Micro"],
        title: { text: "Segmentation" },
        labels: {
          style: { fontWeight: 500, color: "#334155", fontSize: "14px" },
        },
      },
      yaxis: {
        title: { text: "Number of Taxpayers" },
        labels: { style: { fontWeight: 500, color: "#334155" } },
      },
      legend: { position: "top", fontWeight: 600 },
      colors: ["#2563eb", "#f97316"],
      markers: { size: 5 },
      tooltip: {
        shared: true,
        intersect: false,
        custom: function ({ series, dataPointIndex, w }) {
          const sizeLabel = w.globals.categoryLabels[dataPointIndex];
          const total = series[0]?.[dataPointIndex] ?? 0;
          const flagged = series[1]?.[dataPointIndex] ?? 0;
          const percent = riskPercentages?.[dataPointIndex] ?? 0;

          return `
            <div style="padding: 8px 12px;">
              <strong>${sizeLabel}</strong><br/>
              Total Taxpayers: ${total}<br/>
              Risk-Flagged: ${flagged}<br/>
              <span style="color:#f97316;">Risk Percentage: ${percent}%</span>
            </div>
          `;
        },
        style: { fontSize: "15px" },
      },
      grid: { borderColor: "#e0e7ef", strokeDashArray: 4 },
      noData: {
        text: "No Data Found",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
        style: {
          color: "#6c757d",
          fontSize: "16px",
          fontFamily: "inherit",
        },
      },
    });
  }, [selectedCategory, totalTaxPayerVsRiskFlagged]);

  const isDataAvailable =
    totalTaxPayerVsRiskFlagged && totalTaxPayerVsRiskFlagged[selectedCategory];

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16, justifyContent : "space-between" }}>
        <div>
          <span className="chart-headers">Total Taxpayers vs Risk-Flagged</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="chart-filter"
          >
            <option value="gst">GST</option>
            <option value="swt">SWT</option>
            <option value="cit">CIT</option>
          </select>
        </div>
        <CSVExportButton
          records={records}
          filename="risk_taxpayers.csv"
          buttonLabel="Download Risk Taxpayer List"
        />
      </div>
      <ReactApexChart options={chartOptions} series={chartSeries} type="line" />
      {/* <EmployeeLineChart options={chartOptions} series={chartSeries} /> */}
      {/* {isDataAvailable ? (
        <EmployeeLineChart options={chartOptions} series={chartSeries} />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
          No data available for the selected category.
        </div>
      )} */}
    </>
  );
};

export default TotalVsFlaggedLineChart;
