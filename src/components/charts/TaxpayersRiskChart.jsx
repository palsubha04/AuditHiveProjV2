// import React from 'react';
// import ReactApexChart from 'react-apexcharts';
// import './charts.css'

// const TaxpayersRiskChart = ({ data, start_date, end_date }) => {
//   // Prepare data for the chart from the new data structure
//   const monthlySummary = data?.records[0]?.monthly_summary || [];
//   //console.log('data from chart', monthlySummary);

//   // Map months to labels (e.g., Jan, Feb, ...)
//   const monthLabels = [
//     "",
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   // Extract months present in the data and sort them
//   const categories = monthlySummary
//     .map((item) => monthLabels[item.month])
//     .filter(Boolean);

//   const gstPayableData = monthlySummary.map((item) => item.gst_payable);
//   const gstRefundableData = monthlySummary.map((item) => item.gst_refundable);

//   const series = [
//     {
//       name: "GST Payable",
//       data: gstPayableData,
//     },
//     {
//       name: "GST Refundable",
//       data: gstRefundableData,
//     },
//   ];

//   const options = {
//     chart: {
//       type: "bar",
//       toolbar: { show: false },
//       background: "transparent",
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: "40%",
//         borderRadius: 6,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       show: true,
//       width: 2,
//       colors: ["transparent"],
//     },
//     colors: ["#5B5FF6", "#7DD3FC"],
//     xaxis: {
//       categories: categories,
//       labels: {
//         style: {
//           fontSize: "14px",
//           colors: "#A3A3C2",
//         },
//       },
//       axisBorder: { show: true, color: "#e0e7ef" },
//       axisTicks: { show: true, color: "#e0e7ef" },
//       position: "bottom",
//     },
//     yaxis: {
//       labels: {
//         formatter: (val) => `${Math.round(val / 1000)}K`,
//         style: {
//           fontSize: "14px",
//           colors: "#A3A3C2",
//         },
//       },
//       min: 0,
//       max: Math.max(...gstPayableData, ...gstRefundableData) * 1.1,
//       tickAmount: 4,
//     },
//     legend: {
//       show: true,
//       position: "top",
//       horizontalAlign: "center",
//       markers: {
//         radius: 12,
//       },
//       labels: {
//         colors: ["#5B5FF6", "#7DD3FC"],
//       },
//     },
//     tooltip: {
//       y: {
//         formatter: (val) =>
//           `${val.toLocaleString("en-US", {
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//           })}`,
//       },
//       custom: function ({ series, seriesIndex, dataPointIndex, w }) {
//         const taxType = categories[dataPointIndex];
//         const value = series[seriesIndex][dataPointIndex];
//         const label = seriesIndex === 0 ? "GST Payable" : "GST Refundable";
//         return `<div style="padding:10px 16px;background:#45457A;color:#fff;border-radius:10px;box-shadow:0 2px 8px #0002;">
//           <div style="font-size:15px;font-weight:500;">${taxType} - ${label}</div>
//           <div style="font-size:18px;font-weight:600;">${value.toLocaleString(
//             "en-US"
//           )}</div>
//         </div>`;
//       },
//     },
//     grid: {
//       borderColor: "#E5E7EB",
//       strokeDashArray: 4,
//       yaxis: {
//         lines: { show: true },
//       },
//       xaxis: {
//         lines: { show: false },
//       },
//     },
//     noData: {
//       text: "No Data Found",
//       align: "center",
//       verticalAlign: "middle",
//       offsetX: 0,
//       offsetY: 0,
//       style: {
//         color: "#6c757d",
//         fontSize: "16px",
//         fontFamily: "inherit",
//       },
//     },
//   };

//   return (
//     <ReactApexChart options={options} series={series} type="bar" height={430} />
//   );
// };

// export default TaxpayersRiskChart;

import React from "react";
import ReactApexChart from "react-apexcharts";
import { format, addMonths } from "date-fns";
import "./charts.css";

// Util to parse DD-MM-YYYY
const parseDDMMYYYY = (str) => {
  const [day, month, year] = str.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
};

// Generate labels from start to end
const generateMonthLabels = (start, end) => {
  const labels = [];
  let current = new Date(start.getFullYear(), start.getMonth(), 1);
  const last = new Date(end.getFullYear(), end.getMonth(), 1);

  while (current <= last) {
    labels.push(format(current, "MMM yy"));
    current = addMonths(current, 1);
  }

  return labels;
};

// Map data to month label -> value
const getMonthlyValues = (data, key, labels) => {
  const map = new Map();
  data?.forEach((yearData) => {
    const year = yearData.year;
    yearData.monthly_summary.forEach((item) => {
      const label = format(new Date(year, item.month), "MMM yy");
      map.set(label, item[key]);
    });
  });

  return labels.map((label) => map.get(label) || 0);
};

const TaxpayersRiskChart = ({ data, start_date, end_date }) => {
  const startDate = start_date ? parseDDMMYYYY(start_date) : null;
  const endDate = end_date ? parseDDMMYYYY(end_date) : null;

  if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
    return <div>Invalid date range</div>;
  }

  const categories = generateMonthLabels(startDate, endDate);

  const gstPayableData = getMonthlyValues(
    data?.records || [],
    "gst_payable",
    categories
  );
  const gstRefundableData = getMonthlyValues(
    data?.records || [],
    "gst_refundable",
    categories
  );

  const series = [
    {
      name: "GST Payable",
      data: gstPayableData,
    },
    {
      name: "GST Refundable",
      data: gstRefundableData,
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      background: "transparent",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 6,
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    colors: ["#5B5FF6", "#7DD3FC"],
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: "14px",
          colors: "#A3A3C2",
        },
      },
      axisBorder: { show: true, color: "#e0e7ef" },
      axisTicks: { show: true, color: "#e0e7ef" },
      position: "bottom",
    },
    yaxis: {
      labels: {
        formatter: (val) => `${Math.round(val / 1000)}K`,
        style: {
          fontSize: "14px",
          colors: "#A3A3C2",
        },
      },
      min: 0,
      max: Math.max(...gstPayableData, ...gstRefundableData) * 1.1,
      tickAmount: 4,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "center",
      markers: { radius: 12 },
      labels: {
        colors: ["#5B5FF6", "#7DD3FC"],
      },
    },
    tooltip: {
      y: {
        formatter: (val) =>
          `${val.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`,
      },
      custom: function ({ series, seriesIndex, dataPointIndex }) {
        const taxType = categories[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        const label = seriesIndex === 0 ? "GST Payable" : "GST Refundable";
        return `<div style="padding:10px 16px;background:#45457A;color:#fff;border-radius:10px;box-shadow:0 2px 8px #0002;">
          <div style="font-size:15px;font-weight:500;">${taxType} - ${label}</div>
          <div style="font-size:18px;font-weight:600;">${value.toLocaleString(
            "en-US"
          )}</div>
        </div>`;
      },
    },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
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

  return (
    <ReactApexChart options={options} series={series} type="bar" height={430} />
  );
};

export default TaxpayersRiskChart;
