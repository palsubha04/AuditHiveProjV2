import { Download, Tally1 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Button, Card, Col, Row } from "react-bootstrap";

const sampleData = {
  start_date: "01-01-2020",
  end_date: "01-01-2022",
  gst: {
    large: {
      filing: 450,
      non_filing: 50,
      taxpayers: ["M001", "M002", "M003"],
    },
    medium: {
      filing: 900,
      non_filing: 300,
      taxpayers: ["M004", "M005", "M006"],
    },
    small: {
      filing: 2100,
      non_filing: 1400,
      taxpayers: ["M007", "M008", "M009"],
    },
    micro: {
      filing: 4000,
      non_filing: 6000,
      taxpayers: ["M007", "M008", "M009"],
    },
  },
  swt: {
    large: {
      filing: 420,
      non_filing: 80,
      taxpayers: ["M001", "M002", "M003"],
    },
    medium: {
      filing: 870,
      non_filing: 330,
      taxpayers: ["M007", "M008", "M009"],
    },
    small: {
      filing: 2000,
      non_filing: 1500,
      taxpayers: ["M007", "M008", "M009"],
    },
    micro: {
      filing: 3700,
      non_filing: 6300,
      taxpayers: ["M007", "M008", "M009"],
    },
  },
  cit: {
    large: {
      filing: 440,
      non_filing: 60,
      taxpayers: ["M007", "M008", "M009"],
    },
    medium: {
      filing: 880,
      non_filing: 320,
      taxpayers: ["M007", "M008", "M009"],
    },
    small: {
      filing: 2050,
      non_filing: 1450,
      taxpayers: ["M007", "M008", "M009"],
    },
    micro: {
      filing: 3900,
      non_filing: 6100,
      taxpayers: ["M007", "M008", "M009"],
    },
  },
};

const TaxFillingComplianceChart = ({ taxFilingComplianceData }) => {
  console.log("taxFilingComplianceData", taxFilingComplianceData);
  const [filterData, setFilterData] = useState(
    taxFilingComplianceData ? sampleData["gst"] ?? {} : {}
  );

  const defaultCategory = "gst";
  useEffect(() => {
    if (taxFilingComplianceData?.[defaultCategory]) {
      setFilterData(taxFilingComplianceData[defaultCategory]);
    }
  }, [taxFilingComplianceData]);

  const changeCategoryData = (category) => {
    const selectedData = taxFilingComplianceData?.[category] ?? {};
    setFilterData(selectedData);
  };

  // Define categories for x-axis
  const categories = ["large", "medium", "small", "micro"];

  // Risk levels to be used for each series
  const riskLevels = [
    { key: "filing", color: "#c0392b", title: "Filing" },
    { key: "non_filing", color: "#e74c3c", title: "Non Filing" },
  ];
  console.log("filterdata", filterData);
  const series = riskLevels.map((level) => ({
    name: level.title,
    data: categories.map((cat) => filterData?.[cat]?.[level.key] ?? 0),
  }));
  console.log("series", series);

  var options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories.map(
        (cat) => cat.charAt(0).toUpperCase() + cat.slice(1)
      ),
    },
    yaxis: {
      title: {
        text: "Taxpayers",
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

  const handleDownload = () => {
    const rows = [["Category", "Taxpayer ID"]];

    Object.entries(filterData).forEach(([category, info]) => {
      if (info.taxpayers && Array.isArray(info.taxpayers)) {
        info.taxpayers.forEach((taxpayerId) => {
          rows.push([category, taxpayerId]);
        });
      }
    });

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

  return (
    <>
    <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
    <span className='chart-headers'>Tax Filing vs Non Filing</span>
    <Tally1 style={{ color: "#7c879d" }} />
               <span
                style={{
                  color: "#7c879d",
                  fontSize: "16px",
                  marginRight: "10px",
                }}
              >
                Filter By :{" "}
              </span>
    <select
      
      onChange={(e) => changeCategoryData(e.target.value)}
      className='chart-filter'
    >
      <option value="gst">GST</option>
      <option value="swt">SWT</option>
      <option value="cit">CIT</option>
    </select>
    <Button
                onClick={handleDownload}
                className="mx-2"
                tooltip="Download Non-Filing CSV"
                variant="outline-primary"
                size="sm"
                title="Download Non-Filing CSV"
              >
                <Download />
              </Button>
  </div>
  <Chart options={options} series={series} type="bar" height={350} />
  </>
    // <Card className="mb-4 box-background">
    //   <Card.Body>
    //     <Row className="mb-4">
    //       <Col>
    //         <div
    //           style={{
    //             display: "flex",
    //             alignItems: "center",
    //             marginBottom: 16,
    //           }}
    //         >
    //           <h4
    //             className="mb-0 me-3 fw-bold"
    //             style={{ color: "#6366F1", fontSize: "22px" }}
    //           >
    //             Tax Filing vs Non Filing
    //           </h4>
    //           <Tally1 style={{ color: "#7c879d" }} />
    //           <span
    //             style={{
    //               color: "#7c879d",
    //               fontSize: "16px",
    //               marginRight: "10px",
    //             }}
    //           >
    //             Filter By :{" "}
    //           </span>

    //           <select
    //             onChange={(e) => changeCategoryData(e.target.value)}
    //             style={{
    //               padding: "4px 8px",
    //               borderRadius: 4,
    //               border: "1px solid #ccc",
    //             }}
    //           >
    //             <option value="gst">GST</option>
    //             <option value="swt">SWT</option>
    //             <option value="cit">CIT</option>
    //           </select>
    //           <Button
    //             onClick={handleDownload}
    //             className="mx-2"
    //             tooltip="Download Non-Filing CSV"
    //             variant="outline-primary"
    //             size="sm"
    //             title="Download Non-Filing CSV"
    //           >
    //             <Download />
    //           </Button>
    //         </div>
    //       </Col>
    //     </Row>
    //     <Chart options={options} series={series} type="bar" height={350} />
    //     {/* <ReactApexChart
    //       options={chartOptions}
    //       series={chartData.series}
    //       type="line"
    //       height={350}
    //     /> */}
    //     chart
    //   </Card.Body>
    // </Card>
  );
};

export default TaxFillingComplianceChart;
