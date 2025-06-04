// import React, { useState, useEffect } from 'react';
// import ApexCharts from 'apexcharts';
// import ReactApexChart from 'react-apexcharts';
// import { Card, Dropdown } from 'react-bootstrap';
// import gstService from '../../services/gst.service';
// import '../../pages/Dashboard.css';
// import './charts.css';

// const SalesComparison = ({ startDate, endDate }) => {
//   const [chartData, setChartData] = useState({
//     xAxis: [],
//     series: [],
//   });

//   const colors = ['#347AE2', '#FF779D', '#FFD12C', '#20E5F3'];

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await gstService.getSalesComparison(startDate, endDate);

//         const categories = [];
//         const totalSalesData = [];
//         const exemptSalesData = [];
//         const zeroRatedSalesData = [];
//         const gstTaxableSalesData = [];

//         response.records.forEach((record) => {
//           record.monthly_summary.forEach((summary) => {
//             const date = new Date(record.year, summary.month - 1);
//             categories.push(
//               date.toLocaleString('default', {
//                 month: 'short',
//                 year: 'numeric',
//               })
//             );
//             totalSalesData.push(summary.total_sales_income);
//             exemptSalesData.push(summary.exempt_sales);
//             zeroRatedSalesData.push(summary.zero_rated_sales);
//             gstTaxableSalesData.push(summary.gst_taxable_sales);
//           });
//         });

//         const allZero =
//           totalSalesData.every((val) => val === 0) &&
//           exemptSalesData.every((val) => val === 0) &&
//           zeroRatedSalesData.every((val) => val === 0) &&
//           gstTaxableSalesData.every((val) => val === 0);

//         setChartData({
//           xAxis: categories,
//           series: allZero
//             ? []
//             : [
//                 { name: 'Total Sales Income', data: totalSalesData },
//                 { name: 'Exempt Sales', data: exemptSalesData },
//                 { name: 'Zero Rated Sales', data: zeroRatedSalesData },
//                 { name: 'GST Taxable Sales', data: gstTaxableSalesData },
//               ],
//         });
//       } catch (error) {
//       }
//     };

//     if (startDate && endDate) {
//       fetchData();
//     }
//   }, [startDate, endDate]);

//   const chartOptions = {
//     chart: {
//       id: 'sales-comparison-chart',
//       type: 'line',
//       height: 350,
//       toolbar: { show: false },
//       zoom: { enabled: true },
//     },
//     stroke: {
//       curve: 'smooth',
//       width: 2,
//     },
//     xaxis: {
//       categories: chartData.xAxis,
//     },
//     yaxis: {
//       title: { text: 'Amount (PGK)' },
//       labels: {
//         formatter: (value) =>
//           `PGK ${value.toLocaleString('en-US', {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}`,
//       },
//     },
//     tooltip: {
//       y: {
//         formatter: (value) =>
//           `PGK ${value.toLocaleString('en-US', {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}`,
//       },
//     },
//     colors,
//     legend: { position: 'bottom' },
//     noData: {
//       text: 'No Data Found',
//       align: 'center',
//       verticalAlign: 'middle',
//       style: {
//         color: '#6c757d',
//         fontSize: '16px',
//         fontFamily: 'inherit',
//       },
//     },
//   };

//   // Toolbar functions
//   const handleDownload = async (format) => {
//     const chart = await ApexCharts.getChartByID('sales-comparison-chart');
//     if (!chart) return;

//     if (format === 'png') {
//       chart.dataURI().then(({ imgURI }) => {
//         const link = document.createElement('a');
//         link.href = imgURI;
//         link.download = 'sales_comparison_chart.png';
//         link.click();
//       });
//     } else if (format === 'svg') {
//       chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
//         const link = document.createElement('a');
//         link.href = svgURI;
//         link.download = 'sales_comparison_chart.svg';
//         link.click();
//       });
//     } else if (format === 'csv') {
//       chart.exportToCSV({
//         filename: 'sales_comparison_data',
//       });
//     }
//   };

