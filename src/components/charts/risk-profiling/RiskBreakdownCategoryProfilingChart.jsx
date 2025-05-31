import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import ApexCharts from "apexcharts";
import "../charts.css";
import { CardBody, CardHeader, Dropdown } from "react-bootstrap";
import CSVExportButton from "../../CSVExportButton";

const RiskBreakdownCategoryProfilingChart = ({
  riskBreakdownByCategoryDataProfiling,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("gst");
  const [filteredData, setFilteredData] = useState([]);
  const [records, setRecords] = useState([]);

  const riskLevels = [
    "Critical Risk",
    "High Risk",
    "Moderate Risk",
    "Elevated Risk",
    "Low Risk",
    "Very Low Risk",
    "No Risk",
  ];
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
    12: "December",
  };

  useEffect(() => {
    if (riskBreakdownByCategoryDataProfiling && selectedCategory) {
      const rules =
        riskBreakdownByCategoryDataProfiling[selectedCategory] ?? {};
      setFilteredData(rules);
      const result = Object.entries(
        riskBreakdownByCategoryDataProfiling[selectedCategory]
      ).flatMap(([category, { assessments }]) =>
        assessments.map(
          ({ assessment_number, tax_period_year, tax_period_month }) => ({
            "Assessment Number": assessment_number,
            "Tax Period Year": tax_period_year,
            "Tax Period Month": monthMap[tax_period_month] || tax_period_month,
            "Risk Type": category,
          })
        )
      );

      setRecords(result);
    }
  }, [riskBreakdownByCategoryDataProfiling, selectedCategory]);

  const { labels, series } = useMemo(() => {
    const labels = [];
    const series = [];

    for (let i = 0; i < riskLevels.length; i++) {
      const riskLevel = riskLevels[i];
      if (filteredData[riskLevel]) {
        series.push(filteredData[riskLevel]["count"]);
        if (riskLevel === "Unknown") {
          labels.push("High");
        } else {
          labels.push(riskLevel);
        }
      }
    }
    return { labels, series };
  }, [filteredData]);

  const options = {
    chart: {
      id: "risk-breakdown-catergory",
      type: "pie",
      height: 350,
      toolbar: { show: false },
    },
    labels: labels,
    colors: ['#00E096', '#FFD12C', '#20E5F3', '#6287FF', '#347AE2', '#FF779D'],
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
    legend: {
      position: "bottom",
      onItemClick: {
        toggleDataSeries: true, // explicitly allow toggling
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, w }) {
        const label = w.globals.labels[seriesIndex];
        const count = series[seriesIndex];
        let assessments = "";

        if (filteredData[label]) {
          const assessmentNumbers = filteredData[label].assessments.map(
            (a) => a.assessment_number
          );

          for (let i = 0; i < assessmentNumbers.length; i++) {
            if (i > 0) {
              // Add comma before each item except the first
              assessments += ", ";
            }
            assessments += assessmentNumbers[i];

            // Add <br/> after every 5 items, except the last one
            if ((i + 1) % 5 === 0 && i !== assessmentNumbers.length - 1) {
              assessments += "<br/>";
            }
          }
        }

        return `
          <div style="padding:8px;">
            <strong>${label}:</strong> ${count}<br/>
            <strong>Assessments:</strong><br/>
            <span> ${assessments}</span>
          </div>
        `;
      },
    },
  };

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID("risk-breakdown-catergory");
    if (!chart) return;
    if (format === "png") {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement("a");
        link.href = imgURI;
        link.download = "risk-breakdown-catergory.png";
        link.click();
      });
    } else if (format === "svg") {
      chart.dataURI({ type: "svg" }).then(({ svgURI }) => {
        const link = document.createElement("a");
        link.href = svgURI;
        link.download = "risk-breakdown-catergory.svg";
        link.click();
      });
    } else if (format === "csv") {
      chart.exportToCSV({
        filename: "risk-breakdown-catergory",
      });
    }
  };
  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="d-flex flex-row gap-2 align-items-center">
          <div className="chart-headers">Risk Breakdown Category</div>
          <select
            className="chart-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="gst">GST</option>
            <option value="swt">SWT</option>
            <option value="cit">CIT</option>
          </select>
        </div>
        <div className="d-flex flex-row gap-2 align-items-center">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-default"
              size="sm"
              className="download-dropdown-btn"
            >
              Export
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleDownload("png")}>
                Download PNG
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleDownload("csv")}>
                Download CSV
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <CSVExportButton
            records={records}
            filename="risk_breakdown_by_category_assessments.csv"
            buttonLabel="Download Risk Breakdown By Category Assessments List"
          />
        </div>
      </CardHeader>
      <CardBody style={{'paddingLeft':'105px'}}>
        {labels.length === 1 && labels[0] === "No Risk" ? (
          <div className="spinner-div" style={{
            fontSize : "17px",
            opacity : 0.7
          }}>No Risk</div>
        ) : (
          <ReactApexChart
            key={JSON.stringify(series)} // forces remount when data changes
            options={options}
            series={series}
            type="pie"
            width={500} // Adjust the width as needed
          />
        )}
      </CardBody>
    </>
  );
};

export default RiskBreakdownCategoryProfilingChart;
