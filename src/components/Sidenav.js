import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import {
  PanelLeft,
  PanelRight,
  CircleChevronLeft,
  CircleChevronRight,
  SignalMedium,
  ChartNoAxesColumnIncreasing,
  Upload,
  ChartPie,
  FileSpreadsheet,
  Eye,
  Info,
} from 'lucide-react';
import './Sidenav.css';

function Sidenav({ isOpen, toggleSidenav }) {
  const location = useLocation();
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  // Check if any analytics child route is active
  const isAnalyticsChildActive = () => {
    return [
      '/consolidated-profile',
      '/pending-returns',
      '/fraud-detections',
      '/risk-assessment',
      '/risk-profiling',
      '/compliance',
    ].includes(location.pathname);
  };

  const isReportsChildActive = () => {
    return ['/recent-uploads', '/tax-payer-profile'].includes(
      location.pathname
    );
  };

  // Check if any dashboard child route is active
  const isDashboardChildActive = () => {
    return ['/gst', '/cit', '/swt'].includes(location.pathname);
  };

  // Initialize menu states based on current route
  if (isAnalyticsChildActive() && !isAnalyticsOpen && isOpen) {
    setIsAnalyticsOpen(true);
  }
  if (isDashboardChildActive() && !isDashboardOpen && isOpen) {
    setIsDashboardOpen(true);
  }
  if (isReportsChildActive() && !isReportsOpen && isOpen) {
    setIsReportsOpen(true);
  }

  const toggleDashboard = () => {
    if (!isOpen) return;
    setIsDashboardOpen(!isDashboardOpen);
  };

  const toggleAnalytics = () => {
    if (!isOpen) return;
    setIsAnalyticsOpen(!isAnalyticsOpen);
  };

  const toggleReports = () => {
    if (!isOpen) return;
    setIsReportsOpen(!isReportsOpen);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsAnalyticsOpen(false);
      setIsReportsOpen(false);
      setIsDashboardOpen(false);
    }
  }, [isOpen]);

  return (
    <div className={`h-100 sidenav ${isOpen ? 'open' : 'collapsed'}`}>
      <button
        className="sidenav-toggle-btn"
        style={{ paddingLeft: '1rem' }}
        onClick={toggleSidenav}
      >
        {isOpen ? (
          <CircleChevronLeft className="sidenav-toggle-icon" />
        ) : (
          <CircleChevronRight className="sidenav-toggle-icon" />
        )}
      </button>
      <Nav className="flex-column">
        <div className="">
          <Nav.Link onClick={toggleDashboard} className="nav-item">
            {/* <img src="/sidebar-icons/dashboard.svg" alt="Dashboard" className="nav-icon" /> */}
            <ChartNoAxesColumnIncreasing
              className="me-2"
              style={{ color: '#347AE2' }}
            />
            <span className="sidenav-items">Dashboard</span>
            <span className={`arrow ${isDashboardOpen ? 'open' : ''}`}>
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          </Nav.Link>

          <div className={`submenu ${isDashboardOpen ? 'open' : ''}`}>
            <Nav.Link
              as={Link}
              to="/gst"
              active={location.pathname === '/gst'}
              className="nav-item submenu-item"
            >
              <span className="sidenav-items">GST</span>
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/swt"
              active={location.pathname === '/swt'}
              className="nav-item submenu-item"
            >
              <span className="sidenav-items">SWT</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cit"
              active={location.pathname === '/cit'}
              className="nav-item submenu-item"
            >
              <span className="sidenav-items">CIT</span>
            </Nav.Link>
          </div>
        </div>

        <Nav.Link
          as={Link}
          to="/upload-sheets"
          active={location.pathname === '/upload-sheets'}
          className="nav-item"
        >
          {/* <img src="/sidebar-icons/upload.svg" alt="Upload" className="nav-icon" /> */}
          <Upload className="me-2" style={{ color: '#347AE2' }} />
          <span className="sidenav-items">Upload Sheets</span>
        </Nav.Link>

        <div className="">
          <Nav.Link onClick={toggleAnalytics} className="nav-item">
            {/* <img src="/sidebar-icons/analytics.svg" alt="Analytics" className="nav-icon" /> */}
            <ChartPie className="me-2" style={{ color: '#347AE2' }} />
            <span className="sidenav-items">Analytics</span>
            <span className={`arrow ${isAnalyticsOpen ? 'open' : ''}`}>
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          </Nav.Link>

          <div className={`submenu ${isAnalyticsOpen ? 'open' : ''}`}>
            <Nav.Link
              as={Link}
              to="/risk-assessment"
              active={location.pathname === '/risk-assessment'}
              className="nav-item submenu-item"
            >
              <span className="sidenav-items">Risk Assessment</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/risk-profiling"
              active={location.pathname === '/risk-profiling'}
              className="nav-item submenu-item"
            >
              <span className="sidenav-items">Risk Profilling</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/compliance"
              active={location.pathname === '/compliance'}
              className="nav-item submenu-item"
            >
              <span className="sidenav-items">Compliance</span>
            </Nav.Link>
          </div>
        </div>

        <div className="">
          <Nav.Link onClick={toggleReports} className="nav-item">
            {/* <img src="/sidebar-icons/reports.svg" alt="Reports" className="nav-icon" /> */}
            <FileSpreadsheet className="me-2" style={{ color: '#347AE2' }} />
            <span className="sidenav-items">Reports</span>
            <span className={`arrow ${isReportsOpen ? 'open' : ''}`}>
              <FontAwesomeIcon icon={faChevronDown} />
            </span>
          </Nav.Link>

          <div className={`submenu ${isReportsOpen ? 'open' : ''}`}>
            <Nav.Link
              as={Link}
              to="/recent-uploads"
              active={location.pathname === '/recent-uploads'}
              className="nav-item submenu-item"
            >
              <span className="sidenav-items">Recent Uploads</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/tax-payer-profile"
              active={location.pathname === '/tax-payer-profile'}
              className="nav-item submenu-item"
            >
              <span className="sidenav-items">Tax Payer Profile</span>
            </Nav.Link>
          </div>
        </div>

        <Nav.Link
          as={Link}
          to="/upload-history"
          active={location.pathname === '/upload-history'}
          className="nav-item"
        >
          {/* <img src="/sidebar-icons/history.svg" alt="Help" className="nav-icon" /> */}
          <Eye className="me-2" style={{ color: '#347AE2' }} />
          <span className="sidenav-items">Upload History</span>
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/help-centre"
          active={location.pathname === '/help-centre'}
          className="nav-item"
        >
          {/* <img src="/sidebar-icons/help.svg" alt="Help" className="nav-icon" /> */}
          <Info className="me-2" style={{ color: '#347AE2' }} />
          <span className="sidenav-items">Help Centre</span>
        </Nav.Link>

        {/* <Nav.Link
          as={Link}
          to="/contact-us"
          active={location.pathname === '/contact-us'}
          className="nav-item"
        >
          <img src="/chat.svg" alt="Contact" className="nav-icon" />
          <span className='sidenav-items'>Contact us</span>
        </Nav.Link> */}
      </Nav>
    </div>
  );
}

export default Sidenav;
