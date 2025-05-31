import React, { useEffect, useState } from 'react';
import Table from '../../Table';
import CSVExportButton from '../../CSVExportButton';
import { CardBody, CardHeader } from 'react-bootstrap';
import './TopFruadRulesProfiling.css';
const monthMap = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

const TopFraudRulesProfiling = ({
  topFraudRulesProfilingData,
  handleTopFraudFilterChange,
  selectedTaxType,
  selectedSegmentation,
}) => {
  const [records, setRecords] = useState([]);
  useEffect(() => {
    const updatedData =
      topFraudRulesProfilingData?.records?.map((item) => ({
        ...item,
        tax_period_month:
          monthMap[item.tax_period_month] || item.tax_period_month,
      })) || [];

    setRecords(updatedData);
  }, [topFraudRulesProfilingData]);

  const [filteredData, setFilteredData] = useState(
    topFraudRulesProfilingData && topFraudRulesProfilingData['records']
      ? topFraudRulesProfilingData['records']
      : []
  );

  const taxTypes = ['gst', 'swt', 'cit'];
  const segmentations = ['large', 'medium', 'small', 'micro'];

  const columns = [
    {
      accessorKey: 'tin',
      header: 'TIN',
    },
    {
      accessorKey: 'taxpayer_name',
      header: 'Taxpayer Name',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
      accessorKey: 'tax_period_year',
      header: 'Tax Period Year',
    },
    {
      accessorKey: 'tax_period_month',
      header: 'Tax Period Month',
    },
    {
      accessorKey: 'segmentation',
      header: 'Segmentation',
    },
    {
      accessorKey: 'fraud_reason',
      header: 'Fraud Reason',
      cell: ({ getValue }) => (
        <span
          style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={getValue() || 'N/A'}
        >
          {getValue() || 'N/A'}
        </span>
      ),
    },
  ];

  return (
    <div className="d-flex h-100 flex-column">
      <CardHeader className="table-card-header">
        <div className="d-flex">
          <span className="chart-headers">
            Top 10 fraud companies (Tax and Segment wise)
          </span>

          <div>
            <select
              className="chart-filter"
              value={selectedTaxType}
              onChange={(e) => {
                const newCategory = e.target.value;
                //setSelectedTaxType(newCategory);
                handleTopFraudFilterChange(
                  e.target.value,
                  selectedSegmentation
                );
              }}
            >
              {taxTypes &&
                taxTypes.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.toUpperCase()}
                  </option>
                ))}
            </select>
            <span
              className="mx-2"
              style={{ color: '#7c879d', fontSize: '16px' }}
            >
              and
            </span>
            <select
              className="chart-filter"
              value={selectedSegmentation}
              onChange={(e) => {
                //setSelectedSegmentation(e.target.value);
                handleTopFraudFilterChange(selectedTaxType, e.target.value);
              }}
            >
              {segmentations.map((ind) => (
                <option key={ind} value={ind}>
                  {ind.charAt(0).toUpperCase() +
                    ind.slice(1).replaceAll('_', ' ')}
                </option>
              ))}
            </select>
            <span
              style={{ color: '#7c879d', fontSize: '16px', marginLeft: '5px' }}
            >
              {' '}
              (Segmentation){' '}
            </span>
          </div>
        </div>
        <CSVExportButton
          records={records}
          filename="top_10_fraud.csv"
          buttonLabel="Download Top 10 Fraud List"
        />
      </CardHeader>
      <CardBody>
        {filteredData && filteredData.length > 0 ? (
          <Table
            columns={columns}
            data={filteredData}
            //jobId={"test"}
            // loading={loading}
            // error={error}
            // hasMore={records.length < totalRecords}
            // onLoadMore={handleLoadMore}
            // loadingMore={isLoadingMore}
          />
        ) : (
          <div className="text-center text-muted" style={{ padding: '2rem' }}>
            No Data Found
          </div>
        )}
      </CardBody>
    </div>
  );
};

export default TopFraudRulesProfiling;
