import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import MonthlySalesTaxSummaryChart from '../components/charts/MonthlySalesTaxSummaryChart';
import RiskAnalysisByIndustryChart from '../components/charts/RiskAnalysisByIndustryChart';
import RiskBreakdownByCategoryChart from '../components/charts/RiskBreakdownByCategoryChart';
import { fetchTopFraudRulesProfiling } from '../slice/risk-profiling/topFraudRulesProfilingSlice';
import EmployeeLineChart from '../components/charts/EmployeeLineChart';
import TotalVsFlaggedLineChart from '../components/charts/TotalVsFlaggedLineChart';
import { useDispatch, useSelector } from 'react-redux';
import TenureFilter from '../components/filters/TenureFilter';
import { fetchTotalVsFlaggedTaxpayers } from '../slice/totalVsFlaggedTaxpayersSlice';
import { fetchRiskBreakdownByCategory } from '../slice/riskBreakdownByCategorySlice';
import { fetchRiskAnalysis } from '../slice/riskAnalysisByIndustrySlice';
import { ClipLoader } from 'react-spinners';
import { ToastContainer } from 'react-toastify';
import { fetchDatasets } from '../slice/datasetsSlice';
import RiskAnomalyFrequencyChart from '../components/charts/RiskAnomalyFrequencyChart';
import { fetchRiskAnomaly } from '../slice/riskAnomalyFrequencySlice';
import { Card, CardBody, CardHeader, Spinner } from 'react-bootstrap';
import TopFraudRulesProfiling from '../components/charts/risk-profiling/TopFraudRulesProfiling';
import './RiskAssessment.css';
import RiskChartPage from '../components/charts/TestChart';
//import { set } from "react-datepicker/dist/date_utils";

// Added by Soham - Total Tax Payer vs Risk Flagged

const entityTypes = ['large', 'medium', 'small', 'micro'];

function RiskAssessment() {
  const [dateRange, setDateRange] = useState({
    start_date: null,
    end_date: null,
  });
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((state) => state?.datasets);
  //const [fetchedFlaggedRange, setFetchedFlaggedRange] = useState(null);

  //filters for top fraud
  const [selectedTaxType, setSelectedTaxType] = useState('gst');
  const [selectedSegmentation, setSelectedSegmentation] = useState('large');

  const {
    totalVsFlaggedTaxpayersData,
    totalVsFlaggedTaxpayersLoading,
    totalVsFlaggedTaxpayersError,
  } = useSelector((state) => state?.totalVsFlaggedTaxpayers);

  const {
    riskBreakdownByCategoryData,
    riskBreakdownByCategoryLoading,
    riskBreakdownByCategoryError,
  } = useSelector((state) => state?.riskBreakdownByCategory);

  const { riskAnalysisData, riskAnalysisLoading, riskAnalysisError } =
    useSelector((state) => state?.riskAnalysisByIndustry);

  const {
    riskAnomalyFrequencyData,
    riskAnomalyFrequencyLoading,
    riskAnomalyFrequencyError,
  } = useSelector((state) => state?.riskAnomalyFrequency);

  const {
    topFraudRulesProfilingData,
    topFraudRulesProfilingLoading,
    topFraudRulesProfilingError,
  } = useSelector((state) => state?.topFraudRulesProfiling);

  useEffect(() => {
    if (!data) {
      dispatch(fetchDatasets());
    }
  }, [data, dispatch]);

  const fetchedRangeRef = useRef(null);

  useEffect(() => {
    if (!dateRange.start_date || !dateRange.end_date) return;

    const currentKey = `${dateRange.start_date}-${dateRange.end_date}`;
    if (fetchedRangeRef.current === currentKey) {
      console.log('Skipping fetch, already fetched:', currentKey);
      return;
    }

    // if (!topFraudRulesProfilingData) {
    dispatch(
      fetchTopFraudRulesProfiling({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        taxType: 'gst',
        segmentation: 'large',
      })
    );
    // }

    console.log('Dispatching for new range:', currentKey);
    fetchedRangeRef.current = currentKey;

    dispatch(fetchTotalVsFlaggedTaxpayers(dateRange));
    dispatch(fetchRiskBreakdownByCategory(dateRange));
    dispatch(fetchRiskAnalysis(dateRange));
    dispatch(fetchRiskAnomaly(dateRange));
  }, [dateRange, dispatch]);

  const handleFilterChange = (range) => {
    if (
      range.start_date !== dateRange.start_date ||
      range.end_date !== dateRange.end_date
    ) {
      setDateRange(range);
    }
  };

  const handleTopFraudFilterChange = (taxType, segmentation) => {
    console.log('filter chaged');
    console.log('taxtype', taxType);
    console.log('segmentaion', segmentation);
    setSelectedTaxType(taxType);
    setSelectedSegmentation(segmentation);
    dispatch(
      fetchTopFraudRulesProfiling({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        taxType: taxType,
        segmentation: segmentation,
      })
    );
  };

  const yearOptions =
    data?.years?.map((year) => ({
      label: String(year),
      value: String(year),
    })) || [];

  return (
    <Layout>
      <div className="page-container">
        <div className="top-filter-class">
          <TenureFilter
            onFilterChange={handleFilterChange}
            //tenureOptions={yearOptions}
          />
          <div className="d-flex ps-2 gap-2 justify-center align-items-center">
            <span>{dateRange.start_date}</span>
            <span>to</span>
            <span>{dateRange.end_date}</span>
          </div>
        </div>

        <div className="content">
          <div className="d-flex flex-column" style={{ gap: '32px' }}>
            <div className="d-flex" style={{ gap: '32px' }}>
              <Card className="chart-cards-half">
                {totalVsFlaggedTaxpayersLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100">
                    <TotalVsFlaggedLineChart
                      totalTaxPayerVsRiskFlagged={totalVsFlaggedTaxpayersData}
                    />
                  </div>
                )}
              </Card>
              <Card className="chart-cards-half">
                {riskAnomalyFrequencyLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100">
                    <RiskAnomalyFrequencyChart
                      riskAnomalyFrequencyData={riskAnomalyFrequencyData}
                      source="Risk Assessment"
                    />
                  </div>
                )}
              </Card>
            </div>
            <div className="d-flex">
              <Card className="chart-cards-full">
                {riskBreakdownByCategoryLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100">
                    <RiskBreakdownByCategoryChart
                      riskBreakdownByCategoryData={riskBreakdownByCategoryData}
                    />
                  </div>
                )}
              </Card>
            </div>
            <div className="d-flex">
              <Card className="chart-cards-full">
                {riskAnalysisLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100">
                    <RiskAnalysisByIndustryChart riskData={riskAnalysisData} />
                  </div>
                )}
              </Card>
            </div>
            <div className="d-flex">
              <Card className="chart-cards-table">
                {topFraudRulesProfilingLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100 h-100">
                    <TopFraudRulesProfiling
                      topFraudRulesProfilingData={topFraudRulesProfilingData}
                      handleTopFraudFilterChange={handleTopFraudFilterChange}
                      selectedTaxType={selectedTaxType}
                      selectedSegmentation={selectedSegmentation}
                    />
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default RiskAssessment;
