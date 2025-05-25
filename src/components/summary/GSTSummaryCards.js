import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import gstService from '../../services/gst.service';
import '../../pages/Dashboard.css';

const MetricCard = ({ value, label, color }) => (
  <div style={{ textAlign: 'center', minWidth: 150 }}>
    <div style={{ fontWeight: 700, fontSize: 24, color }}>{value}</div>
    <div style={{ fontSize: 15, color: '#222', marginBottom: 4 }}>{label}</div>
  </div>
);

const GSTSummaryCards = ({ startDate, endDate }) => {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await gstService.getTaxRecordsSummary(
          startDate,
          endDate
        );
        setSummary(response);
      } catch (err) {
        console.error('Error fetching summary:', err);
      }
    };

    if (startDate && endDate) {
      fetchSummary();
    }
  }, [startDate, endDate]);

  const formatCurrency = (value) => {
    if (value >= 1e9) {
      return (value / 1e9).toFixed(2) + 'B';
    } else if (value >= 1e6) {
      return (value / 1e6).toFixed(2) + 'M';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(2) + 'K';
    }
    return value;
  };

  const formatNumber = (value) => {
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + 'M';
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + 'K';
    }
    return value;
  };

  if (!summary) return null;

  return (
    <Card
      style={{
        borderColor: '#e6edff',
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        padding: 24,
        marginBottom: 32,
      }}
    >
      <Row
        className="justify-content-between"
        style={{ flexWrap: 'nowrap', overflowX: 'auto' }}
      >
        <Col className='border-end'>
          <MetricCard
            value={formatNumber(summary.total_tax_payers)}
            label="Total Tax payers"
            color="#31303B"
          />
        </Col>
        <Col className='border-end'>
          <MetricCard
            value={formatNumber(summary.total_sales_income)}
            label="Total Sales Income"
            color="#31303B"
          />
        </Col>
        <Col className='border-end'>
          <MetricCard
            value={formatNumber(summary.total_gst_payable)}
            label="Total GST Payable"
            color="#F36464"
          />
        </Col>
        <Col>
          <MetricCard
            value={formatNumber(summary.total_gst_refundable)}
            label="Total GST Refundable"
            color="#31303B"
          />
        </Col>
      </Row>
    </Card>
  );
};

export default GSTSummaryCards;
