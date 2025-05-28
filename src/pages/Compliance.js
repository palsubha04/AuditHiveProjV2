import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TenureFilter from '../components/filters/TenureFilter';
import Layout from '../components/Layout';
import { fetchDatasets } from '../slice/datasetsSlice';
import { fetchtaxPayersDetails } from '../slice/taxPayersDetailsSlice';
import { ChevronDown, Download } from 'lucide-react';
import TaxPayersGrid from '../components/TaxPayersGrid';
import { Card, CardBody, Spinner } from 'react-bootstrap';
import './Compliance.css';
import TaxFillingComplianceChart from '../components/charts/compliance/TaxFillingComplianceChart';
import { fetchTaxFilingCompliance } from '../slice/compliance/taxFilingComplianceSlice';
import TaxDelayComplianceChart from '../components/charts/compliance/TaxDelayComplianceChart';
import ProfitLossComplianceChart from '../components/charts/compliance/ProfitLossComplianceChart';
import { fetchTaxDelayCompliance } from '../slice/compliance/taxDelayComplianceSlice';
import { fetchProfitLossCompliance } from '../slice/compliance/profitLossComplianceSlice';

const Compliance = () => {
  const dispatch = useDispatch();
  const [dateRange, setDateRange] = useState({
    start_date: '',
    end_date: '',
  });

  const {
    taxFilingComplianceData,
    taxFilingComplianceLoading,
    taxFilingComplianceError,
  } = useSelector((state) => state?.taxFilingCompliance);

  const {
    taxDelayComplianceData,
    taxDelayComplianceLoading,
    taxDelayComplianceError,
  } = useSelector((state) => state?.taxDelayCompliance);

  const {
    profitLossComplianceData,
    profitLossComplianceLoading,
    profitLossComplianceError,
  } = useSelector((state) => state?.profitLossCompliance);

  const fetchedRangeRef = useRef(null);

  useEffect(() => {
    if (!dateRange.start_date || !dateRange.end_date) return;

    const currentKey = `${dateRange.start_date}-${dateRange.end_date}`;
    if (fetchedRangeRef.current === currentKey) {
      console.log('Skipping fetch, already fetched:', currentKey);
      return;
    }

    // if (!taxFilingComplianceData) {
    dispatch(
      fetchTaxFilingCompliance({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
      })
    );
    //   }

    //  if (!taxDelayComplianceData) {
    dispatch(
      fetchTaxDelayCompliance({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
      })
    );
    //  }

        if (!profitLossComplianceData) {
          dispatch(
            fetchProfitLossCompliance({
              start_date: dateRange.start_date,
              end_date: dateRange.end_date,
            })
          );
        }
    
        console.log('Dispatching for new range:', currentKey);
        fetchedRangeRef.current = currentKey;
      }, [dateRange, dispatch]);
  
    const handleFilterChange = (range) => {
      setDateRange(range);
    };

  console.log('taxDelayComplianceData', taxDelayComplianceData);
  return (
    <Layout>
      <div className="page-container">
        <div className="top-filter-class">
          <TenureFilter onFilterChange={handleFilterChange} />
        </div>
        <div className="content">
          <div className="d-flex flex-column" style={{ gap: '32px' }}>
            <div className="d-flex">
              <Card className="chart-cards-full">
                {taxFilingComplianceLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100">
                    <TaxFillingComplianceChart
                      taxFilingComplianceData={taxFilingComplianceData}
                    />
                  </div>
                )}
              </Card>
            </div>
            <div className="d-flex" style={{ gap: '32px' }}>
              <Card className="chart-cards-half">
                {taxDelayComplianceLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100">
                    <TaxDelayComplianceChart
                      taxDelayComplianceData={taxDelayComplianceData}
                    />
                  </div>
                )}
              </Card>
              <Card className='chart-cards-half'>
                <CardBody>
                  {profitLossComplianceLoading ? (
                    <div className='spinner-div'>
                      <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="p-0 w-100">
                      <ProfitLossComplianceChart sampleData={profitLossComplianceData}/>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* <Container fluid>
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
          >
            <TenureFilter onFilterChange={handleFilterChange} />
          </div>

          <div className="row">
            <div className="col-12 mb-2"> 
             <TaxFillingComplianceChart sampleData={taxFilingComplianceData}/>
            </div>
            <div className="col-6 mb-2">
              <TaxDelayComplianceChart taxDelayComplianceData={taxDelayComplianceData}/>
            </div>
            <div className="col-6 mb-2">
              <ProfitLossComplianceChart sampleData={profitLossComplianceData}/>
            </div>
          </div>
        </Container> */}
    </Layout>
  );
};

export default Compliance;
