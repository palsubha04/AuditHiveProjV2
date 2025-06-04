import React from 'react'
import { Card, Row, Col, Spinner, CardHeader, CardBody } from 'react-bootstrap';
import "../../pages/Dashboard.css";
import formatString from '../../utils/formatter';

const MetricCard = ({ value, label, color }) => (
  <div style={{ textAlign: 'start', minWidth: 150, paddingLeft: '0.5rem' }}>
    <div
      style={{
        fontWeight: 600,
        fontSize: 20,
        color,
      }}
      title={value} // This is where the magic happens!
    >
      {value}
    </div>
    <div style={{ fontSize: 15, color: '#fff', marginBottom: 4 }}>{label}</div>
  </div>
);

const RiskProfilingSummaryCards = ({ taxpayerDetailsData, taxpayerDetailsLoading, taxpayerDetailsError }) => {
  if (taxpayerDetailsLoading) {
    return (
      <div className='d-flex flex-row gap-4' style={{ marginBottom: 32 }}>
        <div className='d-flex flex-column gap-4 w-75'>
          <Card className='widget-card' style={{ background: '#f96992' }}>
            <Spinner animation="border" role="status" variant="primary" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Card>
          <Card className='widget-card' style={{ background: '#ffa56d' }}>
            <Spinner animation="border" role="status" variant="primary" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Card>
          <Card className='widget-card' style={{ background: '#26dce9' }}>
            <Spinner animation="border" role="status" variant="primary" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Card>
        </div>
        <div className='d-flex flex-column gap-4 w-25'>
          <Card className='widget-card' style={{ background: '#5096ff' }}>
            <Spinner animation="border" role="status" variant="primary" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Card>
          <Card className='widget-card' style={{ background: '#47C99E' }}>
            <Spinner animation="border" role="status" variant="primary" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Card>
          <Card className='widget-card' style={{ background: '#FFD12C' }}>
            <Spinner animation="border" role="status" variant="primary" size="sm">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </Card>
        </div>
      </div >
    );
  }
  if (taxpayerDetailsError) {
    return (
      <Row className="mb-4 g-3">
        <Col>
          <Card className="h-100 box-background">
            <Card.Body className="text-center text-danger">
              {taxpayerDetailsError}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  }
  return (
    <>
      <div className='d-flex flex-row gap-4' style={{ marginBottom: 32 }}>
        <div className='d-flex flex-column gap-4 w-75'>
          <Card className='widget-card' style={{ background: '#f96992' }}>
            <MetricCard
              value={formatString(taxpayerDetailsData?.sector_activity) || "N/A"}
              label="Sector Activity"
            />
          </Card>
          <Card className='widget-card' style={{ background: '#ffa56d' }}>
            <MetricCard
              label="Enterprise Activity"
              value={formatString(taxpayerDetailsData?.enterprise_activity) || "N/A"}
            />
          </Card>
          <Card className='widget-card' style={{ background: '#26dce9' }}>
            <MetricCard
              label="Tax Center"
              value={formatString(taxpayerDetailsData?.tax_centre) || "N/A"}
            />
          </Card>
        </div>
        <div className='d-flex flex-column gap-4 w-25'>
          <Card className='widget-card' style={{ background: '#5096ff' }}>
            <MetricCard
              value={formatString(taxpayerDetailsData?.segmentation) || "N/A"}
              label="Segmentation"
            />
          </Card>
          <Card className='widget-card' style={{ background: '#47C99E' }}>
            <MetricCard
              label="Taxpayer Type"
              value={formatString(taxpayerDetailsData?.taxpayer_type) || "N/A"}
            />
          </Card>
          <Card className='widget-card' style={{ background: '#FFD12C' }}>
            <MetricCard
              label="Entity Type"
              value={formatString(taxpayerDetailsData?.entity_type) || "N/A"}
            />
          </Card>
        </div>
      </div >
    </>
  )
}

export default RiskProfilingSummaryCards
