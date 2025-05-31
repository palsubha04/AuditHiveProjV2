import React, { useState } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import './RecentUploads.css'; // Make sure to create this CSS file

const uploadsData = {
  passed: 2000,
  failed: 520,
  date: 'Jul 21, 2025',
  time: '12:30 PM',
  uploader: 'John Dane',
  lastAvailable: '05-02-2025',
  data: [
    {
      tin: '00001',
      name: 'Christine Brooks',
      type: 'Enterprise',
      account: '27029',
      fraud: true,
      reason: 'Electric',
    },
    {
      tin: '00002',
      name: 'Rosie Pearson',
      type: 'Enterprise',
      account: '27029',
      fraud: true,
      reason: 'Book',
    },
    {
      tin: '00003',
      name: 'Darrell Caldwell',
      type: 'Enterprise',
      account: '27029',
      fraud: true,
      reason: 'Medicine',
    },
    {
      tin: '00004',
      name: 'Gilbert Johnston',
      type: 'Enterprise',
      account: '27029',
      fraud: false,
      reason: 'Mobile',
    },
    {
      tin: '00005',
      name: 'Alan Cain',
      type: 'Enterprise',
      account: '27029',
      fraud: false,
      reason: 'Watch',
    },
    {
      tin: '00006',
      name: 'Alfred Murray',
      type: 'Enterprise',
      account: '27029',
      fraud: false,
      reason: 'Medicine',
    },
  ],
};
console.log('Data', uploadsData.data);

const RecentUploads = () => {
  const [selectedCategory, setSelectedCategory] = useState('gst');
  // Handler to export table data to Excel
  const handleDownload = () => {
    // Prepare data for Excel
    // const excelData = uploadsData.rows.map((row) => ({
    //   tin: row.tin,
    //   'Company Name': row.name,
    //   'Taxpayer Type': row.type,
    //   'Tax Account No': row.account,
    //   'Is Fraud': row.fraud ? 'Yes' : 'No',
    //   'Fraud Reason': row.reason,
    // }));
    // const worksheet = XLSX.utils.json_to_sheet(excelData);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, 'GST Data');
    // XLSX.writeFile(workbook, 'gst_data.xlsx');
  };

  const columns = [
    {
      accessorKey: 'tin',
      header: 'Tin',
    },
    {
      accessorKey: 'name',
      header: 'Company Name',
    },
    {
      accessorKey: 'type',
      header: 'Taxpayer Type',
    },
    {
      accessorKey: 'account',
      header: 'Tax Account No',
    },
    {
      accessorKey: 'fraud',
      header: 'Is Fraud',
    },
    {
      accessorKey: 'reason',
      header: 'Fraud Reason',
    },
  ];

  return (
    <Layout>
      <Container className="mt-4">
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
              Last available GST data as on <b>{uploadsData.lastAvailable}</b>{' '}
              Uploaded By:{' '}
              <span style={{ color: '#3b82f6', fontWeight: 400 }}>
                {uploadsData.uploader}
              </span>
            </h5>
          </Col>
          <Col className="text-end">
            <span>
              Date: {uploadsData.date} &nbsp; Time: {uploadsData.time}
            </span>
          </Col>
        </Row>
        <Table columns={columns} data={uploadsData.data} jobId={'test'} />
      </Container>
    </Layout>
  );
};

export default RecentUploads;
