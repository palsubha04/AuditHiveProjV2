import React, { useState, useEffect, useCallback } from "react";
import { Card, Form, Badge, Placeholder } from "react-bootstrap";
import Table from "../Table";
import swtService from "../../services/swt.service";
import debounce from "lodash/debounce";
import "../../pages/Dashboard.css";
import { Search } from "lucide-react";

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
  12: "December",
};

const SWTTaxRecordsTable = ({ startDate, endDate }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTin, setSearchTin] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchRecords = async (tin = "", page = 1, append = false) => {
    if (append && (loading || isLoadingMore)) return;

    if (page === 1) {
      setLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    setError(null);
    try {
      let response;
      if (tin) {
        response = await swtService.getTaxRecordsByTIN(
          tin,
          startDate,
          endDate,
          page
        );
        const modified = response.records.map((item) => ({
          ...item,
          tax_period_month:
            monthMap[item.tax_period_month] || item.tax_period_month,
        }));
        if (response.error) {
          setError(response.error);
          setRecords([]);
        } else {
          setRecords(Array.isArray(response.records) ? modified : []);
          setError(null);
        }
      } else {
        response = await swtService.getTaxRecords(startDate, endDate, page);
        const modified = response.records.map((item) => ({
          ...item,
          tax_period_month:
            monthMap[item.tax_period_month] || item.tax_period_month,
        }));
        if (append) {
          setRecords((prev) => [...prev, ...modified]);
        } else {
          setRecords(modified);
        }
      }
      setTotalRecords(response.total_data_count);
    } catch (err) {
      setError("Failed to fetch tax records");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      if (value) {
        fetchRecords(value);
      } else {
        fetchRecords();
      }
    }, 500),
    [startDate, endDate]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTin(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (startDate && endDate) {
      setCurrentPage(1);
      fetchRecords();
    }
  }, [startDate, endDate]);

  const handleLoadMore = useCallback(() => {
    if (records.length < totalRecords && !loading && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchRecords(searchTin, nextPage, true);
    }
  }, [
    records.length,
    totalRecords,
    loading,
    isLoadingMore,
    currentPage,
    searchTin,
  ]);

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
      accessorKey: "employees_on_payroll",
      header: "Employees on Payroll",
    },
    {
      accessorKey: "employees_paid_swt",
      header: "Employees Paid SWT",
    },
    {
      accessorKey: "total_salary_wages_paid",
      header: "Total Salary Wages Paid",
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: "sw_paid_for_swt_deduction",
      header: "Salary Wages Paid for SWT Deduction",
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: "total_swt_tax_deducted",
      header: "Total SWT Tax Deducted",
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: "is_fraud",
      header: "Is Fraud",
      cell: ({ getValue }) => {
        const isFraud = getValue();
        return (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 12px",
              borderRadius: "16px", // Adjust for more or less rounded corners
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isFraud ? "#FF3535" : "#34C759", // Red for Fraud, Green for Valid
                marginRight: "8px",
              }}
            ></span>
            <span
              style={{
                color: "#000000",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {isFraud ? "Fraud" : "Valid"}
            </span>
          </div>
        );
      },
      header: "Is Fraud", // Keep this if you want to prevent filtering on this column
    },
    // {
    //   accessorKey: 'fraud_reason',
    //   header: 'Fraud Reason',
    //   cell: ({ getValue }) => getValue() || 'N/A',
    // },
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
    <Card className="mb-4 box-background" style={{ border: "none" }}>
      <Card.Header className="chart-card-header">
        <div className="d-flex align-items-center justify-content-between w-100">
          <span className="chart-headers">Tax Records</span>
          <Form.Group className="mb-0" style={{ width: "300px" }}>
            <div style={{ position: "relative", width: "300px" }}>
              <Search
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "10px",
                  transform: "translateY(-50%)",
                  color: "#aaa",
                  pointerEvents: "none",
                }}
              />

              <Form.Control
                type="text"
                placeholder=" Search by TIN"
                value={searchTin}
                onChange={handleSearchChange}
                style={{
                  paddingLeft: "35px", // Make room for the icon
                  border: "1px solid #fff",
                  borderRadius: "10px",
                }}
              />
            </div>
          </Form.Group>
        </div>
      </Card.Header>
      <Card.Body className="pt-0 px-0">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : records.length === 0 ? (
          <>
            <div className="text-center text-muted" style={{ padding: "2rem" }}>
              No Data Found
            </div>
          </>
        ) : (
          <>
            <Table
              columns={columns}
              data={records}
              loading={loading}
              error={error}
              hasMore={records.length < totalRecords}
              onLoadMore={handleLoadMore}
              loadingMore={isLoadingMore}
              jobId={"test"}
            />
          </>
        )}
      </Card.Body>
    </Card>
    // <Card className="mb-4 box-background">
    //   <Card.Body>
    //     {loading ? (
    //       <div
    //         className="text-center"
    //         style={{
    //           height: '350px',
    //           display: 'flex',
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //         }}
    //       >
    //         <Spinner animation="border" role="status" variant="primary">
    //           <span className="visually-hidden">Loading...</span>
    //         </Spinner>
    //       </div>
    //     ) : error ? (
    //       <div className="text-center text-danger">{error}</div>
    //     ) : records.length === 0 ? (
    //       <>
    //         <Card.Title>Tax Records</Card.Title>
    //         <div className="text-center text-muted" style={{ padding: '2rem' }}>
    //           No Data Found
    //         </div>
    //       </>
    //     ) : (
    //       <>
    //         <div className="d-flex justify-content-between align-items-center mb-3">
    //           <Card.Title>Tax Records</Card.Title>
    //           <Form.Group className="mb-0" style={{ width: '300px' }}>
    //             <Form.Control
    //               type="text"
    //               placeholder="Search by TIN"
    //               value={searchTin}
    //               onChange={handleSearchChange}
    //             />
    //           </Form.Group>
    //         </div>
    //         <Table
    //           columns={columns}
    //           data={records}
    //           loading={loading}
    //           error={error}
    //           hasMore={records.length < totalRecords}
    //           onLoadMore={handleLoadMore}
    //           loadingMore={isLoadingMore}
    //           jobId={'test'}
    //         />
    //       </>
    //     )}
    //   </Card.Body>
    // </Card>
  );
};

export default SWTTaxRecordsTable;
