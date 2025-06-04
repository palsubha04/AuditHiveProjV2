import React, { useState, useEffect, useCallback } from "react";
import { Card, Placeholder, Spinner } from "react-bootstrap";
import Table from "../Table";
import citService from "../../services/cit.service";
import "../../pages/Dashboard.css";
import CSVExportButton from "../CSVExportButton";

const CITNetLossTaxPayers = ({ startDate, endDate }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);

    setError(null);
    try {
      let response;
      response = await citService.getNetLossTaxPayers(startDate, endDate);
      setRecords(response);
    } catch (err) {
      setError("Failed to fetch tax records");
      error("Error fetching tax records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchRecords();
    }
  }, [startDate, endDate]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PGK",
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const columns = [
    {
      accessorKey: "tin",
      header: "TIN",
    },
    {
      accessorKey: "taxpayer_name",
      header: "Taxpayer Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    {
      accessorKey: "segmentation",
      header: "Segmentation",
    },
    {
      accessorKey: "total_gross_income",
      header: "Total Gross Income",
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: "total_operating_expense",
      header: "Total Operating Expenses",
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: "current_year_profit_loss_710",
      header: "Current Year Profit/Loss",
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
  ];

  if (loading) {
    return (
      <Card className="mb-4 box-background">
        <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
          <div className="chart-headers" style={{ height: "30px" }}></div>
        </Card.Header>
        <Card.Body>
          <Placeholder as="div" animation="glow" style={{ height: 350 }}>
            <Placeholder
              xs={12}
              style={{
                height: "100%",
                borderRadius: "0.25rem",
                backgroundColor: "#d5e6ff",
              }}
            />
          </Placeholder>
          <div className="d-flex justify-content-around mt-3">
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
            <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
          </div>
        </Card.Body>
      </Card>
    );
  }


  return (
    <Card
      className="mb-4 box-background"
      style={records.length === 0 ? {} : { border: "none" }}
    >
      <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
        <span className="chart-headers">Top 50 Net Loss Tax Payers</span>
        <CSVExportButton
          records={records}
          filename="Top 50 Net Loss.csv"
          buttonLabel="Download Top 50 Net Loss List"
        />
      </Card.Header>
      <Card.Body className="pt-0 px-0">
        {loading ? (
          <div
            className="text-center"
            style={{
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : records.length === 0 ? (
          <div
            className="text-center"
            style={{
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div className="text-center text-muted" style={{ padding: "2rem" }}>
              No Data Found
            </div>
          </div>
        ) : (
          <div
            style={{
              height: "400px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Table
              columns={columns}
              data={records}
              loading={loading}
              error={error}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CITNetLossTaxPayers;
