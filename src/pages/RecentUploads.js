import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentUploads } from '../slice/reports/recentUploadsSlice';
import Layout from '../components/Layout';
import Table from '../components/Table';
import api from '../services/axios.config';
import { Row, Col, Button, Placeholder } from 'react-bootstrap';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import './Reports.css'; // Make sure to create this CSS file
import { resetRecentUploads } from '../slice/reports/recentUploadsSlice';

const RecentUploads = () => {
  const [selectedCategory, setSelectedCategory] = useState('gst');
  const dispatch = useDispatch();
  const {
    recentUploadsData,
    recentUploadsLoading,
    recentUploadsError,
    cursor,
    records,
    hasMore,
  } = useSelector((state) => state?.recentUploads);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(resetRecentUploads());
    dispatch(fetchRecentUploads({ tax_type: selectedCategory }));
  }, [selectedCategory, dispatch]);

  const handleLoadMore = async () => {
    if (cursor && !recentUploadsLoading && !isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      try {
        await dispatch(
          fetchRecentUploads({ tax_type: selectedCategory, cursor })
        ).unwrap();
      } catch (e) {}
      setIsLoadingMore(false);
    }
  };

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.offsetHeight &&
        !recentUploadsLoading &&
        hasMore
      ) {
        dispatch(fetchRecentUploads({ tax_type: selectedCategory, cursor }));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [recentUploadsLoading, hasMore, cursor, selectedCategory, dispatch]);

  // Handler to export table data to Excel
  const handleDownload = async () => {
    try {
      const response = await api.get(
        `recent-upload?tax_type=${selectedCategory}&export_format=csv`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${selectedCategory.toUpperCase()}_Latest_Tax_Records_Data.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError(
        `Error downloading ${selectedCategory} Latest Tax Records records`
      );
    }
  };

  const columns = [
    {
      accessorKey: 'tin',
      header: 'Tin',
    },
    {
      accessorKey: 'company_name',
      header: 'Company Name',
    },
    {
      accessorKey: 'taxpayer_type',
      header: 'Taxpayer Type',
    },
    {
      accessorKey: 'tax_account_no',
      header: 'Tax Account No',
    },
    {
      accessorKey: 'tax_period_month',
      header: 'Tax Period Month',
    },
    {
      accessorKey: 'tax_period_year',
      header: 'Tax Period Year',
    },
    {
      accessorKey: 'is_fraud',
      header: 'Is Fraud',
    },
    {
      accessorKey: 'fraud_reason',
      header: 'Fraud Reason',
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span
            style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={
              typeof value === 'string'
                ? value
                : value
                ? value.toString()
                : undefined
            }
          >
            {value || 'N/A'}
          </span>
        );
      },
    },
  ];

  const showSkeleton = recentUploadsLoading && records.length === 0;

  return (
    <Layout>
      <div className="selection-container">
        <div>
          <span>Select History Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="chart-filter"
          >
            <option value="gst">GST</option>
            <option value="swt">SWT</option>
            <option value="cit">CIT</option>
          </select>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleDownload}
          className="download"
          style={{ color: '#347AE2', hoverColor: '#' }}
        >
          <Download
            size={16}
            style={{ marginRight: 6, marginBottom: 2, color: '#347AE2' }}
          />
          Download Sheet
        </Button>
      </div>
      <Row className="mb-2">
        <Col>
          <h5 className="fw-semibold fs-6 lh-base">
            Last available {selectedCategory} data as on{' '}
            <b>{recentUploadsData?.end_date}</b> Uploaded By:{' '}
            <span style={{ color: '#3b82f6', fontWeight: 400 }}>
              {recentUploadsData?.uploaded_by}
            </span>
          </h5>
        </Col>
        <Col className="text-end">
          <span>
            Date: {recentUploadsData?.uploaded_date} &nbsp; Time:{' '}
            {recentUploadsData?.uploaded_time}
          </span>
        </Col>
      </Row>
      {showSkeleton ? (
        <>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
            <Placeholder
              xs={12}
              style={{
                height: '100%',
                borderRadius: '0.25rem',
                backgroundColor: '#d5e6ff',
              }}
            />
          </Placeholder>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
            <Placeholder
              xs={12}
              style={{
                height: '100%',
                borderRadius: '0.25rem',
                backgroundColor: '#d5e6ff',
              }}
            />
          </Placeholder>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
            <Placeholder
              xs={12}
              style={{
                height: '100%',
                borderRadius: '0.25rem',
                backgroundColor: '#d5e6ff',
              }}
            />
          </Placeholder>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
            <Placeholder
              xs={12}
              style={{
                height: '100%',
                borderRadius: '0.25rem',
                backgroundColor: '#d5e6ff',
              }}
            />
          </Placeholder>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
            <Placeholder
              xs={12}
              style={{
                height: '100%',
                borderRadius: '0.25rem',
                backgroundColor: '#d5e6ff',
              }}
            />
          </Placeholder>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
            <Placeholder
              xs={12}
              style={{
                height: '100%',
                borderRadius: '0.25rem',
                backgroundColor: '#d5e6ff',
              }}
            />
          </Placeholder>
          <div className="d-flex justify-content-around mt-3">
            <Placeholder xs={2} style={{ backgroundColor: '#d5e6ff' }} />
            <Placeholder xs={2} style={{ backgroundColor: '#d5e6ff' }} />
            <Placeholder xs={2} style={{ backgroundColor: '#d5e6ff' }} />
            <Placeholder xs={2} style={{ backgroundColor: '#d5e6ff' }} />
          </div>
        </>
      ) : (
        <>
          <Table
            columns={columns}
            data={records}
            jobId={'test'}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            loadingMore={isLoadingMore}
          />
          {recentUploadsLoading && records.length === 0 && (
            <div style={{ textAlign: 'center' }}>Loading...</div>
          )}
          {!hasMore && records.length > 0 && (
            <div style={{ textAlign: 'center' }}>No more data.</div>
          )}
        </>
      )}
    </Layout>
  );
};

export default RecentUploads;
