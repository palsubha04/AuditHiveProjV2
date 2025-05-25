import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Form, Badge, Spinner } from 'react-bootstrap';
import Table from '../Table';
import citService from '../../services/cit.service';
import debounce from 'lodash/debounce';
import '../../pages/Dashboard.css';
import CSVExportButton from '../CSVExportButton';

const CITCostSalesComparison = ({ startDate, endDate }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTin, setSearchTin] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchRecords = async () => {
    // if (append && (loading || isLoadingMore)) return;

    // if (page === 1) {
    //   setLoading(true);
    // } else {
    //   setIsLoadingMore(true);
    // }
    setLoading(true);
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
      response = await citService.getCostSalesComparison(startDate, endDate);
      // if (append) {
      //   setRecords(prev => [...prev, ...response.records]);
      // } else {
      //   setRecords(response.records);
      // }
      // }
      setRecords(response);
      setTotalRecords(response.length);
    } catch (err) {
      setError('Failed to fetch tax records');
      console.error('Error fetching tax records:', err);
    } finally {
      setLoading(false);
      //setIsLoadingMore(false);
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
      //  setCurrentPage(1);
      fetchRecords();
    }
    // fetchRecords();
  }, [startDate, endDate]);

  //   const handleLoadMore = useCallback(() => {
  //     if (records.length < totalRecords && !loading && !isLoadingMore) {
  //       const nextPage = currentPage + 1;
  //       setCurrentPage(nextPage);
  //       fetchRecords(searchTin, nextPage, true);
  //     }
  //   }, [records.length, totalRecords, loading, isLoadingMore, currentPage, searchTin]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-PG', {
      style: 'currency',
      currency: 'PGK',
      currencyDisplay: 'symbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const columns = [
    {
      accessorKey: 'tin',
      header: 'TIN',
    },
    {
      accessorKey: 'taxpayer_name',
      header: 'Taxpayer Name',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
      accessorKey: 'segmentation',
      header: 'Segmentation',
    },
    {
      accessorKey: 'percentage',
      header: 'Percentage',
      cell: ({ getValue }) => getValue() + '%',
    },
    {
      accessorKey: 'cost_of_good_sales',
      header: 'Cost of Good Sales',
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: 'cash_and_credit_sales',
      header: 'Cash and Credit Sales',
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: 'cost_of_good_sales_more_than_80_percent',
      header: 'Cost of Good Sales > 80%',
    },
  ];

  return (
    <Card className="mb-4 box-background">
      <Card.Body>
        {loading ? (
          <div
            className="text-center"
            style={{
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="text-center text-danger">{error}</div>
        ) : records.length === 0 ? (
          <>
            <span className="chart-headers">
              Gross Sales Vs Cost of Goods Sold
            </span>
            <div className="text-center text-muted" style={{ padding: '2rem' }}>
              No Data Found
            </div>
          </>
        ) : (
          <div
            style={{
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex justify-content-between align-items-center w-100">
                <span className="chart-headers">
                  Gross Sales Vs Cost of Goods Sold
                </span>
                <CSVExportButton
                  records={records}
                  filename="SalesVsCost.csv"
                  buttonLabel="Download Sales vs Cost List"
                />
              </div>

              {/* <Form.Group className="mb-0" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search by TIN"
                  value={searchTin}
                  onChange={handleSearchChange}
                />
              </Form.Group> */}
            </div>
            <Table
              columns={columns}
              data={records}
              loading={loading}
              error={error}
              //   hasMore={records.length < totalRecords}
              //   onLoadMore={handleLoadMore}
              //   loadingMore={isLoadingMore}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CITCostSalesComparison;
