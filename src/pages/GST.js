import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Layout from '../components/Layout';
import SalesComparison from '../components/charts/SalesComparison';
import GSTPayableVsRefundable from '../components/charts/GSTPayableVsRefundable';
import TaxRecordsTable from '../components/tables/TaxRecordsTable';
import TenureFilter from '../components/filters/TenureFilter';
import GSTSummaryCards from '../components/summary/GSTSummaryCards';
import SegmentationDistributionChart from '../components/charts/SegmentationDistributionChart';
import RiskCategoriesChart from '../components/charts/RiskCategoriesChart';
import './Dashboard.css';

function GST() {
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: '',
  });

  const handleFilterChange = (range) => {
    setDateRange(range);
  };

  return (
    <Layout>
      <div className="top-filter-class">
        <TenureFilter onFilterChange={handleFilterChange} />
        <div className="d-flex ps-2 gap-2 justify-center align-items-center">
          <span>{dateRange.start_date}</span>
          <span>to</span>
          <span>{dateRange.end_date}</span>
        </div>
      </div>

      <GSTSummaryCards
        startDate={dateRange.start_date}
        endDate={dateRange.end_date}
      />

      <div className="row">
        <div className="col-12 chart-columns-div">
          <SalesComparison
            startDate={dateRange.start_date}
            endDate={dateRange.end_date}
          />
        </div>
        <div className="col-12 chart-columns-div">
          <GSTPayableVsRefundable
            startDate={dateRange.start_date}
            endDate={dateRange.end_date}
          />
        </div>
        <div className="row chart-columns-div pe-0">
          <div className="col-md-6">
            <SegmentationDistributionChart
              startDate={dateRange.start_date}
              endDate={dateRange.end_date}
            />
          </div>
          <div className="col-md-6 pe-0">
            <RiskCategoriesChart
              startDate={dateRange.start_date}
              endDate={dateRange.end_date}
              taxType="gst"
            />
          </div>
        </div>
        <div className="col-12">
          <TaxRecordsTable
            startDate={dateRange.start_date}
            endDate={dateRange.end_date}
          />
        </div>
      </div>
    </Layout>
  );
}

export default GST;
