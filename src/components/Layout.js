import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidenav from './Sidenav';
import './Layout.css';
import { useLocation } from 'react-router-dom';

function Layout({ children }) {
  const [isSidenavOpen, setIsSidenavOpen] = useState(true);
  const location = useLocation();
  const toggleSidenav = () => {
    setIsSidenavOpen(!isSidenavOpen);
  };
  let headerTitle;
  let headerSubtitle;
  if (location.pathname === '/compliance') {
    headerTitle = 'Compliance';
    headerSubtitle = '';
  } else if (location.pathname === '/risk-assessment') {
    headerTitle = 'Risk Assessment';
    headerSubtitle = '';
  } else if (location.pathname === '/upload-history') {
    headerTitle = 'Upload History';
    headerSubtitle = '';
  } else if (location.pathname === '/risk-profiling') {
    headerTitle = 'Risk Profiling';
    headerSubtitle = '';
  } else if (location.pathname === '/upload-sheets') {
    headerTitle = 'Upload Sheets';
    headerSubtitle = '';
  } else if (location.pathname === '/recent-uploads') {
    headerTitle = 'Recent Uploads';
    headerSubtitle = '';
  } else if (location.pathname === '/help-centre') {
    headerTitle = 'Help Centre';
    headerSubtitle = '';
  } else if (location.pathname === '/contact-us') {
    headerTitle = 'Contact Us';
    headerSubtitle = '';
  } else if (location.pathname === '/gst') {
    headerTitle = 'GST Dashboard';
    headerSubtitle = '';
  } else if (location.pathname === '/swt') {
    headerTitle = 'SWT Dashboard';
    headerSubtitle = '';
  } else if (location.pathname === '/cit') {
    headerTitle = 'CIT Dashboard';
    headerSubtitle = '';
  }

  return (
    <div className="d-flex flex-column overflow-hidden" style={{ height: '100vh' }}>
      <div className='header-main'>
        <Header />
      </div>
      <div className='flex-1 d-flex flex-row overflow-hidden'>
        <div className='h-100'>
          <Sidenav isOpen={isSidenavOpen} toggleSidenav={toggleSidenav} />
        </div>
        <div className='main-content'>
          <div className='header-title-page'>{headerTitle} {headerSubtitle && <p>{headerSubtitle}</p>}</div>
          <div>{children}</div>
        </div>
      </div>
      {/* <div className="">
        <Sidenav isOpen={isSidenavOpen} toggleSidenav={toggleSidenav}/>
        <main className="">
          {children}
        </main>
        <Footer />
      </div> */}
    </div>
  );
}

export default Layout;
