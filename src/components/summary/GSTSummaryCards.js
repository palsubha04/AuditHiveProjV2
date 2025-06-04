// import React, { useState, useEffect } from 'react';
// import { Card} from 'react-bootstrap';
// import gstService from '../../services/gst.service';
// import '../../pages/Dashboard.css';

// const MetricCard = ({ value, label, color }) => (
//   <div style={{ textAlign: 'start', minWidth: 150, paddingLeft: '0.5rem' }}>
//     <div style={{ fontWeight: 700, fontSize: 24, color }}>{value}</div>
//     <div style={{ fontSize: 15, color: '#fff', marginBottom: 4 }}>{label}</div>
//   </div>
// );

// const GSTSummaryCards = ({ startDate, endDate }) => {
//   const [summary, setSummary] = useState(null);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         const response = await gstService.getTaxRecordsSummary(
//           startDate,
//           endDate
//         );
//         setSummary(response);
//       } catch (err) {
//       }
//     };

//     if (startDate && endDate) {
//       fetchSummary();
//     }
//   }, [startDate, endDate]);

//   const formatCurrency = (value) => {
//     if (value >= 1e9) {
//       return 'PGK ' + (value / 1e9).toFixed(2) + 'B';
//     } else if (value >= 1e6) {
//       return 'PGK ' + (value / 1e6).toFixed(2) + 'M';
//     } else if (value >= 1e3) {
//       return 'PGK ' + (value / 1e3).toFixed(2) + 'K';
//     }
//     return 'PGK ' + value;
//   };

//   const formatNumber = (value) => {
//     if (value >= 1e6) {
//       return (value / 1e6).toFixed(1) + 'M';
//     } else if (value >= 1e3) {
//       return (value / 1e3).toFixed(1) + 'K';
//     }
//     return value;
//   };

//   if (!summary) return null;

//   return (
//     <div className='widget-main-div'>
//       <Card className='widget-card' style={{ background: '#5096ff'}}>
//         <MetricCard
//           value={formatNumber(summary.total_tax_payers)}
//           label="Total Tax payers"
//         />
//       </Card>
//       <Card className='widget-card' style={{ background: '#47C99E'}}>
//         <MetricCard
//           value={formatCurrency(summary.total_sales_income)}
//           label="Total Sales Income"
//         />
//       </Card>
//       <Card className='widget-card' style={{ background: '#F96992'}}>
//         <MetricCard
//           value={formatCurrency(summary.total_gst_payable)}
//           label="Total GST Payable"
//         />
//       </Card>
//       <Card className='widget-card' style={{ background: '#FFA56D'}}>
//         <MetricCard
//           value={formatCurrency(summary.total_gst_refundable)}
//           label="Total GST Refundable"
//         />
//       </Card>
//     </div>
//   );
// };

// export default GSTSummaryCards;

import React, { useState, useEffect } from "react";
import { Card, Placeholder } from "react-bootstrap";
import gstService from "../../services/gst.service";
import "../../pages/Dashboard.css"; // Assuming your CSS is here

const MetricCard = ({ value, label, color, isLoading }) => (
  <div style={{ textAlign: "start", minWidth: 150, paddingLeft: "0.5rem" }}>
    {isLoading ? (
      <>
        <Placeholder
          as="div"
          animation="glow"
          style={{ width: "80%", height: 24, marginBottom: 4 }}
        >
          <Placeholder xs={10} />
        </Placeholder>
        <Placeholder
          as="div"
          animation="glow"
          style={{ width: "60%", height: 34 }}
        >
          <Placeholder xs={8} />
        </Placeholder>
      </>
    ) : (
      <>
        <div style={{ fontWeight: 700, fontSize: 24, color }}>{value}</div>
        <div style={{ fontSize: 15, color: "#fff", marginBottom: 4 }}>
          {label}
        </div>
      </>
    )}
  </div>
);

const GSTSummaryCards = ({ startDate, endDate }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const response = await gstService.getTaxRecordsSummary(
          startDate,
          endDate
        );
        setSummary(response);
      } catch (err) {
        console.error("Error fetching GST summary:", err);
        setSummary(null);
      } finally {
        setLoading(false); // Set loading to false here, not true
      }
    };

    if (startDate && endDate) {
      fetchSummary();
    } else {
      setSummary(null);
      setLoading(false);
    }
  }, [startDate, endDate]);

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return "PGK N/A";
    if (value >= 1e9) {
      return "PGK " + (value / 1e9).toFixed(2) + "B";
    } else if (value >= 1e6) {
      return "PGK " + (value / 1e6).toFixed(2) + "M";
    } else if (value >= 1e3) {
      return "PGK " + (value / 1e3).toFixed(2) + "K";
    }
    return "PGK " + value.toLocaleString();
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (value >= 1e6) {
      return (value / 1e6).toFixed(1) + "M";
    } else if (value >= 1e3) {
      return (value / 1e3).toFixed(1) + "K";
    }
    return value.toLocaleString();
  };

  // Render "No data available" message if not loading and no summary data
  if (!loading && !summary && startDate && endDate) {
    return (
      <div className="alert alert-info text-center" role="alert">
        No GST summary data available for the selected period.
      </div>
    );
  }

  return (
    <div className="widget-main-div">
      <Card className="widget-card" style={{ background: "#5096ff" }}>
        <MetricCard
          value={loading ? "" : formatNumber(summary?.total_tax_payers)}
          label="Total Tax payers"
          color="#fff"
          isLoading={loading}
        />
      </Card>
      <Card className="widget-card" style={{ background: "#47C99E" }}>
        <MetricCard
          value={loading ? "" : formatCurrency(summary?.total_sales_income)}
          label="Total Sales Income"
          color="#fff"
          isLoading={loading}
        />
      </Card>
      <Card className="widget-card" style={{ background: "#F96992" }}>
        <MetricCard
          value={loading ? "" : formatCurrency(summary?.total_gst_payable)}
          label="Total GST Payable"
          color="#fff"
          isLoading={loading}
        />
      </Card>
      <Card className="widget-card" style={{ background: "#FFA56D" }}>
        <MetricCard
          value={loading ? "" : formatCurrency(summary?.total_gst_refundable)}
          label="Total GST Refundable"
          color="#fff"
          isLoading={loading}
        />
      </Card>
    </div>
  );
};

export default GSTSummaryCards;