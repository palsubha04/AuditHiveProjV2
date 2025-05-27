import React, { useState, useRef, useEffect } from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import Layout from '../components/Layout';
import Table from '../components/Table';

const data = [
  {
    id: 1,
    fileName: '#12594',
    uploadedBy: 'John Dow',
    taxParameter: 'GST',
    date: '31/03/2024',
    time: '12:30',
  },{
    id: 2,
    fileName: '#12595',
    uploadedBy: 'Jane Smith',
    taxParameter: 'Income Tax',
    date: '30/03/2024',
    time: '14:15',
  },{
    id: 3,
    fileName: '#12596',
    uploadedBy: 'Alice Johnson',
    taxParameter: 'Corporate Tax',
    date: '29/03/2024',
    time: '10:00',
  },{
    id: 4,
    fileName: '#12597',
    uploadedBy: 'Bob Brown',
    taxParameter: 'Sales Tax',
    date: '28/03/2024',
    time: '16:45',
  },{
    id: 5,
    fileName: '#12598',
    uploadedBy: 'Charlie White',
    taxParameter: 'Property Tax',
    date: '27/03/2024',
    time: '09:30',
  },{
    id: 6,
    fileName: '#12599',
    uploadedBy: 'Diana Green',
    taxParameter: 'Excise Duty',
    date: '26/03/2024',
    time: '11:20',
  },{
    id: 7,
    fileName: '#12600',
    uploadedBy: 'Ethan Blue',
    taxParameter: 'Value Added Tax',
    date: '25/03/2024',
    time: '13:05',
  }
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

  const columns = [
    {
      accessorKey: 'id',
      header: 'No',
    },
    {
      accessorKey: 'fileName',
      header: 'File Name',
    },
    {
      accessorKey: 'uploadedBy',
      header: 'Uploaded By',
    },
    {
      accessorKey: 'taxParameter',
      header: 'Tax Parameter',
    },
    {
      accessorKey: 'date',
      header: 'Date',
    },
    {
      accessorKey: 'time',
      header: 'Time',
    }
  ];

  return (
    <Layout>
      <Table
        columns={columns}
        data={data}
        jobId={'test'}
      />
    </Layout>
  );
};

export default UploadHistory;
