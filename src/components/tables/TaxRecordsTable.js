import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  Modal,
  Placeholder,
  ToggleButton,
} from "react-bootstrap";
import Table from "../Table";
import gstService from "../../services/gst.service";
import debounce from "lodash/debounce";
import "../../pages/Dashboard.css";
import { ChartPie, Download, Search } from "lucide-react";
import "./TaxRecordsTable.css";
import ReactApexChart from "react-apexcharts";

const monthMap = {
  1: "January", 2: "February", 3: "March", 4: "April",
  5: "May", 6: "June", 7: "July", 8: "August",
  9: "September", 10: "October", 11: "November", 12: "December",
};

const TaxRecordsTable = ({ startDate, endDate }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTin, setSearchTin] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pieRecords, setPieRecords] = useState({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeSwitch, setActiveSwitch] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSwitchChange = (value) => {
    setActiveSwitch((prev) => (prev === value ? null : value));
  };

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const fetchRecords = async (tin = "", page = 1, append = false) => {
    if (loading || isLoadingMore) return;

    page === 1 ? setLoading(true) : setIsLoadingMore(true);
    setError(null);

    try {
      let response;

      if (tin) {
        response = activeSwitch
          ? await gstService.getTaxRecordsByTIN(tin, startDate, endDate, activeSwitch)
          : await gstService.getTaxRecordsByTIN(tin, startDate, endDate);
      } else {
        response = activeSwitch
          ? await gstService.getTaxRecords(startDate, endDate, page, activeSwitch)
          : await gstService.getTaxRecords(startDate, endDate, page);
      }

      const modified = response.records.map((item) => ({
        ...item,
        tax_period_month: monthMap[item.tax_period_month] || item.tax_period_month,
      }));

      append ? setRecords((prev) => [...prev, ...modified]) : setRecords(modified);
      setTotalRecords(response.total_data_count);
    } catch (err) {
      setError("Failed to fetch tax records");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const fetchPieRecords = async () => {
    try {
      const response = await gstService.getPieTaxRecords(startDate, endDate);
      setPieRecords(response);
    } catch (err) {
      setError("Failed to fetch pie records");
    }
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setCurrentPage(1);
      fetchRecords(value);
    }, 500),
    [startDate, endDate, activeSwitch]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTin(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    if (startDate && endDate) {
      setCurrentPage(1);
      fetchRecords();
      fetchPieRecords();
    }
  }, [startDate, endDate, activeSwitch]);

  const handleLoadMore = useCallback(() => {
    if (records.length < totalRecords && !loading && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchRecords(searchTin, nextPage, true);
    }
  }, [records.length, totalRecords, loading, isLoadingMore, currentPage, searchTin]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PGK",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const columns = [
    { accessorKey: "tin", header: "TIN" },
    {
      accessorKey: "taxpayer_name",
      header: "Taxpayer Name",
      cell: ({ getValue }) => getValue() || "N/A",
    },
    { accessorKey: "taxpayer_type", header: "Type" },
    { accessorKey: "segmentation", header: "Segmentation" },
    {
      accessorKey: "total_sales_income",
      header: "Total Sales",
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: "gst_payable",
      header: "GST Payable",
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: "gst_refundable",
      header: "GST Refundable",
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: "is_fraud",
      header: "Is Fraud",
      cell: ({ getValue }) => {
        const isFraud = getValue();
        return (
          <div style={{ display: "inline-flex", alignItems: "center", padding: "4px 12px", borderRadius: "16px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: isFraud ? "#FF3535" : "#34C759",
                marginRight: "8px",
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: "500" }}>
              {isFraud ? "Fraud" : "Valid"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "fraud_reason",
      header: "Fraud Reason",
      cell: ({ getValue }) => (
        <span title={getValue() || "N/A"} style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {getValue() || "N/A"}
        </span>
      ),
    },
    // {
    //   accessorKey: "third_party_resource",
    //   header: "Third Party Resource",
    //   cell: ({ getValue }) => getValue() === "None" ? "-" : getValue(),
    // },
  ];

  const pieOptions = {
    chart: {
      id: "tax-records-pie-chart",
      type: "pie",
      animations: { enabled: true },
      toolbar: { show: false },
    },
    stroke: { show: true, width: 0, colors: ["transparent"] },
    labels: ["bank", "custom", "default"],
    colors: ["#6287FF", "#00E096", "#FF779D"],
    legend: { position: "bottom" },
    tooltip: {
      y: { formatter: (value) => value.toLocaleString() },
    },
    noData: {
      text: "No Data Found",
      style: { color: "#6c757d", fontSize: "16px" },
    },
  };

  const pieSeries = Object.keys(pieRecords).length > 0
    ? [pieRecords.bank?.count || 0, pieRecords.custom?.count || 0, pieRecords.default?.count || 0]
    : [];

  return (
    <>
      <Card className="mb-4 box-background" style={{ border: "none" }}>
        <Card.Header className="chart-card-header">
          <div className="d-flex align-items-center justify-content-between w-100">
            <span className="chart-headers">Tax Records</span>
            <div className="d-flex gap-3">
              {/* <Form className="d-flex gap-4 py-1 custom-switch-form">
                {["all", "banks", "customs"].map((type) => (
                  <Form.Check
                    key={type}
                    type="switch"
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    className="custom-switch"
                    checked={activeSwitch === type}
                    onChange={() => handleSwitchChange(type)}
                  />
                ))}
              </Form> */}

              {/* <Button
                onClick={handleModalOpen}
                variant="outline-default" 
                size="sm" 
                className='download-dropdown-btn'
                title={"Show Chart"}
                style={{ background: "#fff", padding: '5px', cursor: 'pointer', marginLeft: '-12px' }}
              >
                Show Chart
                {/* <ChartPie style={{ height: "18px", width: "20px", color: '#5671ff' }} /> 
              </Button> */}

              <Form.Group className="mb-0" style={{ width: "300px" }}>
                <div style={{ position: "relative" }}>
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
                    style={{ paddingLeft: "35px", height: "34px", border: "1px solid #fff", borderRadius: "10px" }}
                  />
                </div>
              </Form.Group>

            </div>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {loading ? (
            <Placeholder as="div" animation="glow" style={{ height: 600 }}>
              <Placeholder
                xs={12}
                style={{
                  height: "100%",
                  borderRadius: "0.5rem",
                  backgroundColor: "#d5e6ff",
                }}
              />
            </Placeholder>
          ) : error ? (
            <div className="text-center text-danger">{error}</div>
          ) : records.length === 0 ? (
            <div className="text-center text-muted" style={{ padding: "2rem" }}>
              No Data Found
            </div>
          ) : (
            <div className="table-responsive" style={{ borderBottom: "1px solid #d5e6ff", borderRadius: "0.5rem" }}>
              <Table
                tableId="tax-records-table-gst"
                columns={columns}
                data={records}
                loading={loading}
                error={error}
                hasMore={records.length < totalRecords}
                onLoadMore={handleLoadMore}
                loadingMore={isLoadingMore}
                jobId="test"
              />
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleModalClose} size="lg" centered>
        <Modal.Header closeButton>
          <span className="chart-headers">Tax Records - Fraud Count</span>
        </Modal.Header>
        <Modal.Body>
          <ReactApexChart
            key={pieSeries.join("-")}
            options={pieOptions}
            series={pieSeries}
            type="pie"
            height={350}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TaxRecordsTable;
