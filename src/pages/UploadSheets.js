import React, { useRef, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Form, Button, Alert, ProgressBar, Spinner } from 'react-bootstrap';
import api from '../services/axios.config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faCalendarAlt,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import UploadSheetTable from '../components/UploadSheetTable';
import Papa from 'papaparse';
import './Dashboard.css';
import UploadSheetTableSubmit from '../components/UploadSheetTableSubmit';

function UploadSheets() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    type: 'gst',
    startDate: null,
    endDate: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [validRecords, setValidRecords] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [auditHistory, setAuditHistory] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch audit history when tax type changes
  useEffect(() => {
    const fetchAuditHistory = async () => {
      try {
        const response = await api.get(
          `/tax/audit-history/latest?tax_type=${formData.type}`
        );
        setAuditHistory(response.data);
      } catch (error) {
        console.error('Error fetching audit history:', error);
        if (error.response?.status === 404) {
          setAuditHistory({
            message: `No ${formData.type} data upload found.`,
          });
        }
      }
    };

    fetchAuditHistory();
  }, [formData.type]);

  // Update useEffect for status polling
  useEffect(() => {
    let timeoutId;

    const pollStatus = async () => {
      if (!jobId) return;

      try {
        const response = await api.get(`/tax/jobs/${jobId}/status`);
        const status = response.data;
        console.log('Status response:', status);
        setJobStatus(status);

        if (status.status === 'finished') {
          setProgress(100);
          // Load initial valid records
          loadValidRecords(jobId);
        } else if (
          status.status === 'processing' ||
          status.status === 'started'
        ) {
          // Set progress based on status
          if (status.status === 'started') {
            setProgress(25);
          } else {
            setProgress(50);
          }
          // Continue polling every 5 seconds
          timeoutId = setTimeout(pollStatus, 5000);
        }
      } catch (error) {
        console.error('Error checking job status:', error);
        setError('Error checking job status');
        // Even on error, continue polling
        timeoutId = setTimeout(pollStatus, 5000);
      }
    };

    if (jobId) {
      console.log('Starting status polling for jobId:', jobId);
      pollStatus();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [jobId]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setError('');
    setSuccess('');

    // Check if file is CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file only');
      return;
    }

    setSelectedFile(file);
  };

  const handlePreview = async (e) => {
    e.preventDefault();
    if (!selectedFile || !formData.startDate || !formData.endDate) return;

    try {
      setError('');
      setSuccess('');

      // Parse CSV file
      Papa.parse(selectedFile, {
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            // Get headers from first row
            const headers = results.data[0];

            // Create columns configuration
            const tableColumns = headers.map((header) => ({
              header: header,
              accessorKey: header,
              size: 150,
              cell: ({ getValue }) => (
                <span
                  style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                  title={getValue() || 'N/A'}
                >
                  {getValue() || 'N/A'}
                </span>
              ),
            }));

            // Create data rows (skip header row)
            const tableData = results.data.slice(1).map((row, index) => {
              const rowData = {};
              headers.forEach((header, i) => {
                rowData[header] = row[i];
              });
              return rowData;
            });

            setPreviewData({
              columns: tableColumns,
              data: tableData,
            });
            setShowPreview(true);
          } else {
            setError('No data found in CSV file');
          }
        },
        error: (error) => {
          console.error('CSV parsing error:', error);
          setError('Error parsing CSV file');
        },
      });
    } catch (error) {
      console.error('Preview error:', error);
      setError('Error previewing file');
    }
  };

  const loadValidRecords = async (jobId, cursor = null) => {
    try {
      setLoadingMore(true);
      const url = cursor
        ? `/tax/jobs/${jobId}/valid-records?cursor=${cursor}&tax_type=${formData.type}`
        : `/tax/jobs/${jobId}/valid-records?tax_type=${formData.type}`;

      console.log('Loading valid records from:', url);
      const response = await api.get(url);
      console.log('Valid records response:', response.data);
      const { results, next_cursor, has_more } = response.data;

      if (cursor) {
        // Append new data to existing data
        setValidRecords((prev) => {
          const newData = [...prev, ...results];
          console.log('Updated records after append:', newData);
          return newData;
        });
      } else {
        // Set initial data
        console.log('Setting initial records:', results);
        setValidRecords(results);
      }
      setNextCursor(next_cursor);
      setHasMore(has_more);
    } catch (error) {
      console.error('Error loading valid records:', error);
      setError('Error loading valid records');
    } finally {
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    console.log('handleLoadMore called', { nextCursor, hasMore, loadingMore });
    if (nextCursor && hasMore && !loadingMore && jobId) {
      console.log('Loading more records with cursor:', nextCursor);
      loadValidRecords(jobId, nextCursor);
    }
  };

  const handleDownloadInvalidRecords = async () => {
    try {
      const response = await api.get(`/tax/jobs/${jobId}/invalid-records`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invalid_records.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invalid records:', error);
      setError('Error downloading invalid records');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !formData.startDate || !formData.endDate) return;

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const formPayload = new FormData();
      formPayload.append('file', selectedFile);
      formPayload.append('tax_type', formData.type);
      formPayload.append(
        'start_date',
        formData.startDate.toLocaleDateString('en-GB')
      );
      formPayload.append(
        'end_date',
        formData.endDate.toLocaleDateString('en-GB')
      );

      const response = await api.post('/tax/upload', formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setJobId(response.data.job_id);
      setSuccess('Your data is in sync transmit.');
      setProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.status === 401) {
        // Let the axios interceptor handle the logout
        return;
      }
      setError(error.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('dragging');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragging');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('dragging');

    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileUpload(file);
  };

  const handleChangeFile = () => {
    fileInputRef.current.click();
  };

  const formatDate = (date) => {
    return date.toLocaleString('default', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (date) => {
    return date.toLocaleString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  return (
    <Layout>
      <h6 className='mb-3'>
        {showPreview
          ? `${formData.type.toUpperCase()} data for ${formatDate(
            formData.startDate
          )} to ${formatDate(formData.endDate)}`
          : ''}
      </h6>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && jobStatus?.status !== 'finished' && (
        <Alert
          variant="warning"
          className="d-flex justify-content-between align-items-center"
        >
          <span style={{ fontSize: '16px' }}>
            Your data sync is in transit
          </span>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Alert>
      )}
      {jobStatus?.status === 'finished' && (
        <Alert variant="success">
          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0">
              {jobStatus.valid_records} data passed validations and{' '}
              {jobStatus.invalid_records} data failed in validation and
              available to download.
            </p>
            {jobStatus.invalid_records > 0 && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleDownloadInvalidRecords}
              >
                <FontAwesomeIcon icon={faDownload} className="me-2" />
                Download Invalid Records
              </Button>
            )}
          </div>
        </Alert>
      )}

      {showPreview ? (
        <>
          {!jobId && (
            <Alert variant="warning" className="preview-alert">
              The following data has been submitted for upload, please
              review and submit.
            </Alert>
          )}

          <div className="preview-info">
            <div className="preview-info-left">
              {auditHistory ? (
                auditHistory.message ===
                  `No ${formData.type} data upload found.` ? (
                  <div className="no-data-message">
                    No {formData.type.toUpperCase()} data has been uploaded
                    yet.
                  </div>
                ) : (
                  auditHistory.message.replace(
                    /gst/i,
                    formData.type.toUpperCase()
                  )
                )
              ) : (
                'Loading audit history...'
              )}
            </div>
            <div className="preview-info-right">
              {auditHistory &&
                auditHistory.message !==
                `No ${formData.type} data upload found.` && (
                  <span className="date-time">
                    <span>
                      Date:{' '}
                      {new Date().toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>
                      Time:{' '}
                      {new Date().toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                      })}
                    </span>
                  </span>
                )}
            </div>
          </div>

          {console.log('Current jobStatus:', jobStatus)}
          {console.log('Current validRecords:', validRecords)}

          {jobStatus?.status === 'finished' && validRecords.length > 0 ? (
            <>
              {console.log('Rendering valid records table')}
              <UploadSheetTableSubmit
                data={validRecords}
                columns={[
                  {
                    header: 'Tin', accessorKey: 'tin', size: 150,
                    cell: ({ getValue }) => (
                      <span
                        style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={getValue() || 'N/A'}
                      >
                        {getValue() || 'N/A'}
                      </span>
                    )
                  },
                  {
                    header: 'Taxpayer Name', accessorKey: 'taxpayer_name', size: 150,
                    cell: ({ getValue }) => (
                      <span
                        style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={getValue() || 'N/A'}
                      >
                        {getValue() || 'N/A'}
                      </span>
                    )
                  },
                  {
                    header: 'Taxpayer Type', accessorKey: 'taxpayer_type', size: 150,
                    cell: ({ getValue }) => (
                      <span
                        style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={getValue() || 'N/A'}
                      >
                        {getValue() || 'N/A'}
                      </span>
                    )
                  },
                  {
                    header: 'Tax Account No',
                    accessorKey: 'tax_account_number', size: 150,
                    cell: ({ getValue }) => (
                      <span
                        style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={getValue() || 'N/A'}
                      >
                        {getValue() || 'N/A'}
                      </span>
                    )
                  },
                  {
                    header: 'Is Fraud', accessorKey: 'is_fraud', size: 150,
                    cell: ({ getValue }) => (
                      <span
                        style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={getValue() || 'N/A'}
                      >
                        {getValue() || 'N/A'}
                      </span>
                    )
                  },
                  {
                    header: 'Fraud Reason', accessorKey: 'fraud_reason', size: 150,
                    cell: ({ getValue }) => (
                      <span
                        style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={getValue() || 'N/A'}
                      >
                        {getValue() || 'N/A'}
                      </span>
                    )
                  },
                ]}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                loadingMore={loadingMore}
                jobId={jobId}
              />
            </>
          ) : (
            previewData && (
              <div className="preview-table-container">
                {console.log('Rendering preview table')}
                <UploadSheetTable
                  data={previewData.data}
                  columns={previewData.columns}
                />
              </div>
            )
          )}

          <div className="preview-actions">
            <Button
              variant="secondary"
              onClick={() => setShowPreview(false)}
              className="me-2"
            >
              Back
            </Button>
            {!jobId && (
              <>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Submit'}
                </Button>
              </>
            )}
          </div>
        </>
      ) : (
        <Form onSubmit={handlePreview}>
          <div className="form-content">
            <div
              className="upload-dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleChangeFile}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept=".csv"
                style={{ display: 'none' }}
              />
              <div className="upload-content">
                {selectedFile ? (
                  <>
                    <p className="upload-text">
                      Selected file: {selectedFile.name}
                    </p>
                    <span
                      className="change-file"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChangeFile();
                      }}
                    >
                      Change file
                    </span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faUpload}
                      className="upload-icon"
                    />
                    <p className="upload-text">
                      Drag and drop your CSV file here, or click to select a
                      file
                    </p>
                    <span className="upload-subtext">
                      Only CSV files are supported
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className='d-flex flex-row gap-4'>
              <div className='w-25'>
                <Form.Label>Select Tax Parameter</Form.Label>
                <Form.Select
                  className='p-2'
                  style={{ borderRadius: "7px" }}
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="gst">GST</option>
                  <option value="cit">CIT</option>
                  <option value="swt">SWT</option>
                </Form.Select>
              </div>
              <div className='w-75'>
                <Form.Label>Assessed Dates</Form.Label>
                <div className="date-range-container">
                  <div className="datepicker-container">
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) =>
                        setFormData({ ...formData, startDate: date })
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="DD/MM/YYYY"
                      maxDate={formData.endDate || new Date()}
                      className="form-control"
                      required
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={10}
                      showMonthDropdown
                      scrollableMonthDropdown
                      renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        years = [],
                        months = [],
                      }) => {
                        // Generate years array if not provided
                        if (!years.length) {
                          const currentYear = new Date().getFullYear();
                          years = Array.from(
                            { length: 20 },
                            (_, i) => currentYear - 10 + i
                          );
                        }

                        // Generate months array if not provided
                        if (!months.length) {
                          months = [
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                          ];
                        }

                        return (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              gap: 8,
                            }}
                          >
                            <select
                              value={date.getFullYear()}
                              onChange={({ target: { value } }) =>
                                changeYear(Number(value))
                              }
                            >
                              {years.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <select
                              value={months[date.getMonth()]}
                              onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                              }
                            >
                              {months.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="calendar-icon"
                    />
                  </div>
                  <div className="date-separator">to</div>
                  <div className="datepicker-container">
                    <DatePicker
                      selected={formData.endDate}
                      onChange={(date) =>
                        setFormData({ ...formData, endDate: date })
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="DD/MM/YYYY"
                      minDate={formData.startDate}
                      maxDate={new Date()}
                      className="form-control"
                      required
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={10}
                      showMonthDropdown
                      scrollableMonthDropdown
                      renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        years = [],
                        months = [],
                      }) => {
                        // Generate years array if not provided
                        if (!years.length) {
                          const currentYear = new Date().getFullYear();
                          years = Array.from(
                            { length: 20 },
                            (_, i) => currentYear - 10 + i
                          );
                        }

                        // Generate months array if not provided
                        if (!months.length) {
                          months = [
                            'January',
                            'February',
                            'March',
                            'April',
                            'May',
                            'June',
                            'July',
                            'August',
                            'September',
                            'October',
                            'November',
                            'December',
                          ];
                        }

                        return (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              gap: 8,
                            }}
                          >
                            <select
                              value={date.getFullYear()}
                              onChange={({ target: { value } }) =>
                                changeYear(Number(value))
                              }
                            >
                              {years.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            <select
                              value={months[date.getMonth()]}
                              onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                              }
                            >
                              {months.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="calendar-icon"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={
                !selectedFile || !formData.startDate || !formData.endDate
              }
              className="submit-button"
            >
              Preview
            </Button>
          </div>
        </Form>
      )}
    </Layout>
  );
}

export default UploadSheets;
