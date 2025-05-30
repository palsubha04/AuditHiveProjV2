import { useState } from 'react';
import Layout from '../components/Layout';
import TenureFilter from '../components/filters/TenureFilter';
import RiskCategoriesChart from '../components/charts/RiskCategoriesChart';
import CITSegmentationDistributionChart from '../components/charts/CITSegmentationDistributionChart';
import CITNetProfitTaxPayers from '../components/tables/CITNetProfitTaxPayers';
import CITNetLossTaxPayers from '../components/tables/CITNetLossTaxPayers';
import CITCostSalesComparison from '../components/tables/CITCostSalesComparison';

import './Dashboard.css';
import InterestExpenseCitChart from '../components/charts/CIT/InterestExpenseCitChart';
import SuperneutionCitChart from '../components/charts/CIT/SuperneutionCitChart';


function CIT() {
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

      <div className="row">
        <div className="col-12 chart-columns-div">
          <CITNetProfitTaxPayers startDate={dateRange.start_date} endDate={dateRange.end_date} />
        </div>
        <div className="col-12 chart-columns-div">
          <CITNetLossTaxPayers startDate={dateRange.start_date} endDate={dateRange.end_date} />
        </div>
        <div className="col-md-6 pe-4">
          <CITSegmentationDistributionChart
            startDate={dateRange.start_date}
            endDate={dateRange.end_date}
          />
        </div>
        <div className="col-md-6 ">
          <RiskCategoriesChart
            startDate={dateRange.start_date}
            endDate={dateRange.end_date}
            taxType="cit"
          />
        </div>
        <div className="col-md-6 pe-4 pt-2">
          <SuperneutionCitChart
            startDate={dateRange.start_date}
            endDate={dateRange.end_date}
          />
        </div>
        <div className='col-md-6 pt-2'>
          <InterestExpenseCitChart
            startDate={dateRange.start_date}
            endDate={dateRange.end_date}
          />
        </div>
        <div className='col-md-12 pt-2'>
          <CITCostSalesComparison startDate={dateRange.start_date} endDate={dateRange.end_date} />
        </div>
      </div>
    </Layout>
  );
}

export default CIT;
