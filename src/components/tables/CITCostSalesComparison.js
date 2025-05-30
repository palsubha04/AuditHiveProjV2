import React, { useState, useEffect, useCallback } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import Table from '../Table';
import citService from '../../services/cit.service';
import '../../pages/Dashboard.css';
import CSVExportButton from '../CSVExportButton';

const CITCostSalesComparison = ({ startDate, endDate }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecords = async () => {
    
    setLoading(true);
    setError(null);
    try {
      let response;
      
      response = await citService.getCostSalesComparison(startDate, endDate);
      
      setRecords(response);
    } catch (err) {
      setError('Failed to fetch tax records');
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
      <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
        <span className="chart-headers">Gross Sales vs Cost of Goods Sold</span>
        <CSVExportButton
          records={records}
          filename="SalesVsCost.csv"
          buttonLabel="Download Sales vs Cost List"
        />
      </Card.Header>
      <Card.Body className='pt-0'>
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

export default CITCostSalesComparison;
