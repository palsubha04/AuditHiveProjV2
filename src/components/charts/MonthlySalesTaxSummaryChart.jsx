import React from 'react';
import Chart from 'react-apexcharts';
import './charts.css';
import { CardBody, CardHeader } from 'react-bootstrap';

// const MonthlySalesTaxSummaryChart = ({ salesData, start_date, end_date }) => {
//   console.log("start end",start_date,end_date);
//   const startDate = parseISO(start_date);
//   const endDate = parseISO(end_date);
//   let chartData = {};
//   if (salesData && Object.keys(salesData).length > 0 && salesData.records) {
//     chartData = salesData.records[0];
//   }
//   console.log("main data", chartData, salesData);

//   const months = [
//     'Jan',
//     'Feb',
//     'Mar',
//     'Apr',
//     'May',
//     'Jun',
//     'Jul',
//     'Aug',
//     'Sep',
//     'Oct',
//     'Nov',
//     'Dec',
//   ];

//   const chartSeries = [
//     {
//       name: 'Sales Income',
//       data: chartData?.monthly_summary?.map((m) => m.total_sales_income) || [],
//     },
//     {
//       name: 'Taxable Sales',
//       data: chartData?.monthly_summary?.map((m) => m.gst_taxable_sales) || [],
//     },
//     {
//       name: 'Zero Rated Sales',
//       data: chartData?.monthly_summary?.map((m) => m.zero_rated_sales) || [],
//     },
//     {
//       name: 'Exempt Sales',
//       data: chartData?.monthly_summary?.map((m) => m.exempt_sales) || [],
//     },
//   ];

//   const chartOptions = {
//     chart: {
//       type: 'line',
//       toolbar: { show: false },
//     },
//     stroke: {
//       width: [3, 3, 2, 2],
//       curve: 'smooth',
//     },
//     xaxis: {
//       categories: months,
//       title: { text: 'Month' },
//     },
//     yaxis: {
//       labels: {
//         formatter: (val) =>
//           val >= 1000 ? `${(val / 1000000).toFixed(1)}M` : val,
//       },
//     },
//     legend: {
//       position: 'top',
//     },
//     colors: ['#2563eb', '#22c55e', '#f59e42', '#a0aec0'],
//     noData: {
//       text: 'No Data Found',
//       align: 'center',
//       verticalAlign: 'middle',
//       offsetX: 0,
//       offsetY: 0,
//       style: {
//         color: '#6c757d',
//         fontSize: '16px',
//         fontFamily: 'inherit',
//       },
//     },
//   };
//   return (
//     <div>
//       <Chart
//         options={chartOptions}
//         series={chartSeries}
//         type="line"
//         height={430}
//       />
//     </div>
//   );
// };

// export default MonthlySalesTaxSummaryChart;

import React from "react";
import Chart from "react-apexcharts";
import { format, parseISO, addMonths, isBefore } from "date-fns";
import "./charts.css";

const parseDDMMYYYY = (str) => {
  const [day, month, year] = str.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
};


const MonthlySalesTaxSummaryChart = ({ salesData, start_date, end_date }) => {
  console.log("start end _", start_date, end_date)
  // Parse dates safely
  const startDate = start_date ? parseDDMMYYYY(start_date) : null;
  const endDate = end_date ? parseDDMMYYYY(end_date) : null;

  console.log('startdate enddate',startDate,endDate)

  // Early return if dates aren't ready
  if (!startDate || !endDate) {
    return <div>Please provide valid start and end dates.</div>;
  }

  // Generate all month labels between start_date and end_date
  const generateMonthLabels = (start, end) => {
    const labels = [];
    let current = new Date(start);
    while (
      isBefore(current, end) ||
      (current.getMonth() === end.getMonth() &&
        current.getFullYear() === end.getFullYear())
    ) {
      labels.push(format(current, "MMM yy")); // "Jan 22"
      current = addMonths(current, 1);
    }
    return labels;
  };

  const monthLabels = generateMonthLabels(startDate, endDate);
  console.log("month labels",monthLabels)

  // Create a map of data by "MMM yy" → entry
  const createMonthDataMap = (data = []) => {
    const map = {};
    data.forEach((yearData) => {
      const { year, monthly_summary = [] } = yearData;
      monthly_summary.forEach((entry) => {
        const date = new Date(year, entry.month);
        const label = format(date, "MMM yy");
        map[label] = entry;
      });
    });
    return map;
  };

  const monthDataMap = createMonthDataMap(salesData?.records);
  console.log("month datamap", monthDataMap);


  const getSeriesData = (key) =>
    monthLabels.map((label) => monthDataMap[label]?.[key] ?? 0);

  const chartSeries = [
    {
      name: "Sales Income",
      data: getSeriesData("total_sales_income"),
    },
    {
      name: "Taxable Sales",
      data: getSeriesData("gst_taxable_sales"),
    },
    {
      name: "Zero Rated Sales",
      data: getSeriesData("zero_rated_sales"),
    },
    {
      name: "Exempt Sales",
      data: getSeriesData("exempt_sales"),
    },
  ];
  console.log("chart series", chartSeries);

  const chartOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      width: [3, 3, 2, 2],
      curve: "smooth",
    },
    xaxis: {
      categories: monthLabels,
      title: { text: "Month" },
    },
    yaxis: {
      labels: {
        formatter: (val) =>
          val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val,
      },
    },
    legend: {
      position: "top",
    },
    colors: ["#2563eb", "#22c55e", "#f59e42", "#a0aec0"],
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

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="chart-headers">GST Sales Comparison</div>
      </CardHeader>
      <CardBody>
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="line"
          height={430}
        />
      </CardBody>
    </>
  );
};

export default MonthlySalesTaxSummaryChart;

