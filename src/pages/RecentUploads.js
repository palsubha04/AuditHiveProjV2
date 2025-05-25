import React from 'react';
import Layout from '../components/Layout';
import { Table, Container, Row, Col, Button, Alert } from 'react-bootstrap';
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
  rows: [
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

const RecentUploads = () => {
  // Handler to export table data to Excel
  const handleDownload = () => {
    // Prepare data for Excel
    const excelData = uploadsData.rows.map((row) => ({
      Tin: row.tin,
      'Company Name': row.name,
      'Taxpayer Type': row.type,
      'Tax Account No': row.account,
      'Is Fraud': row.fraud ? 'Yes' : 'No',
      'Fraud Reason': row.reason,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'GST Data');
    XLSX.writeFile(workbook, 'gst_data.xlsx');
  };

  return (
    <Layout>
      <Container className="mt-4">
        <Alert
          variant="success"
          className="d-flex justify-content-between align-items-center"
        >
          <span>
            <strong>{uploadsData.passed} data passed validations</strong> and{' '}
            <span style={{ color: '#e74c3c', fontWeight: 600 }}>
              {uploadsData.failed} data failed
            </span>{' '}
            in validation and available to download.
          </span>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleDownload}
            className="d-flex"
          >
            <Download size={16} style={{ marginRight: 6, marginBottom: 2 }} />
            Download Sheet
          </Button>
        </Alert>
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
        <div className="custom-table-wrapper">
          <Table className="custom-table" responsive>
            <thead>
              <tr>
                <th>Tin</th>
                <th>Company Name</th>
                <th>Taxpayer Type</th>
                <th>Tax Account No</th>
                <th>
                  Is Fraud{' '}
                  <span style={{ fontWeight: 'normal', color: '#bbb' }}>▼</span>
                </th>
                <th></th>
                <th>Fraud Reason</th>
              </tr>
            </thead>
            <tbody>
              {uploadsData.rows.map((row) => (
                <tr key={row.tin}>
                  <td>{row.tin}</td>
                  <td>{row.name}</td>
                  <td>{row.type}</td>
                  <td>{row.account}</td>
                  <td>
                    {row.fraud ? (
                      <span style={{ color: '#ff914d', fontWeight: 500 }}>
                        Yes
                      </span>
                    ) : (
                      <span style={{ color: '#444' }}>No</span>
                    )}
                  </td>
                  <td></td>
                  <td>{row.reason}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Container>
    </Layout>
  );
};

export default RecentUploads;
