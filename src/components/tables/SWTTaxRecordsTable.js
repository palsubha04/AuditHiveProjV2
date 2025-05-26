import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Form, Badge, Spinner } from 'react-bootstrap';
import Table from '../Table';
import swtService from '../../services/swt.service';
import debounce from 'lodash/debounce';
import '../../pages/Dashboard.css';

const SWTTaxRecordsTable = ({ startDate, endDate }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTin, setSearchTin] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchRecords = async (tin = '', page = 1, append = false) => {
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
        if (response.error) {
          setError(response.error);
          setRecords([]);
        } else {
          setRecords(Array.isArray(response.records) ? response.records : []);
          setError(null);
        }
      } else {
        response = await swtService.getTaxRecords(startDate, endDate, page);
        if (append) {
          setRecords((prev) => [...prev, ...response.records]);
        } else {
          setRecords(response.records);
        }
      }
      setTotalRecords(response.total_data_count);
    } catch (err) {
      setError('Failed to fetch tax records');
      console.error('Error fetching tax records:', err);
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
    return new Intl.NumberFormat('en-US', {
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
      accessorKey: 'employees_on_payroll',
      header: 'Employees on Payroll',
    },
    {
      accessorKey: 'employees_paid_swt',
      header: 'Employees Paid SWT',
    },
    {
      accessorKey: 'total_salary_wages_paid',
      header: 'Total Salary Wages Paid',
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: 'sw_paid_for_swt_deduction',
      header: 'Salary Wages Paid for SWT Deduction',
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: 'total_swt_tax_deducted',
      header: 'Total SWT Tax Deducted',
      cell: ({ getValue }) => formatCurrency(getValue()),
    },
    {
      accessorKey: 'is_fraud',
      header: 'Is Fraud',
      cell: ({ getValue }) => (
        <Badge bg={getValue() ? 'danger' : 'success'}>
          {getValue() ? 'Fraud' : 'Valid'}
        </Badge>
      ),
    },
    {
      accessorKey: 'fraud_reason',
      header: 'Fraud Reason',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
  ];

  return (
    <Card className="mb-4 box-background">
      <Card.Body>
        {loading ? (
          <div
            className="text-center"
            style={{
              height: '350px',
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
            <Card.Title>Tax Records</Card.Title>
            <div className="text-center text-muted" style={{ padding: '2rem' }}>
              No Data Found
            </div>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Card.Title>Tax Records</Card.Title>
              <Form.Group className="mb-0" style={{ width: '300px' }}>
                <Form.Control
                  type="text"
                  placeholder="Search by TIN"
                  value={searchTin}
                  onChange={handleSearchChange}
                />
              </Form.Group>
            </div>
            <Table
              columns={columns}
              data={records}
              loading={loading}
              error={error}
              hasMore={records.length < totalRecords}
              onLoadMore={handleLoadMore}
              loadingMore={isLoadingMore}
              jobId={'test'}
            />
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default SWTTaxRecordsTable;
