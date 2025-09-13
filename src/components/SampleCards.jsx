import React, { useState } from "react";
import "./SampleCards.css";
import { Eye, Download, X } from "lucide-react";
import Papa from "papaparse";
import Spreadsheet from "react-spreadsheet";

const SampleCards = () => {
  const samples = [
    { name: "sample_gst.csv", label: "sample_gst.csv" },
    { name: "sample_swt.csv", label: "sample_swt.csv" },
    { name: "sample_cit.csv", label: "sample_cit.csv" },
  ];

  const [isModalOpen, setModalOpen] = useState(false);
  const [spreadsheetData, setSpreadsheetData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const handleViewExcel = async (fileName, label) => {
    try {
      const response = await fetch(`/sample-csv/${fileName}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const text = await response.text();

      const parsed = Papa.parse(text, { header: false });

      // Transform the data to the format required by react-spreadsheet
      const transformedData = parsed.data.map((row) =>
        row.map((cell) => ({ value: cell, readOnly: true }))
      );

      setSpreadsheetData(transformedData);
      setModalTitle(label);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching or parsing CSV:", error);
      // Handle error, e.g., show an alert
    }
  };

  const handleDownload = (fileName) => {
    const link = document.createElement("a");
    link.href = `/sample-csv/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link); // Append to body for Firefox compatibility
    link.click();
    document.body.removeChild(link); // Clean up
  };

  return (
    <div className="sample-cards-container">
      {samples.map((sample) => (
        <div key={sample.name} className="sample-card">
          <h4 className="sample-card-title">{sample.label}</h4>
          <div className="sample-card-actions">
            <button
              className="sample-card-btn"
              onClick={() => handleViewExcel(sample.name, sample.label)}
            >
              <Eye size={18} />
            </button>
            <button
              className="sample-card-btn"
              onClick={() => handleDownload(sample.name)}
            >
              <Download size={18} />
            </button>
          </div>
        </div>
      ))}

      {isModalOpen && (
        <div className="csv-modal-overlay">
          <div className="csv-modal">
            <div className="csv-modal-header">
              <h3>{modalTitle}</h3>
              <button
                className="csv-modal-close"
                onClick={() => setModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="csv-modal-body spreadsheet-container">
              {/* Render react-spreadsheet component here */}
              <Spreadsheet data={spreadsheetData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleCards;
