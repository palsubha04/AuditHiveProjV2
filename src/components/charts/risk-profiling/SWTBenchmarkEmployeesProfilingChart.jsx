import { Tally1 } from 'lucide-react';
import React from 'react';
import Chart from 'react-apexcharts';

const SWTBenchmarkEmployeesProfilingChart = ({
  swtBenchmarkEmployeesProfilingData,
}) => {
  const series = [
    {
      name: 'Payroll Employees',
      data: [
        swtBenchmarkEmployeesProfilingData?.employees_on_payroll || 0,
        swtBenchmarkEmployeesProfilingData?.average_employees_on_payroll || 0,
      ],
    },
    {
      name: 'SWT Employees',
      data: [
        swtBenchmarkEmployeesProfilingData?.swt_employees || 0,
        swtBenchmarkEmployeesProfilingData?.average_swt_employees || 0,
      ],
    },
  ];

  const options = {
    chart: {
      type: 'bar',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 5,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Overall', 'Industry cum Segment Average'],
    },
    yaxis: {
      title: {
        text: 'Employee Count',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const isOverall = dataPointIndex === 0;

        const ratio = isOverall
          ? swtBenchmarkEmployeesProfilingData['swt_employees'] != 0
            ? (
                swtBenchmarkEmployeesProfilingData['employees_on_payroll'] /
                swtBenchmarkEmployeesProfilingData['swt_employees']
              ).toFixed(3)
            : 'N/A'
          : swtBenchmarkEmployeesProfilingData['average_swt_employees'] != 0
          ? (
              swtBenchmarkEmployeesProfilingData[
                'average_employees_on_payroll'
              ] / swtBenchmarkEmployeesProfilingData['average_swt_employees']
            ).toFixed(3)
          : 'N/A';

        const ratioLabel = isOverall
          ? 'Payroll vs SWT'
          : 'Average Payroll vs Average SWT';

        const value = series[seriesIndex][dataPointIndex];

        const barLabel =
          seriesIndex === 0 ? 'Payroll Employees' : 'SWT Employees';

        return `
          <div style="padding: 8px; font-size: 14px;">
            <div><strong>${barLabel}: $ ${value.toLocaleString()}</strong></div>
            <div style="color: #6c757d; margin-top: 4px;">${ratioLabel}: ${ratio}</div>
          </div>
        `;
      },
    },
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
    <div>
      <div
        style={{
          display: 'flex',
          // justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h4
          className="mb-0 me-3 fw-bold"
          style={{
            color: '#05004E',
            fontSize: '20px',
            fontWeight: 600,
            letterSpacing: '0px',
            lineHeight: '32px',
          }}
        >
          SWT Comparison - Employees On Payroll Vs SWT Employees
        </h4>
        {/* <Tally1 style={{ color: "#7c879d" }} /> */}
      </div>
      <Chart options={options} series={series} type="bar" height={430} />
      {/* Only render chart if series data exists */}
      {/* {riskBreakdownByCategoryData ? (series.length > 0 && (
            <Chart options={options} series={series} type="bar" height={350} />
          )) : <div>No data available</div>} */}
    </div>
  );
};

export default SWTBenchmarkEmployeesProfilingChart;
