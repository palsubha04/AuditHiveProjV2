import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentUploads } from '../slice/reports/recentUploadsSlice';
import Layout from '../components/Layout';
import Table from '../components/Table';
import { Row, Col, Button } from 'react-bootstrap';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import './RecentUploads.css'; // Make sure to create this CSS file
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
  const handleDownload = () => {
    if (
      !recentUploadsData ||
      !recentUploadsData.records ||
      recentUploadsData.records.length === 0
    ) {
      alert('No data available to download.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(recentUploadsData.records);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'RecentUploads');
    XLSX.writeFile(workbook, `RecentUploads_${selectedCategory}.xlsx`);
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
    </Layout>
  );
};

export default RecentUploads;
