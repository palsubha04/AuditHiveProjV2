import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUploadHistory } from '../slice/uploadHistorySlice';

const UploadHistory = () => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state?.uploadHistory);

  useEffect(() => {
    if (!data) {
      dispatch(fetchUploadHistory());
    }
  }, [data, dispatch]);

  console.log(data?.results);

  const columns = [
    {
      accessorKey: 'file_name',
      header: 'File Name',
    },
    {
      accessorKey: 'uploaded_by',
      header: 'Uploaded By',
    },
    {
      accessorKey: 'tax_parameter',
      header: 'Tax Parameter',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'time',
      header: 'Time',
    },
  ];

  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchUploadHistoryData = async (page = 1, append = false) => {
    if (loading || isLoadingMore) return;
    if (page === 1) setLoading(true);
    else setIsLoadingMore(true);
    setError(null);
    try {
      // Replace with your actual API call
      const response = await dispatch(fetchUploadHistory({ page })).unwrap();
      if (append) setRecords((prev) => [...prev, ...response.results]);
      else setRecords(response.results);
      setTotalRecords(response.total_data_count);
    } catch (err) {
      setError('Failed to fetch upload history');
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUploadHistoryData();
  }, []);

  const handleLoadMore = () => {
    if (records.length < totalRecords && !loading && !isLoadingMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchUploadHistoryData(nextPage, true);
    }
  };

  return (
    <Layout>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : records.length === 0 ? (
        <>
          <div className="text-center text-muted" style={{ padding: '2rem' }}>
            No Data Found
          </div>
        </>
      ) : (
        <Table
          columns={columns}
          data={records}
          loading={loading}
          error={error}
          hasMore={records.length < totalRecords}
          onLoadMore={handleLoadMore}
          loadingMore={isLoadingMore}
        />
      )}
    </Layout>
  );
};

export default UploadHistory;
