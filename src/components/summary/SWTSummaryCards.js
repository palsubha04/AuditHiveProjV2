import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import swtService from '../../services/swt.service';
import "../../pages/Dashboard.css";


const SummaryCard = ({ title, value, icon }) => (
  <Card className="h-100 box-background">
    <Card.Body>
      <div className="d-flex justify-content-between align-items-center">
        <div className="flex-grow-1">
          <h6 className="text-muted mb-2">{title}</h6>
          <h4 className="mb-0 text-truncate" style={{ fontSize: 'clamp(0.875rem, 2vw, 1.25rem)' }}>{value}</h4>
        </div>
        {icon && <div className="text-primary fs-3 ms-2">{icon}</div>}
      </div>
    </Card.Body>
  </Card>
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
        console.error('Error fetching summary:', err);
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
    if (value === undefined || value === null) return 'K0.00';
    if (value >= 1e9) {
      return `K${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `K${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `K${(value / 1e3).toFixed(2)}K`;
    }
    return `K${value.toFixed(2)}`;
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
    <Row style={{marginBottom: '32px',}}>
      <Col>
        <SummaryCard
          title="Employees on Payroll"
          value={formatNumber(summary.employees_on_payroll)}
          icon="👥"
        />
      </Col>
      <Col>
        <SummaryCard
          title="Employees Paid SWT"
          value={formatNumber(summary.employees_paid_swt)}
          icon="💰"
        />
      </Col>
      <Col>
        <SummaryCard
          title="Total Salary Wages Paid"
          value={formatCurrency(summary.total_salary_wages_paid)}
          icon="📊"
        />
      </Col>
      <Col>
        <SummaryCard
          title="Salary Wages Paid for SWT Deduction"
          value={formatCurrency(summary.sw_paid_for_swt_deduction)}
          icon="📈"
        />
      </Col>
      <Col>
        <SummaryCard
          title="Total SWT Tax Deducted"
          value={formatCurrency(summary.total_swt_tax_deducted)}
          icon="📉"
        />
      </Col>
    </Row>
  );
};

export default SWTSummaryCards; 