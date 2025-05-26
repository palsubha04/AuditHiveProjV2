import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Layout from '../components/Layout';
// import SWTSalesComparison from '../components/charts/SWTSalesComparison';
import SWTPayableVsRefundable from '../components/charts/SWTPayableVsRefundable';
// import SWTTaxRecordsTable from '../components/tables/SWTTaxRecordsTable';
// import TenureFilter from '../components/filters/TenureFilter';
import SWTSummaryCards from '../components/summary/SWTSummaryCards';
import SWTSegmentationDistributionChart from '../components/charts/SWTSegmentationDistributionChart';
import RiskCategoriesChart from '../components/charts/RiskCategoriesChart';
import './Dashboard.css';
import SWTSalesComparison from '../components/charts/SWTSalesComparison';
import TenureFilter from '../components/filters/TenureFilter';
import SWTTaxRecordsTable from '../components/tables/SWTTaxRecordsTable';

function SWT() {
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: '',
  });

  const handleFilterChange = (range) => {
    setDateRange(range);
  };

  return (
    <Layout>
      <Container fluid>
        <div className="top-filter-class">
          <TenureFilter onFilterChange={handleFilterChange} />
          <div className="d-flex ps-2 gap-2 justify-center align-items-center">
            <span>{dateRange.start_date}</span>
            <span>to</span>
            <span>{dateRange.end_date}</span>
          </div>
        </div>

        <SWTSummaryCards
          startDate={dateRange.start_date}
          endDate={dateRange.end_date}
        />

        <div className="row">
          <div className="col-12 chart-columns-div">
            <SWTSalesComparison
              startDate={dateRange.start_date}
              endDate={dateRange.end_date}
            />
          </div>
          <div className="col-12 chart-columns-div">
            <SWTPayableVsRefundable
              startDate={dateRange.start_date}
              endDate={dateRange.end_date}
            />
          </div>
          <div className="row chart-columns-div pe-0">
            <div className="col-md-6">
              <SWTSegmentationDistributionChart
                startDate={dateRange.start_date}
                endDate={dateRange.end_date}
              />
            </div>
            <div className="col-md-6 pe-0">
              <RiskCategoriesChart
                startDate={dateRange.start_date}
                endDate={dateRange.end_date}
                taxType="swt"
              />
            </div>
          </div>
          <div className="col-12">
            <SWTTaxRecordsTable
              startDate={dateRange.start_date}
              endDate={dateRange.end_date}
            />
          </div>
        </div>
      </Container>
    </Layout>
  );
}

export default SWT;
