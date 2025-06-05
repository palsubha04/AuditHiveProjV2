import React, { useEffect, useRef, useState } from 'react'
import Layout from '../components/Layout';
import ExcelViewer from './ExcelViewer';
import TenureFilter from '../components/filters/TenureFilter';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDatasets } from '../slice/datasetsSlice';
import { ChevronDown } from 'lucide-react';
import { FixedSizeList as List } from 'react-window';
import { fetchTaxpayerReport, resetTaxpayerReport } from '../slice/taxpayerReportSlice';

const TaxpayerReport = () => {
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
        taxpayerReportData,
        taxpayerReportLoading,
        taxpayerReportError,
      } = useSelector((state) => state?.taxpayerReport);
    
      useEffect(() => {
        if (!data) {
          dispatch(fetchDatasets());
        }
    
        return () => {
          dispatch(resetTaxpayerReport());
        
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
        
          if (!taxpayerReportData) {
            dispatch(
              fetchTaxpayerReport({
                start_date: dateRange.start_date,
                end_date: dateRange.end_date,
                tin: selectedTIN
              })
            );
          }
        }
      }, [data, selectedTIN, dateRange]);
        const handleSearch = () => {
            dispatch(
                fetchTaxpayerReport({
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
      <ExcelViewer taxpayerReportData={taxpayerReportData}/>
      </div>

      </Layout>
  )
}

export default TaxpayerReport
