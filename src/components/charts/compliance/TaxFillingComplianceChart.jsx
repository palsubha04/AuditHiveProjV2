import { Download, Tally1 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import ApexCharts from "apexcharts";
import { Button, Card, CardBody, CardHeader, Col, Dropdown, Row } from "react-bootstrap";
import CSVExportButton from "../../CSVExportButton";

const sampleData = {
  start_date: '01-01-2020',
  end_date: '01-01-2022',
  gst: {
    large: {
      filing: 450,
      non_filing: 50,
      taxpayers: ['M001', 'M002', 'M003'],
    },
    medium: {
      filing: 900,
      non_filing: 300,
      taxpayers: ['M004', 'M005', 'M006'],
    },
    small: {
      filing: 2100,
      non_filing: 1400,
      taxpayers: ['M007', 'M008', 'M009'],
    },
    micro: {
      filing: 4000,
      non_filing: 6000,
      taxpayers: ['M007', 'M008', 'M009'],
    },
  },
  swt: {
    large: {
      filing: 420,
      non_filing: 80,
      taxpayers: ['M001', 'M002', 'M003'],
    },
    medium: {
      filing: 870,
      non_filing: 330,
      taxpayers: ['M007', 'M008', 'M009'],
    },
    small: {
      filing: 2000,
      non_filing: 1500,
      taxpayers: ['M007', 'M008', 'M009'],
    },
    micro: {
      filing: 3700,
      non_filing: 6300,
      taxpayers: ['M007', 'M008', 'M009'],
    },
  },
  cit: {
    large: {
      filing: 440,
      non_filing: 60,
      taxpayers: ['M007', 'M008', 'M009'],
    },
    medium: {
      filing: 880,
      non_filing: 320,
      taxpayers: ['M007', 'M008', 'M009'],
    },
    small: {
      filing: 2050,
      non_filing: 1450,
      taxpayers: ['M007', 'M008', 'M009'],
    },
    micro: {
      filing: 3900,
      non_filing: 6100,
      taxpayers: ['M007', 'M008', 'M009'],
    },
  },
};
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


const TaxFillingComplianceChart = ({ taxFilingComplianceData }) => {
  console.log('taxFilingComplianceData', taxFilingComplianceData);
  const [filterData, setFilterData] = useState(
    taxFilingComplianceData ? sampleData["gst"] ?? {} : {}
  );
  const [records, setRecords] = useState([]);

  const defaultCategory = 'gst';
  useEffect(() => {
    if (taxFilingComplianceData?.[defaultCategory]) {
      setFilterData(taxFilingComplianceData[defaultCategory]);
      const result = Object.entries(
        taxFilingComplianceData[defaultCategory]
      ).flatMap(([category, { records }]) =>
        records.map(({ tin, taxpayer_name, tax_period_year, tax_period_month }) => ({
          Tin: tin,
          'Taxpayer Name': taxpayer_name,
          'Tax Period Year': tax_period_year,
          'Tax Period Month': monthMap[tax_period_month],
          Segmentation: category,
        }))
      );

      setRecords(result);

    }
  }, [taxFilingComplianceData]);

  const changeCategoryData = (category) => {
    const selectedData = taxFilingComplianceData?.[category] ?? {};
    setFilterData(selectedData);
    const result = Object.entries(
      selectedData
    ).flatMap(([category, { records }]) =>
      records.map(({ tin, taxpayer_name, tax_period_year, tax_period_month }) => ({
        Tin: tin,
        'Taxpayer Name': taxpayer_name,
        'Tax Period Year': tax_period_year,
        'Tax Period Month': monthMap[tax_period_month] || tax_period_month,
        Segmentation: category,
      }))
    );

    setRecords(result);
  };

  // Define categories for x-axis
  const categories = ['large', 'medium', 'small', 'micro'];

  // Risk levels to be used for each series
  const riskLevels = [
    { key: 'filing', color: '#c0392b', title: 'Filing' },
    { key: 'non_filing', color: '#e74c3c', title: 'Non Filing' },
  ];
  console.log('filterdata', filterData);
  const series = riskLevels.map((level) => ({
    name: level.title,
    data: categories.map((cat) => filterData?.[cat]?.[level.key] ?? 0),
  }));
  console.log('series', series);

  var options = {
    chart: {
      id: 'tax-filing-non-filing-chart',
      type: 'bar',
      height: 350,
      toolbar: { show: false },
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
      categories: categories.map(
        (cat) => cat.charAt(0).toUpperCase() + cat.slice(1)
      ),
    },
    yaxis: {
      title: {
        text: 'Taxpayers',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
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

  const handleDownload = () => {
    const rows = [["Category", "Taxpayer ID"]];
    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "non_filing_taxpayers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toolbar functions
  const handleDownloadExport = async (format) => {
    const chart = await ApexCharts.getChartByID('tax-filing-non-filing-chart');
    if (!chart) return;

    if (format === 'png') {
      chart.dataURI().then(({ imgURI }) => {
        const link = document.createElement('a');
        link.href = imgURI;
        link.download = 'tax-filing-non-filing-chart.png';
        link.click();
      });
    } else if (format === 'svg') {
      chart.dataURI({ type: 'svg' }).then(({ svgURI }) => {
        const link = document.createElement('a');
        link.href = svgURI;
        link.download = 'tax-filing-non-filing-chart.svg';
        link.click();
      });
    } else if (format === 'csv') {
      chart.exportToCSV({
        filename: 'tax-filing-non-filing-chart',
      });
    }
  };

  return (
    <>
      <CardHeader className="chart-card-header">
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center gap-2">
            <span className="chart-headers">Tax Filing vs Non Filing</span>
            <select
              onChange={(e) => changeCategoryData(e.target.value)}
              className='chart-filter'
            >
              <option value="gst">GST</option>
              <option value="swt">SWT</option>
              <option value="cit">CIT</option>
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-default" size="sm" className='download-dropdown-btn'>
                {/* <Download style={{height : "18px",width:"18px", color:'#5671ff'}}/> */}
                Export
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleDownloadExport('png')}>Download PNG</Dropdown.Item>
                <Dropdown.Item onClick={() => handleDownloadExport('csv')}>Download CSV</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <CSVExportButton
              records={records}
              filename="filing_vs_nonfiling_taxpayer.csv"
              buttonLabel="Download Tax Filing vs Non Filing Taxpayer List"
            />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <Chart options={options} series={series} type="bar" height={400} />
      </CardBody>
    </>
  );
};

export default TaxFillingComplianceChart;
