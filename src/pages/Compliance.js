import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TenureFilter from '../components/filters/TenureFilter';
import Layout from '../components/Layout';
import { fetchDatasets } from '../slice/datasetsSlice';
import { fetchtaxPayersDetails } from '../slice/taxPayersDetailsSlice';
import { ChevronDown, Download } from 'lucide-react';
import TaxPayersGrid from '../components/TaxPayersGrid';
import { Card, CardBody, CardHeader, Placeholder, Spinner } from 'react-bootstrap';
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

    //   if (!profitLossComplianceData) {
    dispatch(
      fetchProfitLossCompliance({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
      })
    );
    //   }

    fetchedRangeRef.current = currentKey;
  }, [dateRange, dispatch]);

  const handleFilterChange = (range) => {
    setDateRange(range);
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="top-filter-class">
          <TenureFilter onFilterChange={handleFilterChange} />
          <div className="d-flex ps-2 gap-2 justify-center align-items-center">
            <span>{dateRange.start_date}</span>
            <span>to</span>
            <span>{dateRange.end_date}</span>
          </div>
        </div>
        <div className="content">
          <div className="d-flex flex-column" style={{ gap: '32px' }}>
            <div className="d-flex">
              <Card className="chart-cards-full">
                {taxFilingComplianceLoading ? (
                  <>
                    <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
                      <div className="chart-headers" style={{ height: "30px" }}></div>
                    </Card.Header>
                    <Card.Body>
                      <Placeholder as="div" animation="glow" style={{ height: 350 }}>
                        <Placeholder
                          xs={12}
                          style={{
                            height: "100%",
                            borderRadius: "0.25rem",
                            backgroundColor: "#d5e6ff",
                          }}
                        />
                      </Placeholder>
                      <div className="d-flex justify-content-around mt-3">
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                      </div>
                    </Card.Body>
                  </>
                ) : (
                  <TaxFillingComplianceChart
                    taxFilingComplianceData={taxFilingComplianceData}
                  />
                )}
              </Card>
            </div>
            <div className="d-flex" style={{ gap: '32px' }}>
              <Card className="chart-cards-half">
                {taxDelayComplianceLoading ? (
                  <>
                    <CardHeader className="chart-card-header d-flex justify-content-between align-items-center">
                      <div className="chart-headers" style={{ height: "30px" }}>
                        {/* Placeholder for the chart title */}
                        <Placeholder as="span" animation="glow" xs={5} />
                      </div>
                      {/* Placeholder for the export dropdown */}
                    </CardHeader>
                    <CardBody>
                      <div
                        style={{
                          height: 350,
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Placeholder
                          as="div"
                          animation="glow"
                          // Set explicit equal width and height for a perfect circle
                          style={{
                            width: "250px", // Or any desired size, just make sure height matches
                            height: "250px",
                            borderRadius: "50%",
                            backgroundColor: "#d5e6ff",
                          }}
                        />
                      </div>
                      <div className="d-flex justify-content-around mt-3">
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                      </div>
                    </CardBody>
                  </>
                ) : (
                  <TaxDelayComplianceChart
                    taxDelayComplianceData={taxDelayComplianceData}
                  />
                )}
              </Card>
              <Card className='chart-cards-half'>
                {profitLossComplianceLoading ? (
                  <>
                    <Card.Header className="chart-card-header d-flex justify-content-between align-items-center">
                      <div className="chart-headers" style={{ height: "30px" }}></div>
                    </Card.Header>
                    <Card.Body>
                      <Placeholder as="div" animation="glow" style={{ height: 350 }}>
                        <Placeholder
                          xs={12}
                          style={{
                            height: "100%",
                            borderRadius: "0.25rem",
                            backgroundColor: "#d5e6ff",
                          }}
                        />
                      </Placeholder>
                      <div className="d-flex justify-content-around mt-3">
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                        <Placeholder xs={2} style={{ backgroundColor: "#d5e6ff" }} />
                      </div>
                    </Card.Body>
                  </>
                ) : (
                  <ProfitLossComplianceChart profitLossComplianceData={profitLossComplianceData} />
                )}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Compliance;
