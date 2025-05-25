// import { Tally1 } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import Chart from "react-apexcharts";
// import './charts.css'

// const riskLevels = [
//   "Critical Risk",
//   "High Risk",
//   "Moderate Risk",
//   "Elevated Risk",
//   "Low Risk",
//   "Very Low Risk",
// ];
// const colors = [
//   "#FF0000", // Critical Risk
//   "#FF7F00", // High Risk
//   "#FFD700", // Moderate Risk
//   "#FFFF00", // Elevated Risk
//   "#ADFF2F", // Low Risk
//   "#7CFC00", // Very Low Risk
//   "#00FF00", // Extra (if needed)
// ];

// const RiskAnalysisByIndustryChart = ({ riskData }) => {
//   console.log("riskData", riskData);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [selectedIndustry, setSelectedIndustry] = useState("");
//   const [filteredData, setFilteredData] = useState({});

//   // Safe access to categories
//   const categories = riskData ? Object.keys(riskData) : [];

//   const industries = riskData?.[selectedCategory]
//     ? Object.keys(riskData[selectedCategory])
//     : [];

//   useEffect(() => {
//     if (riskData && selectedCategory && selectedIndustry) {
//       const data = riskData[selectedCategory]?.[selectedIndustry];
//       setFilteredData(data || {});
//     } else {
//       setFilteredData({});
//     }
//   }, [riskData, selectedCategory, selectedIndustry]);

//   useEffect(() => {
//     // Set default selected category and industry on mount or when riskData changes
//     if (riskData) {
//       const defaultCategory = Object.keys(riskData)[0] || "";
//       const defaultIndustry = defaultCategory
//         ? Object.keys(riskData[defaultCategory])[0] || ""
//         : "";
//       setSelectedCategory(defaultCategory);
//       setSelectedIndustry(defaultIndustry);
//     }
//   }, [riskData]);

//   function generateRiskRanges() {
//     if (riskData && selectedCategory && selectedIndustry) {
//       const data = riskData[selectedCategory]?.[selectedIndustry];
//       if (data && typeof data === "object" && Object.keys(data).length > 0) {
//         let max = -Infinity;
//         let min = Infinity;

//         for (const size in data) {
//           const riskLevels = data[size];
//           for (const level in riskLevels) {
//             const value = riskLevels[level];
//             if (value > max) max = value;
//             if (value < min) min = value;
//           }
//         }

//         const range = max - min;
//         const step = range / 4;

//         const colors = ["#52C41A", "#FADB14", "#FA8C16", "#FF4D4F"];
//         const names = ["Low", "Medium", "High", "Very High"];

//         const ranges = [];

//         for (let i = 0; i < 4; i++) {
//           const from = Math.round(min + i * step);
//           const to = Math.round(min + (i + 1) * step) - 1;

//           ranges.push({
//             from,
//             to: i === 3 ? max : to,
//             color: colors[i],
//             name: names[i],
//           });
//         }

//         return ranges;
//       }
//     }
//     return [];
//   }

//   const series =
//     filteredData && typeof filteredData === "object"
//       ? Object.entries(filteredData).map(([size, risks]) => ({
//           name: size.charAt(0).toUpperCase() + size.slice(1),
//           data: riskLevels.map((level) => ({
//             x: level,
//             y: risks[level] || 0,
//           })),
//         }))
//       : [];

//   const options = {
//     chart: {
//       type: "heatmap",
//       toolbar: { show: true },
//       height: 350,
//     },
//     dataLabels: { enabled: true },

//     xaxis: {
//       type: "category",
//       categories: riskLevels,
//     },
//     plotOptions: {
//       heatmap: {
//         //shadeIntensity: 0.8,
//         colorScale: {
//           ranges: generateRiskRanges(),
//         },
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

//   //   if (!riskData) {
//   //     return <div>No data available</div>;
//   //   }

//   return (
//     <div>
//       <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
//         <span className='chart-headers'>Risk Analysis By Industry</span>
        
