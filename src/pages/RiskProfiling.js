import React, { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import TenureFilter from '../components/filters/TenureFilter';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDatasets } from '../slice/datasetsSlice';
import { ChevronDown } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';
import { fetchRiskBreakdownByCategoryProfiling, resetRiskBreakdownByCategoryProfiling } from '../slice/risk-profiling/riskBreakdownCategoryProfilingSlice';
import { Card, Spinner } from 'react-bootstrap';
import { fetchFrequencyOfAnomalyProfiling, resetFrequencyOfAnomalyProfiling } from '../slice/risk-profiling/frequencyOfAnomalyProfilingSlice';
import RiskAnomalyFrequencyChart from '../components/charts/RiskAnomalyFrequencyChart';
import RiskBreakdownCategoryProfilingChart from '../components/charts/risk-profiling/RiskBreakdownCategoryProfilingChart';
import GSTBenchmarkProfilingChart from '../components/charts/risk-profiling/GSTBenchmarkProfilingChart';
import SWTBenchmarkProfilingChart from '../components/charts/risk-profiling/SWTBenchmarkProfilingChart';
import { fetchGstBenchmarkProfiling, resetGstBenchmarkProfiling } from '../slice/risk-profiling/gstBenchmarkProfilingSlice';
import { fetchSwtBenchmarkProfiling, resetSwtBenchmarkProfiling } from '../slice/risk-profiling/swtBenchmarkProfilingSlice';
import { fetchCitBenchmarkProfiling } from '../slice/risk-profiling/citBenchmarkProfilingSlice';
import { fetchGstBenchmarkCreditsProfiling, resetGstBenchmarkCreditsProfiling } from '../slice/risk-profiling/gstBenchmarkCreditsProfilingSlice';
import { fetchSwtBenchmarkEmployeesProfiling, resetSwtBenchmarkEmployeesProfiling } from '../slice/risk-profiling/swtBenchmarkEmployeesProfilingSlice';
import SWTBenchmarkEmployeesProfilingChart from '../components/charts/risk-profiling/SWTBenchmarkEmployeesProfilingChart';
import GSTBenchmarkCreditsProfilingChart from '../components/charts/risk-profiling/GSTBenchmarkCreditsProfilingChart';
import EmployeeLineChart from '../components/charts/EmployeeLineChart';
import MonthlySalesTaxSummaryChart from '../components/charts/MonthlySalesTaxSummaryChart';
import SwtSalariesChart from '../components/charts/SwtSalariesChart';
import TaxpayersRiskChart from '../components/charts/TaxpayersRiskChart';
import { fetchSalesComparison } from '../slice/salesComparisonSlice';
import { fetchEmployeeOnPayroll } from '../slice/employeeOnPayrollSlice';
import { fetchGstPayableVsRefundable } from '../slice/gstPayableVsRefundableSlice';
import { fetchswtSalariesComparison } from '../slice/swtSalariesComparisonSlice';
import './RiskProfilling.css';
import DelayedReturnFilingTable from '../components/charts/risk-profiling/DelayedReturnFilingTable';
import { fetchDelayedFiling, resetDelayedFiling } from '../slice/risk-profiling/delayedFilingsSlice';

