// import React from 'react';
// import Chart from 'react-apexcharts';
// import './charts.css'

// const SwtSalariesChart = ({ data }) => {
//   // SWT Salaries Comparison Data
//   const monthlySummary = data?.records[0]?.monthly_summary || [];

//   const swtSalariesMonths = [
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

//   const swtSalariesChartOptions = {
//     chart: {
//       type: 'area',
//       toolbar: { show: false },
//       // background: '#fff' // Remove this line to eliminate white background
//     },
//     dataLabels: { enabled: false },
//     stroke: {
//       curve: 'smooth',
//       width: [2, 2, 2],
//     },
//     fill: {
//       type: 'gradient',
//       gradient: {
//         shadeIntensity: 1,
//         opacityFrom: 0.5,
//         opacityTo: 0.45,
//         stops: [0, 90, 100],
//       },
//     },
//     xaxis: {
//       categories: swtSalariesMonths,
//       title: { text: 'Month' },
//       labels: {
//         style: { colors: '#888', fontWeight: 500, fontSize: '14px' },
//       },
//       axisBorder: { show: true, color: '#e0e7ef' }, // Ensure border is visible and matches other chart
//       axisTicks: { show: true, color: '#e0e7ef' }, // Ensure ticks are visible and matches other chart
//       offsetY: 0, // Align with EmployeeLineChart
//       position: 'bottom',
//     },
//     yaxis: {
//       labels: {
//         style: { colors: '#888', fontWeight: 500, fontSize: '14px' },
//         formatter: (val) =>
//           val >= 1000 ? `${(val / 1000000).toFixed(1)}M` : val,
//       },
//     },
//     legend: {
//       position: 'top',
//       fontWeight: 700,
//       labels: {
//         colors: ['#4338ca', '#22c55e', '#f59e42'],
//       },
//     },
//     colors: ['#4338ca', '#22c55e', '#f59e42'],
//     tooltip: {
//       shared: true,
//       intersect: false,
//       style: { fontSize: '15px' },
//     },
//     grid: {
//       borderColor: '#e5e7eb',
//       strokeDashArray: 4,
//     },
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

//   const swtSalariesChartSeries = [
//     {
//       name: 'Total Salary Wages Paid',
//       data:
//         monthlySummary && monthlySummary.map((m) => m.total_salary_wages_paid),
//     },
//     {
//       name: 'SW Paid for SWT Deduction',
//       data:
//         monthlySummary &&
//         monthlySummary.map((m) => m.sw_paid_for_swt_deduction),
//     },
//     {
//       name: 'Total SWT Tax Deducted',
//       data:
//         monthlySummary && monthlySummary.map((m) => m.total_swt_tax_deducted),
//     },
//   ];

//   return (
//     <Chart
//       options={swtSalariesChartOptions}
//       series={swtSalariesChartSeries}
//       type="area"
//       height={430}
//     />
//   );
// };

// export default SwtSalariesChart;


import React from "react";
import Chart from "react-apexcharts";
import { format, addMonths } from "date-fns";
import "./charts.css";

// Parse "DD-MM-YYYY" to Date
const parseDDMMYYYY = (str) => {
  const [day, month, year] = str.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
};

// Generate month labels like ['May 19', 'Jun 19', ...]
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

const SwtSalariesChart = ({ data, start_date, end_date }) => {
  const startDate = start_date ? parseDDMMYYYY(start_date) : null;
  const endDate = end_date ? parseDDMMYYYY(end_date) : null;

  if (!startDate || !endDate || isNaN(startDate) || isNaN(endDate)) {
    return <div>Invalid date range</div>;
  }

  const categories = generateMonthLabels(startDate, endDate);

  const totalSalaryWagesPaid = getMonthlyValues(
    data?.records || [],
    "total_salary_wages_paid",
    categories
  );
  const swPaidForSwtDeduction = getMonthlyValues(
    data?.records || [],
    "sw_paid_for_swt_deduction",
    categories
  );
  const totalSwtTaxDeducted = getMonthlyValues(
    data?.records || [],
    "total_swt_tax_deducted",
    categories
  );

  const series = [
    {
      name: "Total Salary Wages Paid",
      data: totalSalaryWagesPaid,
    },
    {
      name: "SW Paid for SWT Deduction",
      data: swPaidForSwtDeduction,
    },
    {
      name: "Total SWT Tax Deducted",
      data: totalSwtTaxDeducted,
    },
  ];

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: [2, 2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.45,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories,
      title: { text: "Month" },
      labels: {
        style: { colors: "#888", fontWeight: 500, fontSize: "14px" },
      },
      axisBorder: { show: true, color: "#e0e7ef" },
      axisTicks: { show: true, color: "#e0e7ef" },
      offsetY: 0,
      position: "bottom",
    },
    yaxis: {
      labels: {
        style: { colors: "#888", fontWeight: 500, fontSize: "14px" },
        formatter: (val) =>
          val >= 1000000 ? `${(val / 1000000).toFixed(1)}M` : val,
      },
    },
    legend: {
      position: "top",
      fontWeight: 700,
      labels: {
        colors: ["#4338ca", "#22c55e", "#f59e42"],
      },
    },
    colors: ["#4338ca", "#22c55e", "#f59e42"],
    tooltip: {
      shared: true,
      intersect: false,
      style: { fontSize: "15px" },
    },
    grid: {
      borderColor: "#e5e7eb",
      strokeDashArray: 4,
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

  return <Chart options={options} series={series} type="area" height={430} />;
};

export default SwtSalariesChart;
