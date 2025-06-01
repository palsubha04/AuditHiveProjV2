import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUploadHistory } from '../slice/uploadHistorySlice';

const UploadHistory = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state?.uploadHistory);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    if (!data || !data.results || data.results.length === 0) {
      dispatch(fetchUploadHistory({}));
    }
  }, [data, dispatch]);

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

  const handleLoadMore = async () => {
    if (data && data.cursor && !loading && !isLoadingMore) {
      setIsLoadingMore(true);
      try {
        await dispatch(fetchUploadHistory({ cursor: data.cursor })).unwrap();
      } catch (e) {}
      setIsLoadingMore(false);
    }
  };

  return (
    <Layout>
      {loading && (!data || !data.results || data.results.length === 0) ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-danger">{error}</div>
      ) : !data || !data.results || data.results.length === 0 ? (
        <>
          <div className="text-center text-muted" style={{ padding: '2rem' }}>
            No Data Found
          </div>
        </>
      ) : (
        <Table
          columns={columns}
          data={data.results}
          loading={loading}
          error={error}
          hasMore={!!data.cursor}
          onLoadMore={handleLoadMore}
          loadingMore={isLoadingMore}
        />
      )}
    </Layout>
  );
};

export default UploadHistory;
