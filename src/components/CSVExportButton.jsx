import { Download } from "lucide-react";
import React from "react";
import { Button } from "react-bootstrap";

const CSVExportButton = ({
  records,
  filename = "export.csv",
  buttonLabel = "Export CSV",
}) => {
  const exportToCSV = () => {
    console.log("received records", records);
    if (!records || records.length === 0) return;

    // Transform headers: remove underscores and capitalize each word
    const originalHeaders = Object.keys(records[0]);
    const formattedHeaders = originalHeaders.map((key) =>
      key
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    );

    const csvRows = [
      formattedHeaders.join(","), // header row
      ...records.map((record) =>
        originalHeaders
          .map((header) => {
            const cell = record[header];
            if (cell == null) return ""; // handle null/undefined
            const escaped = String(cell).replace(/"/g, '""'); // escape quotes
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename || "data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  return (
    <Button
      onClick={exportToCSV}
      variant="outline-default"
      className="chart-filter"
      title={buttonLabel}
      style={{background:"#fff", padding: '5px', cursor: 'pointer'}}
    >
      <Download style={{height : "18px",width:"18px", color:'#5671ff'}}/>
    </Button>
  );
};

export default CSVExportButton;
