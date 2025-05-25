import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import { FixedSizeList as List } from 'react-window';
import TenureFilter from '../components/filters/TenureFilter';
import Layout from '../components/Layout';
import { fetchDatasets } from '../slice/datasetsSlice';
import { fetchtaxPayersDetails } from '../slice/taxPayersDetailsSlice';
import { ChevronDown, Download } from 'lucide-react';
import TaxPayersGrid from '../components/TaxPayersGrid';
import { Card, CardBody, Container, Spinner } from 'react-bootstrap';
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
      end_date: ''
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

    console.log("taxDelayComplianceData", taxDelayComplianceData);
    return (
      <Layout>
          <div className="page-container">
        <div className='top-filter-class'>
          <TenureFilter
            onFilterChange={handleFilterChange}/>
        </div>
        <div className='content'>
          <div className='d-flex flex-column' style={{gap: '32px'}}>
            <div className='d-flex'>
              <Card className='chart-cards-full'>
                <CardBody>
                  {taxFilingComplianceLoading ? (
                    <div className='spinner-div'>
                      <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="p-0 w-100">
                      <TaxFillingComplianceChart taxFilingComplianceData={taxFilingComplianceData}/>
                    </div>
                  )}
                </CardBody>
              </Card>
            </div>
            <div className='d-flex' style={{gap: '32px'}}>
            <Card className='chart-cards-half'>
                <CardBody>
                  {taxDelayComplianceLoading ? (
                    <div className='spinner-div'>
                      <Spinner animation="border" role="status" variant="primary">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    </div>
                  ) : (
                    <div className="p-0 w-100">
                      <TaxDelayComplianceChart taxDelayComplianceData={taxDelayComplianceData}/>
                    </div>
                  )}
                </CardBody>
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

  
  // return (
  //   <>
  //     <Layout>
  //       <div className="page-container">
  //         <div className="filter-container">
  //           <label style={{ fontWeight: 'bold', marginRight: 8 }}>TIN</label>
  //           <div ref={dropdownRef} style={{ position: 'relative', width: 200 }}>
  //             <div
  //               style={{
  //                 border: '1px solid #ccc',
  //                 borderRadius: 4,
  //                 padding: 3,
  //                 background: '#fff',
  //                 cursor: 'pointer',
  //                 minHeight: 6,
  //                 userSelect: 'none',
  //                 display: 'flex',
  //                 alignItems: 'center',
  //                 justifyContent: 'space-between',
  //               }}
  //               onClick={() => setIsDropdownOpen((open) => !open)}
  //             >
  //               {selectedTIN || 'Select TIN'} <ChevronDown />
  //             </div>
  //             {isDropdownOpen && (
  //               <div
  //                 style={{
  //                   position: 'absolute',
  //                   top: '110%',
  //                   left: 0,
  //                   width: '100%',
  //                   zIndex: 10,
  //                   border: '1px solid #eee',
  //                   borderRadius: 4,
  //                   background: '#fff',
  //                   boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  //                   maxHeight: 240, // Adjusted maxHeight to accommodate input
  //                   overflow: 'hidden',
  //                   display: 'flex', // Added to manage layout of input and list
  //                   flexDirection: 'column', // Added for vertical layout
  //                 }}
  //               >
  //                 <input
  //                   type="text"
  //                   placeholder="Search TIN..."
  //                   value={searchTerm}
  //                   onChange={(e) => setSearchTerm(e.target.value)}
  //                   style={{
  //                     padding: '8px 12px',
  //                     border: 'none',
  //                     borderBottom: '1px solid #eee',
  //                     outline: 'none',
  //                     width: 'calc(100% - 24px)', // Adjust width to account for padding
  //                     boxSizing: 'border-box',
  //                   }}
  //                   autoFocus // Optional: to focus input when dropdown opens
  //                 />
  //                 <List
  //                   height={200} // Adjusted height for the list itself
  //                   itemCount={filteredTins.length}
  //                   itemSize={35}
  //                   width={'100%'} // Changed width to be responsive
  //                 >
  //                   {({ index, style }) => (
  //                     <div
  //                       style={{
  //                         ...style,
  //                         padding: '8px 12px',
  //                         background:
  //                           filteredTins[index] === selectedTIN
  //                             ? '#e0e7ef'
  //                             : '#fff',
  //                         cursor: 'pointer',
  //                       }}
  //                       onClick={() => {
  //                         setSelectedTIN(filteredTins[index]);
  //                         setIsDropdownOpen(false);
  //                         setSearchTerm(''); // Reset search term on selection
  //                       }}
  //                       key={filteredTins[index]}
  //                     >
  //                       {filteredTins[index]}
  //                     </div>
  //                   )}
  //                 </List>
  //               </div>
  //             )}
  //           </div>
  //           <div
  //             style={{
  //               flex: '0 1 auto',
  //               minWidth: 0,
  //               height: 48,
  //               display: 'flex',
  //               alignItems: 'center',
  //             }}
  //           >
  //             <TenureFilter
  //               onFilterChange={handleFilterChange}
  //               tenureOptions={yearOptions}
  //             />
  //           </div>
  //           <button
  //             onClick={handleSearch}
  //             style={{
  //               background: '#2563eb',
  //               color: '#fff',
  //               border: 'none',
  //               borderRadius: 20,
  //               padding: '8px 24px',
  //               fontWeight: 500,
  //               marginLeft: 8,
  //             }}
  //           >
  //             Search
  //           </button>
  //         </div>
  //         <div
  //           style={{
  //             marginTop: 24,
  //             padding: '20px',
  //             background: '#f1f5ff',
  //             borderRadius: '12px',
  //             textAlign: 'center',
  //             fontWeight: 600,
  //             color: '#2563eb',
  //             fontSize: '1.2rem',
  //             boxShadow: '0 2px 8px 0 #e0e7ef55',
  //             maxWidth: 400,
  //             marginLeft: 'auto',
  //             marginRight: 'auto',
  //           }}
  //         >
  //           New Page View Will Be coming soon
  //         </div>
  //       </div>

  //       {/* --- Dat Grid Row --- */}
  //       {/* <div
  //         style={{
  //           marginTop: 32,
  //           border: '1px solid #f1f5f9',
  //           borderRadius: 16,
  //           background: 'linear-gradient(135deg, #f1f5ff 0%, #fff 100%)',
  //           boxShadow: '0 2px 16px 0 #e0e7ef55',
  //           padding: '24px 24px 8px 24px',
  //           minWidth: 900,
  //           maxWidth: 1200,
  //         }}
  //       >
  //         {taxPayersLoading ? (
  //           <div
  //             style={{
  //               display: 'flex',
  //               justifyContent: 'center',
  //               alignItems: 'center',
  //               height: 250,
  //             }}
  //           >
  //             <Spinner animation="border" role="status" variant="primary">
  //               <span className="visually-hidden">Loading...</span>
  //             </Spinner>
  //           </div>
  //         ) : (
  //           <TaxPayersGrid data={taxPayersData} />
  //         )}
  //       </div> */}
  //       {/* --- End Line & SWT Chart Row --- */}
  //     </Layout>
  //   </>
  // );
};

export default Compliance;