//         <div>
//           <select
//             className='chart-filter'
//             value={selectedCategory}
//             onChange={(e) => {
//               const newCategory = e.target.value;
//               const industryList = Object.keys(riskData?.[newCategory] || {});
//               const firstIndustry = industryList[0] || "";
//               setSelectedCategory(newCategory);
//               setSelectedIndustry(firstIndustry); // Reset industry when category changes
//             }}
//           >
//             {categories &&
//               categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat.toUpperCase()}
//                 </option>
//               ))}
//           </select>
//           <span className='mx-2' style={{ color: '#7c879d', fontSize: '16px'}}>and</span>
//           <select
//             className='chart-filter'
//             value={selectedIndustry}
//             onChange={(e) => setSelectedIndustry(e.target.value)}
//             disabled={!selectedCategory}
//           >
//             {industries.map((ind) => (
//               <option key={ind} value={ind}>
//                 {ind.charAt(0).toUpperCase() +
//                   ind.slice(1).replaceAll("_", " ")}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>
//       <Chart options={options} series={series} type="heatmap" height={400} />
//       {/* {riskData ? <Chart options={options} series={series} type="heatmap" height={400} />
//         : <div>No data available</div>} */}
//     </div>
//   );
// };

// export default RiskAnalysisByIndustryChart;
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import './charts.css';

const riskLevels = [
  "Critical Risk",
  "High Risk",
  "Moderate Risk",
  "Elevated Risk",
  "Low Risk",
  "Very Low Risk",
];

const RiskAnalysisByIndustryChart = ({ riskData }) => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [filteredData, setFilteredData] = useState({});

  const categories = riskData ? Object.keys(riskData) : [];
  const industries = selectedCategory && riskData?.[selectedCategory]
    ? Object.keys(riskData[selectedCategory])
    : [];

  useEffect(() => {
    if (riskData && selectedCategory && selectedIndustry) {
      const data = riskData[selectedCategory]?.[selectedIndustry];
      setFilteredData(data || {});
    } else {
      setFilteredData({});
    }
  }, [riskData, selectedCategory, selectedIndustry]);

  useEffect(() => {
    if (riskData) {
      const defaultCategory = Object.keys(riskData)[0] || "";
      const defaultIndustry = defaultCategory
        ? Object.keys(riskData[defaultCategory])[0] || ""
        : "";
      setSelectedCategory(defaultCategory);
      setSelectedIndustry(defaultIndustry);
    }
  }, [riskData]);

  const series =
    filteredData && typeof filteredData === "object"
      ? riskLevels.map((risk) => ({
          name: risk,
          data: ["micro", "small", "medium", "large"].map((size) =>
            filteredData[size]?.[risk] || 0
          ),
        }))
      : [];

  const options = {
    chart: {
      type: "bar",
      stacked: false,
      toolbar: { show: true },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: ["Micro", "Small", "Medium", "Large"],
      title: {
        text: "Business Size",
      },
    },
    yaxis: {
      title: {
        text: "Risk Count",
      },
    },
    colors: [
      "#F36464", "#FF779D","#f1c40f",
       "#FFD12C", "#00E096", "#34C759"
    ],
    legend: {
      position: "top",
    },
    tooltip: {
      shared: true,
      intersect: false,
    },
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
    <div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <span className='chart-headers'>Risk Analysis By Industry</span>

        <div>
          <select
            className='chart-filter'
            value={selectedCategory}
            onChange={(e) => {
              const newCategory = e.target.value;
              const industryList = Object.keys(riskData?.[newCategory] || {});
              const firstIndustry = industryList[0] || "";
              setSelectedCategory(newCategory);
              setSelectedIndustry(firstIndustry);
            }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
          <span className='mx-2' style={{ color: '#7c879d', fontSize: '16px' }}>and</span>
          <select
            className='chart-filter'
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            disabled={!selectedCategory}
          >
            {industries.map((ind) => (
              <option key={ind} value={ind}>
                {ind.charAt(0).toUpperCase() + ind.slice(1).replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Chart options={options} series={series} type="bar" height={400} />
    </div>
  );
};

export default RiskAnalysisByIndustryChart;