function RiskProfiling() {
  const [dateRange, setDateRange] = useState({
    start_date: "01-01-2022",
    end_date: "31-12-2022",
  });
  const dispatch = useDispatch();
  const [selectedTIN, setSelectedTIN] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [tins, setTins] = useState([]);
  const [tinWithLabel, setTinWithLabel] = useState([]);
  const [tinLabels, setTinLabels] = useState([]);
  const { data, loading, error } = useSelector((state) => state?.datasets);
  const {
    riskBreakdownByCategoryProfilingData,
    riskBreakdownByCategoryProfilingLoading,
    riskBreakdownByCategoryProfilingError,
  } = useSelector((state) => state?.riskBreakdownByCategoryProfiling);
  const {
    frequencyOfAnomalyProfilingData,
    frequencyOfAnomalyProfilingLoading,
    frequencyOfAnomalyProfilingError,
  } = useSelector((state) => state?.frequencyOfAnomalyProfiling);
  // gst benchmark store
  const {
    gstBenchmarkProfilingData,
    gstBenchmarkProfilingLoading,
    gstBenchmarkProfilingError,
  } = useSelector((state) => state?.gstBenchmarkProfiling);
  // swt benchmark store
  const {
    swtBenchmarkProfilingData,
    swtBenchmarkProfilingLoading,
    swtBenchmarkProfilingError,
  } = useSelector((state) => state?.swtBenchmarkProfiling);
  // cit benchmark store
  const {
    citBenchmarkProfilingData,
    citBenchmarkProfilingLoading,
    citBenchmarkProfilingError,
  } = useSelector((state) => state?.citBenchmarkProfiling);
  const {
    gstBenchmarkCreditsProfilingData,
    gstBenchmarkCreditsProfilingLoading,
    gstBenchmarkCreditsProfilingError,
  } = useSelector((state) => state?.gstBenchmarkCreditsProfiling);
  const {
    swtBenchmarkEmployeesProfilingData,
    swtBenchmarkEmployeesProfilingLoading,
    swtBenchmarkEmployeesProfilingError,
  } = useSelector((state) => state?.swtBenchmarkEmployeesProfiling);
  const { delayedFilingData, delayedFilingLoading, delayedFilingError } =
    useSelector((state) => state?.delayedFiling);
  // GST Sales Comparison
  const { monthlySalesData, monthlySalesLoading, monthlySalesError } =
    useSelector((state) => state?.salesComparison);
  // GST Payable vs Refundable
  const { payrollData, payrollLoading, payrollError } = useSelector(
    (state) => state?.employeeOnPayroll
  );
  // Employee on Payroll Vs Paid SWT
  const { gstData, gstLoading, gstError } = useSelector(
    (state) => state?.gstPayableVsRefundable
  );
  // SWT Salaries Comparison
  const {
    swtSalariesComparisonData,
    swtSalariesComparisonLoading,
    swtSalariesComparisonError,
  } = useSelector((state) => state?.swtSalariesComparison);


  useEffect(() => {
    if (!data) {
      dispatch(fetchDatasets());
    }

    return () => {
      dispatch(resetFrequencyOfAnomalyProfiling());
      dispatch(resetRiskBreakdownByCategoryProfiling());
      dispatch(resetGstBenchmarkProfiling());
      dispatch(resetGstBenchmarkCreditsProfiling());
      dispatch(resetSwtBenchmarkProfiling());
      dispatch(resetSwtBenchmarkEmployeesProfiling());
      dispatch(resetDelayedFiling());
    };
  }, [data, dispatch]);

  const fetchedRangeRef = useRef(null);
  const handleFilterChange = (range) => {
    if (
      range.start_date !== dateRange.start_date ||
      range.end_date !== dateRange.end_date
    ) {
      setDateRange(range);
    }
  };

  useEffect(() => {
    if (data?.records && data.records.length > 0) {
      const tinList = data.records.map((e, index) => {
        return data.records[index].tin;
      });
      setTins(tinList);
      setSelectedTIN(tinList[tinList.length - 1]);
      const tinLabelList = [];
      const tinWithTaxpayerName = [];
      for (let i = 0; i < data.records.length; i++) {
        tinLabelList.push({
          label: data.records[i].tin + " - " + data.records[i].taxpayer_name,
          value: data.records[i].tin,
        });
        tinWithTaxpayerName.push(
          data.records[i].tin + " - " + data.records[i].taxpayer_name
        );
      }
      setTinLabels(tinWithTaxpayerName);
      setTinWithLabel(tinLabelList);
    }
  }, [data]);

  const yearOptions =
    data?.years?.map((year) => ({
      label: String(year),
      value: String(year),
    })) || [];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fix: Filter tinWithLabel instead of tins
  const filteredTins = tinWithLabel.filter((tin) =>
    tin.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedTIN) {
      if (!gstBenchmarkCreditsProfilingData) {
        dispatch(
          fetchGstBenchmarkCreditsProfiling({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }
      if (!swtBenchmarkEmployeesProfilingData) {
        dispatch(
          fetchSwtBenchmarkEmployeesProfiling({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }
      if (!riskBreakdownByCategoryProfilingData) {
        dispatch(
          fetchRiskBreakdownByCategoryProfiling({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }

      if (!gstBenchmarkProfilingData) {
        dispatch(
          fetchGstBenchmarkProfiling({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }

      if (!swtBenchmarkProfilingData) {
        dispatch(
          fetchSwtBenchmarkProfiling({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }

      if (!citBenchmarkProfilingData) {
        dispatch(
          fetchCitBenchmarkProfiling({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }
      if (!frequencyOfAnomalyProfilingData) {
        dispatch(
          fetchFrequencyOfAnomalyProfiling({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }
      if (!monthlySalesData) {
        dispatch(
          fetchSalesComparison({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }
      if (!payrollData) {
        dispatch(
          fetchEmployeeOnPayroll({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }
      if (!gstData) {
        dispatch(
          fetchGstPayableVsRefundable({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }
      if (!swtSalariesComparisonData) {
        dispatch(
          fetchswtSalariesComparison({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }
      if (!delayedFilingData) {
        dispatch(
          fetchDelayedFiling({
            start_date: dateRange.start_date,
            end_date: dateRange.end_date,
            tin: selectedTIN,
          })
        );
      }
    }
  }, [data, selectedTIN, dateRange]);

  const handleSearch = () => {
    dispatch(
      fetchGstBenchmarkCreditsProfiling({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );
    dispatch(
      fetchSwtBenchmarkEmployeesProfiling({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );
    dispatch(
      fetchRiskBreakdownByCategoryProfiling({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );

    dispatch(
      fetchFrequencyOfAnomalyProfiling({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );

    dispatch(
      fetchGstBenchmarkProfiling({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );

    dispatch(
      fetchSwtBenchmarkProfiling({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );

    dispatch(
      fetchCitBenchmarkProfiling({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );
    dispatch(
      fetchSalesComparison({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );
    dispatch(
      fetchEmployeeOnPayroll({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );
    dispatch(
      fetchGstPayableVsRefundable({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );
    dispatch(
      fetchswtSalariesComparison({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );
    dispatch(
      fetchDelayedFiling({
        start_date: dateRange.start_date,
        end_date: dateRange.end_date,
        tin: selectedTIN,
      })
    );
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="top-filter-class">
          <div ref={dropdownRef} className="tin-container pe-3 me-3">
            <label
              style={{
                fontWeight: 500,
                fontSize: "14px",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
              }}
            >
              TIN
            </label>
            <div
              className="tin-dropdown"
              onClick={() => setIsDropdownOpen((open) => !open)}
            >
              {selectedTIN
                ? selectedTIN +
                  " - " +
                  (data?.records?.find((record) => record.tin === selectedTIN)
                    ?.taxpayer_name || "N/A")
                : "Select TIN"}{" "}
              <ChevronDown />
            </div>
            {isDropdownOpen && (
              <div className="tin-dropdown-list">
                <input
                  type="text"
                  placeholder="Search TIN..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <List
                  height={200}
                  itemCount={filteredTins.length}
                  itemSize={35}
                  width={"100%"}
                >
                  {({ index, style }) => (
                    <div
                      style={{
                        ...style,
                        padding: "8px 12px",
                        background:
                          filteredTins[index].value === selectedTIN
                            ? "#e0e7ef"
                            : "#fff",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setSelectedTIN(filteredTins[index].value);
                        setIsDropdownOpen(false);
                        setSearchTerm("");
                      }}
                      key={filteredTins[index].value}
                    >
                      {filteredTins[index].label}
                    </div>
                  )}
                </List>
              </div>
            )}
          </div>
          <TenureFilter onFilterChange={handleFilterChange} />
          <div className="d-flex ps-2 gap-2 justify-center align-items-center">
            <span>{dateRange.start_date}</span>
            <span>to</span>
            <span>{dateRange.end_date}</span>
          </div>
          <div className="search-container">
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>
        </div>

        {/* Rest of your component remains the same */}
        {/* <div className="content">
         
        </div> */}
        <div className="content">
          <div className="d-flex flex-column" style={{ gap: "32px" }}>
            <div className="d-flex" style={{ gap: "32px" }}>
              <Card className="chart-cards-half">
                {frequencyOfAnomalyProfilingLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100">
                    <RiskAnomalyFrequencyChart
                      riskAnomalyFrequencyData={frequencyOfAnomalyProfilingData}
                      source="Risk Profiling"
                    />
                  </div>
                )}
              </Card>
              <Card className="chart-cards-half">
                {riskBreakdownByCategoryProfilingLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <RiskBreakdownCategoryProfilingChart
                    riskBreakdownByCategoryDataProfiling={
                      riskBreakdownByCategoryProfilingData
                    }
                  />
                )}
              </Card>
            </div>
            <div className="d-flex" style={{ gap: "32px" }}>
              <Card className="chart-cards-half">
                {gstBenchmarkProfilingLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100">
                    <GSTBenchmarkProfilingChart
                      gstBenchmarkProfilingData={gstBenchmarkProfilingData}
                    />
                  </div>
                )}
              </Card>
              <Card className="chart-cards-half">
                {gstBenchmarkCreditsProfilingLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100">
                    <GSTBenchmarkCreditsProfilingChart
                      gstBenchmarkCreditsProfilingData={
                        gstBenchmarkCreditsProfilingData
                      }
                    />
                  </div>
                )}
              </Card>
            </div>
            <div className="d-flex" style={{ gap: "32px" }}>
              <Card className="chart-cards-half">
                {swtBenchmarkProfilingLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100">
                    <SWTBenchmarkProfilingChart
                      swtBenchmarkProfilingData={swtBenchmarkProfilingData}
                    />
                  </div>
                )}
              </Card>
              <Card className="chart-cards-half">
                {swtBenchmarkProfilingLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100">
                    <SWTBenchmarkEmployeesProfilingChart
                      swtBenchmarkEmployeesProfilingData={
                        swtBenchmarkEmployeesProfilingData
                      }
                    />
                  </div>
                )}
              </Card>
            </div>
            <div className="d-flex flex-column" style={{ gap: "32px" }}>
              <Card className="chart-cards-full">
                {monthlySalesLoading ? (
                  <div className="chart-big">
                    <div className="spinner-div">
                      <Spinner
                        animation="border"
                        role="status"
                        variant="primary"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  </div>
                ) : (
                  <MonthlySalesTaxSummaryChart
                    salesData={monthlySalesData}
                    start_date={dateRange.start_date}
                    end_date={dateRange.end_date}
                  />
                )}
              </Card>
              <Card className="chart-cards-full">
                {gstLoading ? (
                  <div className="chart-big">
                    {" "}
                    <div className="spinner-div">
                      {" "}
                      <Spinner
                        animation="border"
                        role="status"
                        variant="primary"
                      >
                        {" "}
                        <span className="visually-hidden">Loading...</span>{" "}
                      </Spinner>{" "}
                    </div>
                  </div>
                ) : (
                  <TaxpayersRiskChart
                    data={gstData}
                    start_date={dateRange.start_date}
                    end_date={dateRange.end_date}
                  />
                )}
              </Card>
            </div>
            <div className="d-flex flex-column" style={{ gap: "32px" }}>
              <Card className="chart-cards-full">
                {payrollLoading ? (
                  <div className="chart-big">
                    <div className="spinner-div">
                      <Spinner
                        animation="border"
                        role="status"
                        variant="primary"
                      >
                        {" "}
                        <span className="visually-hidden">Loading...</span>{" "}
                      </Spinner>{" "}
                    </div>{" "}
                  </div>
                ) : (
                  <EmployeeLineChart
                    data={payrollData}
                    start_date={dateRange.start_date}
                    end_date={dateRange.end_date}
                  />
                )}
              </Card>
              <Card className="chart-cards-full">
                {swtSalariesComparisonLoading ? (
                  <div className="chart-big">
                    <div className="spinner-div">
                      <Spinner
                        animation="border"
                        role="status"
                        variant="primary"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  </div>
                ) : (
                  <SwtSalariesChart
                    data={swtSalariesComparisonData}
                    start_date={dateRange.start_date}
                    end_date={dateRange.end_date}
                  />
                )}
              </Card>
            </div>
            <div className="d-flex" style={{ gap: "32px" }}>
              <Card className="chart-cards-full">
                {delayedFilingLoading ? (
                  <div className="spinner-div">
                    <Spinner animation="border" role="status" variant="primary">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
                  <div className="p-0 w-100 h-100">
                    <DelayedReturnFilingTable
                      delayedFilingData={delayedFilingData}
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

export default RiskProfiling;
