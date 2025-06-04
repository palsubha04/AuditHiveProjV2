import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import swtService from '../../services/swt.service';
import "../../pages/Dashboard.css";


const MetricCard = ({ value, label, color }) => (
  <div style={{ textAlign: 'start', minWidth: 150, paddingLeft: '0.5rem' }}>
    <div style={{ fontWeight: 700, fontSize: 24, color }}>{value}</div>
    <div style={{ fontSize: 15, color: '#fff', marginBottom: 4, textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden', // Essential for ellipsis
          width: '200px',      // The width at which text truncates
         }} title={label} // This is where the magic happens!
         >{label}</div>
  </div>
);

const SWTSummaryCards = ({ startDate, endDate }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await swtService.getTaxRecordsSummary(startDate, endDate);
        setSummary(response);
      } catch (err) {
        setError('Failed to load summary data');
      } finally {
        setLoading(false);
      }
    };

    if (startDate && endDate) {
      fetchSummary();
    } else {
      setLoading(false);
      setSummary(null);
    }
  }, [startDate, endDate]);

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'PGK 0.00';
    if (value >= 1e9) {
      return `PGK ${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `PGK ${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `PGK ${(value / 1e3).toFixed(2)}K`;
    }
    return `PGK  ${value.toFixed(2)}`;
  };

  const formatNumber = (value) => {
    if (value === undefined || value === null) return '0';
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(1)}K`;
    }
    return value.toString();
  };

  if (loading) {
    return (
      <Row className="mb-4 g-3 ">
        {[1, 2, 3, 4, 5].map((index) => (
          <Col key={index}>
            <Card className="h-100 box-background">
              <Card.Body className="d-flex align-items-center justify-content-center" style={{ height: '100px' }}>
                <Spinner animation="border" role="status" variant="primary" size="sm">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (error) {
    return (
      <Row className="mb-4 g-3">
        <Col>
          <Card className="h-100 box-background">
            <Card.Body className="text-center text-danger">
              {error}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }

  if (!summary) return null;

  return (
    <div className='widget-main-div'>
      <Card className='widget-card' style={{ background: '#5096ff' }}>
        <MetricCard
          value={formatNumber(summary.employees_on_payroll)}
          label="Employees on Payroll"
        />
      </Card>
      <Card className='widget-card' style={{ background: '#47C99E' }}>
        <MetricCard
          label="Employees Paid SWT"
          value={formatNumber(summary.employees_paid_swt)}
        />
      </Card>
      <Card className='widget-card' style={{ background: '#F96992' }}>
        <MetricCard
          label="Total Salary Wages Paid"
          value={formatCurrency(summary.total_salary_wages_paid)}
        />
      </Card>
      <Card className='widget-card' style={{ background: '#FFA56D' }}>
        <MetricCard
          label="Salary Wages Paid for SWT Deduction"
          value={formatCurrency(summary.sw_paid_for_swt_deduction)}
        />
      </Card>
      <Card className='widget-card' style={{ background: '#26DCE9' }}>
        <MetricCard
          label="Total SWT Tax Deducted"
          value={formatCurrency(summary.total_swt_tax_deducted)}
        />
      </Card>
    </div>
  );
};

export default SWTSummaryCards; 