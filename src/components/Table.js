import React, {
  useRef,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import api from "../services/axios.config";
import "./Table.css";
//import "bootstrap/dist/css/bootstrap.min.css";

// Download icon component
const DownloadIcon = () => (
  <svg
    className="download-icon"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

function Table({
  data = [],
  columns = [],
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  jobId = null,
}) {
  const tableContainerRef = useRef(null);
  const [isFraudFilter, setIsFraudFilter] = useState("all");

  // Memoize the filtered data
  const filteredData = useMemo(() => {
    if (isFraudFilter === "all") return data;

    return data.filter((row) => {
      const isFraud = String(row.is_fraud).toLowerCase();
      return isFraud === isFraudFilter;
    });
  }, [data, isFraudFilter]);

  const downloadFraudRecords = useCallback(async () => {
    if (!jobId) {
      console.error("No job ID available for download");
      alert("Job ID is not available. Please try again later.");
      return;
    }

    try {
      console.log("Downloading fraud records for job:", jobId);
      const response = await api.get(`/tax/jobs/${jobId}/fraud-records`, {
        responseType: "blob",
      });

      const filename =
        response.headers["content-disposition"]?.split("filename=")[1] ||
        "fraud-records.csv";

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading fraud records:", error);
      alert("Failed to download fraud records. Please try again.");
    }
  }, [jobId]);

  const exportToCSV = () => {
    console.log("received records", data);
    if (!data || data.length === 0) return;

    const records = data.filter((item) => item.is_fraud === true);
    const headers = Object.keys(records[0]);
    const csvRows = [
      headers.join(","), // header row
      ...records.map((record) =>
        headers
          .map((header) => {
            const cell = record[header];
            if (cell == null) return ""; // handle null/undefined
            const escaped = String(cell).replace(/"/g, '""'); // escape quotes
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Records");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFilterChange = useCallback((e, column) => {
    e.stopPropagation();
    const value = e.target.value;
    setIsFraudFilter(value);
  }, []);

  const processedColumns = useMemo(
    () =>
      columns.map((col) => ({
        ...col,
        size: "100%",
        header:
        col.accessorKey === 'is_fraud' && jobId
          ? ({ column }) => (
              <div className="filter-controls">
                <select
                  value={isFraudFilter}
                  onChange={(e) => handleFilterChange(e, column)}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="all">All</option>
                  <option value="true">Fraud</option>
                  <option value="false">Valid</option>
                </select>
                {isFraudFilter === 'true' && (
                  <button
                    className="download-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportToCSV();
                    }}
                    disabled={!jobId}
                    title={!jobId ? 'Job ID not available' : 'Download fraud records'}
                  >
                    <DownloadIcon />
                  </button>
                )}
              </div>
            )
          : col.header,
      })),
    [columns, isFraudFilter, handleFilterChange, downloadFraudRecords, jobId]
  );

  const table = useReactTable({
    data: filteredData,
    columns: processedColumns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: false, // Disable debug mode
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 54,
    getScrollElement: () => tableContainerRef.current,
    overscan: 5,
  });

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
      if (containerRefElement && hasMore && !loadingMore) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        if (scrollHeight - scrollTop - clientHeight < 300) {
          onLoadMore();
        }
      }
    },
    [hasMore, loadingMore, onLoadMore]
  );

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <div
      ref={tableContainerRef}
      className="table-container"
      style={{ height: "600px", overflowY: "auto" }}
      onScroll={(e) => fetchMoreOnBottomReached(e.target)}
    >
      <table
        className="table table-bordered table-hover table-striped"
        style={{
          width: "100%",
          tableLayout: "fixed",
          borderCollapse: "collapse",
        }}
      >
        <thead
          style={{
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 1,
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  style={{
                    padding: "12px 20px",
                    textAlign: "center",
                    verticalAlign: "middle",
                    backgroundColor: "white",
                    border: "1px solid #dee2e6",
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {/* Top padding row */}
          <tr
            style={{
              height: `${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px`,
            }}
          />

          {/* Render visible virtual rows */}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <tr key={row.id} style={{ height: `${virtualRow.size}px` }}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    title={cell.getValue()}
                    style={{
                      padding: "12px 20px",
                      textAlign: "center",
                      verticalAlign: "middle",
                      border: "1px solid #dee2e6",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}

          {/* Bottom padding row */}
          <tr
            style={{
              height: `${
                rowVirtualizer.getTotalSize() -
                (rowVirtualizer.getVirtualItems()[0]?.start ?? 0) -
                rowVirtualizer
                  .getVirtualItems()
                  .reduce((sum, v) => sum + v.size, 0)
              }px`,
            }}
          />
        </tbody>
      </table>

      {loadingMore && (
        <div className="text-center py-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading more data...</span>
          </div>
        </div>
      )}
    </div>
  );

  // return (
  //   <div
  //     ref={tableContainerRef}
  //     className="table-container"
  //     style={{ height: '600px', overflowY: 'auto' }}
  //     onScroll={(e) => fetchMoreOnBottomReached(e.target)}
  //   >
  //     <table
  //       style={{
  //         width: '100%',
  //         tableLayout: 'fixed',
  //         borderCollapse: 'collapse',
  //       }}
  //     >
  //       <thead
  //         style={{
  //           position: 'sticky',
  //           top: 0,
  //           backgroundColor: 'white',
  //           zIndex: 1,
  //         }}
  //       >
  //         {table.getHeaderGroups().map((headerGroup) => (
  //           <tr key={headerGroup.id}>
  //             {headerGroup.headers.map((header) => (
  //               <th
  //                 key={header.id}
  //                 style={{
  //                   padding: '12px 20px',
  //                   borderBottom: '2px solid #eee',
  //                   textAlign: 'center',
  //                   // width: '200px', // Ensure this line is removed or commented out
  //                 }}
  //               >
  //                 {flexRender(
  //                   header.column.columnDef.header,
  //                   header.getContext()
  //                 )}
  //               </th>
  //             ))}
  //           </tr>
  //         ))}
  //       </thead>
  //       <tbody>
  //         <tr
  //           style={{
  //             height: `${rowVirtualizer.getVirtualItems()[0]?.start ?? 0}px`,
  //           }}
  //         />
  //         {rowVirtualizer.getVirtualItems().map((virtualRow) => {
  //           const row = rows[virtualRow.index];
  //           return (
  //             <tr
  //               key={row.id}
  //               ref={rowVirtualizer.measureElement}
  //               style={{ height: '54px' }} // You may adjust based on actual row height
  //             >
  //               {row.getVisibleCells().map((cell) => (
  //                 <td
  //                   key={cell.id}
  //                   title={cell.getValue()}
  //                   className="table-td"
  //                   style={{
  //                     padding: '0 30px',
  //                     // width: '200px', // Ensure this line is removed or commented out
  //                   }}
  //                 >
  //                   {flexRender(cell.column.columnDef.cell, cell.getContext())}
  //                 </td>
  //               ))}
  //             </tr>
  //           );
  //         })}
  //         <tr
  //           style={{
  //             height: `${
  //               rowVirtualizer.getTotalSize() -
  //               (rowVirtualizer.getVirtualItems()[0]?.start ?? 0) -
  //               rowVirtualizer.getVirtualItems().length * 35
  //             }px`,
  //           }}
  //         />
  //       </tbody>
  //     </table>
  //     {loadingMore && <div className="loading-more">Loading more data...</div>}
  //   </div>
  // );
}

export default React.memo(Table);