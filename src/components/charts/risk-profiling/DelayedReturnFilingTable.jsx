import React, { useEffect, useState } from 'react';
import Table from '../../Table';
import { Badge } from 'react-bootstrap';
import CSVExportButton from '../../CSVExportButton';
import { CardBody, CardHeader } from 'react-bootstrap';
import './TopFruadRulesProfiling.css';

const DelayedReturnFilingTable = ({ delayedFilingData }) => {
  const [selectedCategory, setSelectedCategory] = useState('gst');
  const [filteredData, setFilteredData] = useState([]);
  const categories = ['gst', 'swt', 'cit'];

  useEffect(() => {
    if (delayedFilingData && selectedCategory) {
      const filingDate = delayedFilingData[selectedCategory]
        ? Object.values(delayedFilingData[selectedCategory])
        : [];
      setFilteredData(filingDate);
    }
  }, [delayedFilingData, selectedCategory]);

  const columns = [
    {
      accessorKey: 'due_date',
      header: 'Due Date',
    },
    {
      accessorKey: 'entry_date',
      header: 'Entry Date',
    },
    {
      accessorKey: 'receive_date',
      header: 'Receive Date',
    },
    {
      accessorKey: 'is_delayed',
      header: 'Is Delayed',
      cell: ({ getValue }) => (
        <Badge bg={getValue() ? 'danger' : 'success'}>
          {getValue() ? 'Delayed' : 'On Time'}
        </Badge>
      ),
    },
  ];
  return (
    <div className="d-flex h-100 flex-column">
      <CardHeader className="table-card-header mb-0">
        <div className="d-flex">
          <span className="chart-headers">Delayed Return Filings</span>
          <div>
            <select
              className="chart-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        <CSVExportButton
          records={filteredData}
          filename="DelayedReturnFilings.csv"
          buttonLabel="Download Delayed Return Filings List"
        />
      </CardHeader>
      <CardBody>
        <Table columns={columns} data={filteredData} />
      </CardBody>
    </div>
  );
};

export default DelayedReturnFilingTable;
