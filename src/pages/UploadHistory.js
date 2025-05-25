import React, { useState, useRef, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import Layout from '../components/Layout';

const data = [
  {
    id: 1,
    fileName: '#12594',
    uploadedBy: 'John Dow',
    taxParameter: 'GST',
    date: '31/03/2024',
    time: '12:30',
  },
];

const UploadHistory = () => {
  // For demo, repeat the same row 18 times
  const rowsData = Array.from({ length: 18 }, (_, i) => ({
    ...data[0],
    id: i + 1,
  }));

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [visibleCount, setVisibleCount] = useState(10);
  const scrollRef = useRef(null);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Toggle direction
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const sortedRows = React.useMemo(() => {
    let sortableRows = [...rowsData];
    if (sortConfig.key) {
      sortableRows.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableRows;
  }, [rowsData, sortConfig]);

  const handleDownload = () => {
    const excelData = sortedRows.map((row) => ({
      No: row.id,
      'File Name': row.fileName,
      'Uploaded By': row.uploadedBy,
      'Tax Parameter': row.taxParameter,
      Date: row.date,
      Time: row.time,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Upload Validation');
    XLSX.writeFile(workbook, 'upload_validation.xlsx');
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return '⇅';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Infinite scroll handler
  const handleScroll = () => {
    const el = scrollRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      setVisibleCount((prev) => {
        if (prev < sortedRows.length) {
          return Math.min(prev + 10, sortedRows.length);
        }
        return prev;
      });
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [sortedRows.length]);

  return (
    <Layout>
      <div className='h-100'>
        {/* <h4 className="mb-4" style={{ color: '#1a237e', fontWeight: 700 }}>
          Upload Validation
        </h4> */}
        <div
          ref={scrollRef}
          style={{
            height: '100%',
            overflowY: 'auto',
            borderRadius: 8,
          }}
        >
          <Table hover responsive>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fafafa' }}>
              <tr>
                <th>No</th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('fileName')}
                >
                  {getSortIndicator('fileName')} File Name
                </th>
                <th>Uploaded By</th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleSort('taxParameter')}
                >
                  Tax Parameter {getSortIndicator('taxParameter')}
                </th>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedRows.slice(0, visibleCount).map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.fileName}</td>
                  <td>{row.uploadedBy}</td>
                  <td>{row.taxParameter}</td>
                  <td>{row.date}</td>
                  <td>{row.time}</td>
                  <td>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 me-2"
                      title="Download"
                      onClick={handleDownload}
                    >
                      <Download size={18} color="#90a4ae" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default UploadHistory;
