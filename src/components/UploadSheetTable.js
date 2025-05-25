import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import api from '../services/axios.config';
import './Table.css';

// Download icon component
const DownloadIcon = () => (
  <svg
    className="download-icon"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

function UploadSheetTable({
  data = [],
  columns = [],
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  jobId = null,
}) {
  const tableContainerRef = useRef(null);
  const [isFraudFilter, setIsFraudFilter] = useState('all');

  // Memoize the filtered data
  const filteredData = useMemo(() => {
    if (isFraudFilter === 'all') return data;

    return data.filter((row) => {
      const isFraud = String(row.is_fraud).toLowerCase();
      return isFraud === isFraudFilter;
    });
  }, [data, isFraudFilter]);

  const downloadFraudRecords = useCallback(async () => {
    if (!jobId) {
      console.error('No job ID available for download');
      alert('Job ID is not available. Please try again later.');
      return;
    }

    try {
      console.log('Downloading fraud records for job:', jobId);
      const response = await api.get(`/tax/jobs/${jobId}/fraud-records`, {
        responseType: 'blob',
      });

      const filename =
        response.headers['content-disposition']?.split('filename=')[1] ||
        'fraud-records.csv';

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading fraud records:', error);
      alert('Failed to download fraud records. Please try again.');
    }
  }, [jobId]);

  const handleFilterChange = useCallback((e, column) => {
    e.stopPropagation();
    const value = e.target.value;
    setIsFraudFilter(value);
  }, []);

  const processedColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        size: '100%',
        header:
          col.accessorKey === 'is_fraud' && jobId
            ? ({ column }) => (
                <div className="fraud-filter-header">
                  <div className="header-title">Is Fraud</div>
                  <div className="filter-controls">
                    <select
                      value={isFraudFilter}
                      onChange={(e) => handleFilterChange(e, column)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="all">All</option>
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                    {isFraudFilter === 'true' && (
                      <button
                        className="download-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadFraudRecords();
                        }}
                        disabled={!jobId}
                        title={
                          !jobId
                            ? 'Job ID not available'
                            : 'Download fraud records'
                        }
                      >
                        <DownloadIcon />
                      </button>
                    )}
                  </div>
                </div>
              )
            : col.header,
      })),
    [columns, isFraudFilter, handleFilterChange, downloadFraudRecords, jobId]
  );

  const table = useReactTable({
    data: filteredData,
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: false, // Disable debug mode
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 35,
    getScrollElement: () => tableContainerRef.current,
    overscan: 5,
  });

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
      if (containerRefElement && hasMore && !loadingMore) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < 300) {
          onLoadMore();
        }
      }
    },
    [hasMore, loadingMore, onLoadMore]
  );

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <div
      ref={tableContainerRef}
      className="table-container"
      onScroll={(e) => fetchMoreOnBottomReached(e.target)}
    >
      <table style={{ display: 'grid' }}>
        <thead
          style={{
            display: 'grid',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            backgroundColor: 'white',
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{ display: 'flex', width: '100%' }}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    padding: '12px',
                    borderBottom: '2px solid #eee',
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          style={{
            display: 'grid',
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr
                key={row.id}
                data-index={virtualRow.index}
                ref={(node) => rowVirtualizer.measureElement(node)}
                style={{
                  display: 'flex',
                  position: 'absolute',
                  transform: `translateY(${virtualRow.start}px)`,
                  width: '100%',
                  left: 0,
                  right: 0,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      display: 'inline-block',
                      width: '100%',
                      padding: '8px 12px',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {loadingMore && <div className="loading-more">Loading more data...</div>}
    </div>
  );
}

export default React.memo(UploadSheetTable);