//   return (
//     <Card className="mb-4 box-background">
//       <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
//         <span className="chart-headers">Sales Comparison</span>
//         <div className="d-flex align-items-center gap-2">
//           <Dropdown>
//             <Dropdown.Toggle variant="outline-default" size="sm" className='download-dropdown-btn'>
//               {/* <Download style={{height : "18px",width:"18px", color:'#5671ff'}}/> */}
//               Export
//             </Dropdown.Toggle>
//             <Dropdown.Menu>
//               <Dropdown.Item onClick={() => handleDownload('png')}>Download PNG</Dropdown.Item>
//               <Dropdown.Item onClick={() => handleDownload('csv')}>Download CSV</Dropdown.Item>
//             </Dropdown.Menu>
//           </Dropdown>
//         </div>
//       </Card.Header>
//       <Card.Body>
//         <ReactApexChart
//           options={chartOptions}
//           series={chartData.series}
//           type="line"
//           height={350}
//         />
//       </Card.Body>
//     </Card>
//   );
// };

// export default SalesComparison;

import React, { useState, useEffect } from "react";
import ApexCharts from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { Card, Dropdown, Placeholder } from "react-bootstrap";
import gstService from "../../services/gst.service";
import "../../pages/Dashboard.css";
import "./charts.css";

const SalesComparison = ({ startDate, endDate }) => {
  const [chartData, setChartData] = useState({
    xAxis: [],
    series: [],
  });
  const [loading, setLoading] = useState(false); // Add loading state

  const colors = ["#347AE2", "#FF779D", "#FFD12C", "#20E5F3"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await gstService.getSalesComparison(
          startDate,
          endDate
        );

        const categories = [];
        const totalSalesData = [];
        const exemptSalesData = [];
        const zeroRatedSalesData = [];
        const gstTaxableSalesData = [];

        response.records.forEach((record) => {
          record.monthly_summary.forEach((summary) => {
            const date = new Date(record.year, summary.month - 1);
            categories.push(
              date.toLocaleString("default", {
                month: "short",
                year: "numeric",
              })
            );
            totalSalesData.push(summary.total_sales_income);
            exemptSalesData.push(summary.exempt_sales);
            zeroRatedSalesData.push(summary.zero_rated_sales);
            gstTaxableSalesData.push(summary.gst_taxable_sales);
          });
        });

        const allZero =
          totalSalesData.every((val) => val === 0) &&
          exemptSalesData.every((val) => val === 0) &&
          zeroRatedSalesData.every((val) => val === 0) &&
          gstTaxableSalesData.every((val) => val === 0);

        setChartData({
          xAxis: categories,
          series: allZero
            ? []
            : [
                { name: "Total Sales Income", data: totalSalesData },
                { name: "Exempt Sales", data: exemptSalesData },
                { name: "Zero Rated Sales", data: zeroRatedSalesData },
                { name: "GST Taxable Sales", data: gstTaxableSalesData },
              ],
        });
      } catch (error) {
        console.error("Error fetching sales comparison data:", error);
        setChartData({ xAxis: [], series: [] }); // Clear data on error
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    if (startDate && endDate) {
      fetchData();
    } else {
      setChartData({ xAxis: [], series: [] }); // Clear chart if dates are not selected
      setLoading(false);
    }
  }, [startDate, endDate]);

  const chartOptions = {
    chart: {
      id: "sales-comparison-chart",
      type: "line",
      height: 350,
      toolbar: { show: false },
      zoom: { enabled: true },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: chartData.xAxis,
    },
    yaxis: {
      title: { text: "Amount (PGK)" },
      labels: {
        formatter: (value) =>
          `PGK ${value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
    },
    tooltip: {
      y: {
        formatter: (value) =>
          `PGK ${value.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
      },
    },
    colors,
    legend: { position: "bottom" },
    noData: {
      text: "No Data Found",
      align: "center",
      verticalAlign: "middle",
      style: {
        color: "#6c757d",
        fontSize: "16px",
        fontFamily: "inherit",
      },
    },
  };

  // Toolbar functions
  const handleDownload = async (format) => {
    const chart = await ApexCharts.getChartByID("sales-comparison-chart");
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

  // Render loading skeleton
  if (loading) {
    return (
      <Card className="mb-4 box-background">
        <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
          <div className="chart-headers" style={{ height: "30px" }}></div>
        </Card.Header>
        <Card.Body>
          <Placeholder as="div" animation="glow" style={{ height: 350 }}>
            <Placeholder
              xs={12}
              style={{
                height: "100%",
                borderRadius: "0.25rem",
                backgroundColor: "#d5e6ff",
              }}
            />
          </Placeholder>
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

  // Render actual chart
  return (
    <Card className="mb-4 box-background">
      <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
        <span className="chart-headers">Sales Comparison</span>
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
        <ReactApexChart
          options={chartOptions}
          series={chartData.series}
          type="line"
          height={350}
        />
      </Card.Body>
    </Card>
  );
};

export default SalesComparison;
