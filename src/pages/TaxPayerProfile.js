import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaxPayerProfile } from '../slice/reports/taxPayerProfileSlice';
import Layout from '../components/Layout';
import Table from '../components/Table';
import api from '../services/axios.config';
import { Button, Placeholder } from 'react-bootstrap';
import { Download, Funnel } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Reports.css'; // Make sure to create this CSS file
import { resetTaxPayerProfile } from '../slice/reports/taxPayerProfileSlice';

const RecentUploads = () => {
  const [selectedCategory, setSelectedCategory] = useState('gst');
  const [startDate, setStartDate] = useState(''); // Added for start date
  const [endDate, setEndDate] = useState(''); // Added for end date
  const [error, setError] = useState('');
  if (error) {
    console.log(error);
  }

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  const dispatch = useDispatch();
  const {
    taxPayerProfileData,
    taxPayerProfileLoading,
    taxPayerProfileError,
    cursor,
    results,
    hasMore,
  } = useSelector((state) => state?.taxPayerProfile);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isInitialOrSearchLoad, setIsInitialOrSearchLoad] = useState(true);

  useEffect(() => {
    dispatch(resetTaxPayerProfile());
  }, [dispatch]);

  const handleLoadMore = async () => {
    if (cursor && !taxPayerProfileLoading && !isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setIsInitialOrSearchLoad(false);
      try {
        await dispatch(
          fetchTaxPayerProfile({
            tax_type: selectedCategory,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            cursor,
          })
        ).unwrap();
      } catch (e) {}
      setIsLoadingMore(false);
    }
  };

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.offsetHeight &&
        !taxPayerProfileLoading &&
        hasMore
      ) {
        dispatch(
          fetchTaxPayerProfile({
            tax_type: selectedCategory,
            start_date: formatDate(startDate),
            end_date: formatDate(endDate),
            cursor,
          })
        );
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [taxPayerProfileLoading, hasMore, cursor, selectedCategory, dispatch]);

  // Handler to export table data to Excel
  const handleDownload = async () => {
    try {
      const response = await api.get(
        `reports/generate-fraud-records?tax_type=${selectedCategory}&start_date=${formatDate(
          startDate
        )}&end_date=${formatDate(endDate)}&export_format=csv`,
        {
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Tax_Payer_Profile_Data.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Error downloading Tax Payer Profile records');
    }
  };

  const columns = [
    {
      accessorKey: 'tin',
      header: 'Tin',
    },
    {
      accessorKey: 'taxpayer_name',
      header: 'Taxpayer Name',
    },
    {
      accessorKey: 'tax_period_month',
      header: 'Tax Period Month',
    },
    {
      accessorKey: 'tax_period_year',
      header: 'Tax Period Year',
    },
    {
      accessorKey: 'segmentation',
      header: 'Segmentation',
    },
    {
      accessorKey: 'is_fraud',
      header: 'Is Fraud',
    },
    {
      accessorKey: 'fraud_reason',
      header: 'Fraud Reason',
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span
            style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={
              typeof value === 'string'
                ? value
                : value
                ? value.toString()
                : undefined
            }
          >
            {value || 'N/A'}
          </span>
        );
      },
    },
  ];

  const handleSearch = () => {
    if (selectedCategory && startDate && endDate) {
      setIsInitialOrSearchLoad(true);
      dispatch(
        fetchTaxPayerProfile({
          tax_type: selectedCategory,
          start_date: formatDate(startDate), // Use state variable
          end_date: formatDate(endDate), // Use state variable
        })
      );
    }
  };

  const showSkeleton =
    isInitialOrSearchLoad && taxPayerProfileLoading ;
  return (
    <Layout>
      <div className="selection-container">
        <div className="d-flex" style={{ gap: "1rem", alignItems: "center" }}>
          <span>
            <Funnel style={{ color: "#3470E2" }} />
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="chart-filter2"
          >
            <option value="gst">GST</option>
            <option value="swt">SWT</option>
            <option value="cit">CIT</option>
          </select>
        </div>

        <div className="d-flex" style={{ gap: "1rem", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label htmlFor="start-date" style={{ whiteSpace: "nowrap" }}>
              Start Date
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate} // Bind value to state
              onChange={(e) => setStartDate(e.target.value)} // Update state on change
              className="date-conatiner"
              placeholderText="Select"
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label htmlFor="end-date" style={{ whiteSpace: "nowrap" }}>
              End Date
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate} // Bind value to state
              onChange={(e) => setEndDate(e.target.value)} // Update state on change
              className="date-conatiner"
              placeholderText="Select"
            />
          </div>
          <div className="search-container">
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>
        </div>

        <Button
          variant="outline-primary"
          size="sm"
          onClick={handleDownload}
          className="download"
          style={{
            color: "#347AE2",
            borderColor: "#347AE2",
            marginLeft: "1rem",
          }} // Added marginLeft for spacing
        >
          <Download
            size={16}
            style={{ marginRight: 6, marginBottom: 2, color: "#347AE2" }}
          />
          Download Sheet
        </Button>
      </div>

      {showSkeleton ? (
        <>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
            <Placeholder
              xs={12}
              style={{
                height: "100%",
                borderRadius: "0.25rem",
                backgroundColor: "#d5e6ff",
              }}
            />
          </Placeholder>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
            <Placeholder
              xs={12}
              style={{
                height: "100%",
                borderRadius: "0.25rem",
                backgroundColor: "#d5e6ff",
              }}
            />
          </Placeholder>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
            <Placeholder
              xs={12}
              style={{
                height: "100%",
                borderRadius: "0.25rem",
                backgroundColor: "#d5e6ff",
              }}
            />
          </Placeholder>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
            <Placeholder
              xs={12}
              style={{
                height: "100%",
                borderRadius: "0.25rem",
                backgroundColor: "#d5e6ff",
              }}
            />
          </Placeholder>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
            <Placeholder
              xs={12}
              style={{
                height: "100%",
                borderRadius: "0.25rem",
                backgroundColor: "#d5e6ff",
              }}
            />
          </Placeholder>
          <Placeholder
            as="div"
            animation="glow"
            style={{ height: 100 }}
            className="mb-1"
          >
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
        </>
      ) : (
        <>
          <Table
            columns={columns}
            data={results}
            jobId={"test"}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            loadingMore={isLoadingMore}
          />
          {taxPayerProfileLoading && results.length === 0 && (
            <div style={{ textAlign: "center" }}>Loading...</div>
          )}
          {!hasMore && results.length > 0 && (
            <div style={{ textAlign: "center" }}>No more data.</div>
          )}
        </>
      )}
    </Layout>
  );
};

export default RecentUploads;
