import React from 'react'
import { Card, Row, Col, Spinner } from 'react-bootstrap';
import "../../pages/Dashboard.css";

const MetricCard = ({ value, label, color }) => (
    <div style={{ textAlign: 'start', minWidth: 150, paddingLeft: '0.5rem' }}>
      <div
        style={{
          fontWeight: 700,
          fontSize: 24,
          color,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden', // Essential for ellipsis
          width: '200px',      // The width at which text truncates
        }}
        title={value} // This is where the magic happens!
      >
        {value}
      </div>
      <div style={{ fontSize: 15, color: '#fff', marginBottom: 4 }}>{label}</div>
    </div>
  );

const RiskProfilingSummaryCards = ({taxpayerDetailsData,taxpayerDetailsLoading,taxpayerDetailsError}) => {
    if (taxpayerDetailsLoading) {
        return (
          <Row className="mb-4 g-3 ">
            {[1, 2, 3, 4, 5,6].map((index) => (
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
    <div className='widget-main-div'>
      <Card className='widget-card' style={{ background: '#5096ff' }}>
        <MetricCard
          value={taxpayerDetailsData?.segmentation || "N/A"}
          label="Segmentation"
        />
      </Card>
      <Card className='widget-card' style={{ background: '#47C99E' }}>
        <MetricCard
          label="Taxpayer Type"
          value={taxpayerDetailsData?.taxpayer_type || "N/A"}
        />
      </Card>
      <Card className='widget-card' style={{ background: '#F96992' }}>
        <MetricCard
          label="Sector Activity"
          value={taxpayerDetailsData?.sector_activity || "N/A"}
        />
      </Card>
      <Card className='widget-card' style={{ background: '#FFA56D' }}>
        <MetricCard
          label="Enterprise Activity"
          value={taxpayerDetailsData?.enterprise_activity || "N/A"}
        />
      </Card>
      <Card className='widget-card' style={{ background: '#26DCE9' }}>
        <MetricCard
          label="Tax Centre"
          value={taxpayerDetailsData?.tax_centre || "N/A"}
        />
      </Card>
      <Card className='widget-card' style={{ background: '#FFD12C' }}>
        <MetricCard
          label="Entity Type"
          value={taxpayerDetailsData?.entity_type || "N/A"}
        />
      </Card>
    </div>
  )
}

export default RiskProfilingSummaryCards
