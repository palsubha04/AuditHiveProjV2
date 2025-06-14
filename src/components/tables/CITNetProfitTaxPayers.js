import React, { useState, useEffect } from "react";
import { Card, Placeholder, Spinner } from "react-bootstrap";
import Table from "../Table";
import citService from "../../services/cit.service";
import "../../pages/Dashboard.css";
import CSVExportButton from "../CSVExportButton";

const CITNetProfitTaxPayers = ({ startDate, endDate }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [searchTin, setSearchTin] = useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalRecords, setTotalRecords] = useState(0);
  // const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchRecords = async () => {
    // if (append && (loading || isLoadingMore)) return;

    // if (page === 1) {
    setLoading(true);
    // } else {
    //   setIsLoadingMore(true);
    // }

    setError(null);
    try {
      let response;
      //   if (tin) {
      //     response = await citService.getNetProfitTaxPayersByTIN(tin, startDate, endDate, page);
      //     if (response.error) {
      //       setError(response.error);
      //       setRecords([]);
      //     } else {
      //       setRecords(Array.isArray(response.records) ? response.records : []);
      //       setError(null);
      //     }
      //   } else {
      response = await citService.getNetProfitTaxPayers(startDate, endDate);
      // if (append) {
      //   setRecords(prev => [...prev, ...response.records]);
      // } else {
      //   setRecords(response.records);
      // }
      // }
      setRecords(response);
      // setTotalRecords(response.total_data_count);
    } catch (err) {
      setError("Failed to fetch tax records");
    } finally {
      setLoading(false);
      // setIsLoadingMore(false);
    }
  };

  // Debounced search function
  //   const debouncedSearch = useCallback(
  //     debounce((value) => {
  //       setCurrentPage(1);
  //       if (value) {
  //         fetchRecords(value);
  //       } else {
  //         fetchRecords();
  //       }
  //     }, 500),
  //     [startDate, endDate]
  //   );

  // Handle search input change
  //   const handleSearchChange = (e) => {
  //     const value = e.target.value;
  //     setSearchTin(value);
  //     debouncedSearch(value);
  //   };

  useEffect(() => {
    if (startDate && endDate) {
      // setCurrentPage(1);
      fetchRecords();
    }
  }, [startDate, endDate]);

  //   const handleLoadMore = useCallback(() => {
  //     if (records.length < totalRecords && !loading && !isLoadingMore) {
  //       const nextPage = currentPage + 1;
  //       setCurrentPage(nextPage);
  //       fetchRecords(searchTin, nextPage, true);
  //     }
  //   }, [records.length, totalRecords, loading, isLoadingMore, currentPage, searchTin]);

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
      header: "Total Operating Expense",
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
        <span className="chart-headers">Top 50 Net Profit Tax Payers</span>
        <CSVExportButton
          records={records}
          filename="Top 50 Net Profit.csv"
          buttonLabel="Download Top 50 Net Profit List"
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
            className="text-center text-muted"
            style={{
              height: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            No Data Found
          </div>
        ) : (
          <div
            style={{
              height: "400px",
              display: "flex",
              flexDirection: "column",
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

export default CITNetProfitTaxPayers;
