import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import Layout from "../components/Layout";
import { set } from "date-fns";

const ExcelViewer = ({taxpayerReportData}) => {
    console.log("taxpayerReportData", taxpayerReportData);
  const [data, setData] = useState([]);

  useEffect(() => {
    // fetch("/consolidated_report.xlsx")
    //   .then((res) => res.arrayBuffer())
    //   .then((buffer) => {
    //     const workbook = XLSX.read(buffer, { type: "array" });
    //     const sheetName = workbook.SheetNames[0];
    //     const sheet = workbook.Sheets[sheetName];
    //     const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    //     setData(json);
    //     console.log("Excel data loaded:", data);
    //   })
    //   .catch((err) => console.error("Error loading Excel file:", err));
    setData(taxpayerReportData ? taxpayerReportData : []);

  }, [taxpayerReportData]);

  return (
  
   
     
      <div className="overflow-auto">
        {data.length > 0 ? (
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
            <tr>
  {Object.keys(data[0])
    .filter((key) => !key.includes("EMPTY"))
    .map((key) => (
      <th
        key={key}
        colSpan={Object.keys(data[0]).length}
        style={{ textAlign: "center", fontSize: "1.2rem" }}
        className="border px-4 py-2 bg-gray-200"
      >
        {key}
      </th>
    ))}
</tr>
<tr>
{Object.entries(data[0])
  .filter(([key]) => !key.includes("EMPTY"))
  .map(([key, value]) => (
    <th
      key={key}
      colSpan={Object.keys(data[0]).length}
      style={{ textAlign: "center" }}
      className="border px-4 py-2 bg-gray-200"
    >
      {value}
    </th>
  ))}
</tr>
            </thead>
            <tbody>

            {data.map((row, i) =>
  i > 0 && (
    <tr key={i}>
      {Object.values(row).map((val, j) => (
        <td key={j} className="border px-4 py-2">
          {val}
        </td>
      ))}
    </tr>
  )
)}
            </tbody>
          </table>
        ) : (
          <p>Loading Excel data...</p>
        )}
      </div>
   

  );
};

export default ExcelViewer;