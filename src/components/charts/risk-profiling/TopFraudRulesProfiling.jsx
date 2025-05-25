import { Tally1 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Table from '../../Table';
import { Badge } from 'react-bootstrap';
import CSVExportButton from '../../CSVExportButton';

const TopFraudRulesProfiling = ({
  topFraudRulesProfilingData,
  handleTopFraudFilterChange,
  selectedTaxType,
  selectedSegmentation,
}) => {
  // const [selectedTaxType, setSelectedTaxType] = useState("gst");
  // const [selectedSegmentation, setSelectedSegmentation] = useState("");
  const [filteredData, setFilteredData] = useState(
    topFraudRulesProfilingData && topFraudRulesProfilingData['records']
      ? topFraudRulesProfilingData['records']
      : []
  );

  const taxTypes = ['gst', 'swt', 'cit'];
  const segmentations = ['large', 'medium', 'low', 'micro'];

  // useEffect(() => {
  //   if (selectedTaxType && selectedSegmentation) {
  //     handleTopFraudFilterChange(selectedTaxType, selectedSegmentation);
  //   }
  // }, [selectedTaxType, selectedSegmentation]);

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
      accessorKey: 'segmentation',
      header: 'Segmentation',
    },
    {
      accessorKey: 'is_fraud',
      header: 'Is Fraud',
      cell: ({ getValue }) => (
        <Badge bg={getValue() ? 'danger' : 'success'}>
          {getValue() ? 'Fraud' : 'Valid'}
        </Badge>
      ),
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
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, justifyContent: "space-between" }}>
        <div className='d-flex'>
        <span className='chart-headers'>Top 10 fraud companies (Tax and Segment wise)</span>
        
        <div>
          <select
            className='chart-filter'
            value={selectedTaxType}
            onChange={(e) => {
              const newCategory = e.target.value;
              //setSelectedTaxType(newCategory);
              handleTopFraudFilterChange(e.target.value, selectedSegmentation);
            }}
          >
            {taxTypes &&
              taxTypes.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
          </select>
          <span className='mx-2' style={{ color: '#7c879d', fontSize: '16px'}}>and</span>
          <select
            className='chart-filter'
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
          records={filteredData}
          filename="top_10_fraud.csv"
          buttonLabel="Download Top 10 Fraud List"
        />
      </div>
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
    </div>
  );
};

export default TopFraudRulesProfiling;
