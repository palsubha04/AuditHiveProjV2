import React, { useState } from 'react';
import { Table, Badge, Dropdown, DropdownButton } from 'react-bootstrap';

function TaxPayersGrid({ data }) {
  const [sortBy, setSortBy] = useState('taxpayer_name'); // Default sort by taxpayer_name
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState('GST'); // Default filter to GST

  const taxPayersData = data ? data : {};

  // Use props.data if available and structured correctly, otherwise use example data
  const sourceData =
    data && typeof data === 'object' && data.GST && data.SWT && data.CIT
      ? data
      : taxPayersData;

  const fraudStatusVariant = {
    true: { bg: 'danger', text: 'Fraud' },
    false: { bg: 'success', text: 'Valid' },
  };

  const getSortIcon = (column, currentSortBy, currentSortOrder) => {
    if (currentSortBy !== column)
      return <span style={{ fontSize: '0.8em' }}>⇅</span>;
    return currentSortOrder === 'asc' ? (
      <span style={{ fontSize: '0.8em' }}>↑</span>
    ) : (
      <span style={{ fontSize: '0.8em' }}>↓</span>
    );
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleFilterSelect = (eventKey) => {
    setFilterType(eventKey);
    setSortBy('taxpayer_name'); // Reset sort when filter changes, or keep current
    setSortOrder('asc');
  };

  const filterOptions = ['GST', 'CIT', 'SWT'];

  // Get the current list based on filterType, add a display_no for row numbering
  const currentListData = (sourceData[filterType] || []).map((item, index) => ({
    ...item,
    display_no: index + 1,
  }));

  const sortedData = [...currentListData].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'tin' || sortBy === 'display_no') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else if (sortBy === 'is_fraud') {
      aValue = aValue ? 1 : 0;
      bValue = bValue ? 1 : 0;
    } else if (sortBy === 'fraud_percentage') {
      aValue = aValue === null ? -Infinity : aValue; // Sort nulls to the beginning or end
      bValue = bValue === null ? -Infinity : bValue;
    } else if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Show "No Data Available" if there are no rows to display
  if (!sortedData || sortedData.length === 0) {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div className="d-flex align-items-center">
            <h4 className="mb-0 me-3 fw-bold" style={{ color: '#6366F1' }}>
              Tax Payers Details
            </h4>
            <DropdownButton
              id="dropdown-filter-button"
              title={filterType}
              variant="light"
              size="sm"
              onSelect={handleFilterSelect}
            >
              {filterOptions.map((type) => (
                <Dropdown.Item key={type} eventKey={type}>
                  {type}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </div>
        </div>
        <div className="text-center p-5">
          <h4>No Data Available</h4>
          <p>There are no records matching the current filter.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div className="d-flex align-items-center">
          <h4 className="mb-0 me-3 fw-bold" style={{ color: '#6366F1' }}>
            Tax Payers Details
          </h4>
          <DropdownButton
            id="dropdown-filter-button"
            title={filterType} // Show current filter type
            variant="light"
            size="sm"
            onSelect={handleFilterSelect}
          >
            {filterOptions.map((type) => (
              <Dropdown.Item key={type} eventKey={type}>
                {type}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        </div>
      </div>
      <Table hover responsive className="align-middle">
        <thead>
          <tr>
            <th>TIN</th>
            <th>Taxpayer Name</th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('segmentation')}
            >
              Segmentation {getSortIcon('segmentation', sortBy, sortOrder)}
            </th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('taxpayer_type')}
            >
              Taxpayer Type {getSortIcon('taxpayer_type', sortBy, sortOrder)}
            </th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('is_fraud')}
            >
              Is Fruad {getSortIcon('is_fraud', sortBy, sortOrder)}
            </th>

            <th
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('fraud_percentage')}
            >
              Fraud % {getSortIcon('fraud_percentage', sortBy, sortOrder)}
            </th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('risk_type')}
            >
              Risk Type {getSortIcon('risk_type', sortBy, sortOrder)}
            </th>
            <th
              style={{ cursor: 'pointer' }}
              onClick={() => handleSort('fraud_reason')}
            >
              Fraud Reason {getSortIcon('fraud_reason', sortBy, sortOrder)}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map(
            (
              row,
              index // Added index for key
            ) => (
              <tr key={`${filterType}-${row.tin}-${index}`}>
                <td>{row.tin}</td>
                <td>{row.taxpayer_name}</td>
                <td>{row.segmentation}</td>
                <td>{row.taxpayer_type || 'N/A'}</td>
                <td>
                  <Badge bg={fraudStatusVariant[row.is_fraud].bg}>
                    {fraudStatusVariant[row.is_fraud].text}
                  </Badge>
                </td>
                <td>
                  {row.fraud_percentage !== null
                    ? `${row.fraud_percentage}%`
                    : 'N/A'}
                </td>
                <td>{row.risk_type || 'N/A'}</td>
                <td style={{ whiteSpace: 'pre-wrap' }}>
                  {row.fraud_reason || 'N/A'}
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
    </>
  );
}

export default TaxPayersGrid;
