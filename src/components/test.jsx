import React from "react";

const DownloadCSV = () => {
  const data = {
    large: {
      filing: 450,
      non_filing: 50,
      taxpayers: ["L001", "L002", "L003"]
    },
    medium: {
      filing: 900,
      non_filing: 300,
      taxpayers: ["M001", "M002", "M003"]
    },
    small: {
      filing: 2100,
      non_filing: 1400,
      taxpayers: ["S001", "S002"]
    },
    micro: {
      filing: 4000,
      non_filing: 6000,
      taxpayers: ["MI001", "MI002"]
    }
  };

  const handleDownload = () => {
    const rows = [["Category", "Taxpayer ID"]];

    Object.entries(data).forEach(([category, info]) => {
      if (info.taxpayers && Array.isArray(info.taxpayers)) {
        info.taxpayers.forEach(taxpayerId => {
          rows.push([category, taxpayerId]);
        });
      }
    });

    const csvContent = rows.map(row => row.join(",")).join("\n");
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
    <button onClick={handleDownload} style={{ padding: "10px 20px", fontSize: "16px" }}>
      Download CSV
    </button>
  );
};

export default DownloadCSV;
