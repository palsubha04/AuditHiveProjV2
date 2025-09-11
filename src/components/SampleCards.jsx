import React, {useState} from "react";
import "./SampleCards.css";
import {Eye, Download, X} from 'lucide-react'
import Papa from "papaparse";

const SampleCards = () => {
  const samples = [
    { name: "sample_gst.csv", label: "Sample GST" },
    { name: "sample_swt.csv", label: "Sample SWT" },
    { name: "sample_swt.csv", label: "Sample CIT" },
  ];

  const [isModalOpen, setModalOpen] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");

  const handleView = async (fileName, label) => {
    const response = await fetch(`/sample-csv/${fileName}`);
    const text = await response.text();

    const parsed = Papa.parse(text, { header: false });
    setCsvData(parsed.data);
    setModalTitle(label);
    setModalOpen(true);
  };

  const handleDownload = (fileName) => {
    const link = document.createElement("a");
    link.href = `/sample-csv/${fileName}`;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="sample-cards-container">
      {samples.map((sample) => (
        <div key={sample.name} className="sample-card">
          <h4 className="sample-card-title">{sample.label}</h4>
          <div className="sample-card-actions">
            <button
              className="sample-card-btn"
              onClick={() => handleView(sample.name, sample.label)}
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
            <div className="csv-modal-body">
              <table className="csv-table">
                <tbody>
                  {csvData.map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>

    
  );    
};

export default SampleCards;
