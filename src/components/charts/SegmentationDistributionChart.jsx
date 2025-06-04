import React, { useState, useEffect } from "react";
import { Card, Dropdown, Placeholder, Spinner } from "react-bootstrap";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import gstService from "../../services/gst.service";
import "../../pages/Dashboard.css";
import "./charts.css";

const COLORS = {
  micro: "#FFD12C",
  small: "#4485E5",
  medium: "#FF779D",
  large: "#00E096",
};

const VALID_SEGMENTS = ["micro", "small", "medium", "large"];

function SegmentationDistributionChart({ startDate, endDate }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await gstService.getSegmentationDistribution(
          startDate,
          endDate
        );

        // Transform the data for the pie chart, only including valid segments
        const chartData = Object.entries(response)
          .filter(([name]) => VALID_SEGMENTS.includes(name.toLowerCase()))
          .map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value: value,
          }));

        setData(chartData);
      } catch (err) {
        setError("Failed to load segmentation distribution data");
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchData();
    } else {
      setLoading(false);
      setData([]);
    }
  }, [startDate, endDate]);

  const options = {
    chart: {
      id: "segment-distribution-chart",
      type: "pie",
      height: 350,
      animations: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    labels: data.length > 0 ? data.map((item) => item.name) : [],
    colors:
      data.length > 0
        ? data.map((item) => COLORS[item.name.toLowerCase()])
        : [],
    legend: {
      position: "bottom",
    },
    // tooltip: {
    //   y: {
    //     formatter: (value) => value.toLocaleString()
    //   }
    // },
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

    plotOptions: {
      pie: {
        donut: {
          size: "0%",
        },
        dataLabels: {
          offset: -30,
        },
      },
    },
    dataLabels: {
      formatter: (val, opts) => {
        const name = opts.w.globals.labels[opts.seriesIndex];
        const value = opts.w.globals.series[opts.seriesIndex];
        return `${val.toFixed(0)}%`;
      },
    },
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
  };

  const series =
    data.length > 0
      ? data.every((item) => item.value === 0)
        ? []
        : data.map((item) => item.value)
      : [];

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID("segment-distribution-chart");
    if (!chart) return;

    if (format === "png") {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement("a");
        link.href = imgURI;
        link.download = "sales_comparison_chart.png";
        link.click();
      });
    } else if (format === "svg") {
      chart.dataURI({ type: "svg" }).then(({ svgURI }) => {
        const link = document.createElement("a");
        link.href = svgURI;
        link.download = "sales_comparison_chart.svg";
        link.click();
      });
    } else if (format === "csv") {
      chart.exportToCSV({
        filename: "sales_comparison_data",
      });
    }
  };

  if (loading) {
    return (
      <Card className="mb-4 box-background">
        <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
          <div className="chart-headers" style={{ height: "30px" }}>
            {/* Placeholder for the chart title */}
            <Placeholder as="span" animation="glow" xs={5} />
          </div>
          {/* Placeholder for the export dropdown */}
        </Card.Header>
        <Card.Body>
          <div
            style={{
              height: 350,
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Placeholder
              as="div"
              animation="glow"
              // Set explicit equal width and height for a perfect circle
              style={{
                width: "250px", // Or any desired size, just make sure height matches
                height: "250px",
                borderRadius: "50%",
                backgroundColor: "#d5e6ff",
              }}
            />
          </div>
          <div className="d-flex justify-content-around mt-3">
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
          </div>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="chart-card">
        <Card.Header className="chart-card-header">
          <span className="chart-headers">Segmentation Distribution</span>
        </Card.Header>
        <Card.Body>
          <div className="text-center text-danger">{error}</div>
        </Card.Body>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="chart-card">
        <Card.Header className="chart-card-header">
          <span className="chart-headers">Segmentation Distribution</span>
        </Card.Header>
        <Card.Body>
          <div
            className="text-center text-muted"
            style={{
              height: "350px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No Data Found
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="chart-card box-background">
      <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
        <span className="chart-headers">Segmentation Distribution</span>
        <div className="d-flex align-items-center gap-2">
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-default"
              size="sm"
              className="download-dropdown-btn"
            >
              {/* <Download style={{height : "18px",width:"18px", color:'#5671ff'}}/> */}
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
        </div>
      </Card.Header>
      <Card.Body>
        <div style={{ width: "100%", height: 380 }}>
          <ReactApexChart
            options={options}
            series={series}
            type="pie"
            height={350}
          />
        </div>
      </Card.Body>
    </Card>
  );
}

export default SegmentationDistributionChart;
