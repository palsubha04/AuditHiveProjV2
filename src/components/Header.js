import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';
import { Bell, CircleUserIcon, Search } from 'lucide-react';

function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const capitalizeWord = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const getFirstName = () => {
    if (!user) return 'Guest';
    if (user.first_name) return capitalizeWord(user.first_name);
    if (user.username) return capitalizeWord(user.username);
    return capitalizeWord(user.email.split('@')[0]);
  };

  const getFullName = () => {
    if (!user) return 'Guest';
    if (user.first_name && user.last_name) {
      return `${capitalizeWord(user.first_name)} ${capitalizeWord(
        user.last_name
      )}`;
    }
    if (user.username) return capitalizeWord(user.username);
    return user.email;
  };

  // let headerTitle = `Welcome Back, ${getFirstName()}`;
  // let headerSubtitle = 'Here is the information about all your orders';
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
  } else if (location.pathname === '/tax-payer-profile') {
    headerTitle = 'Taxpayer Profile';
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
  } else if (location.pathname === '/taxpayer-report-risk-profiling') {
    headerTitle = 'Taxpayer Report Risk Profiling';
    headerSubtitle = '';
  }

  return (
    <>
      <div className="header-left">
        <div className="header-titles">
          <img src="/header-icons/Logo.svg" alt="Logo" className="logo" />
        </div>
      </div>
      <div className="header-right">
        <button className="icon-button">
          <Bell />
        </button>
        <button className="icon-button">
          <Search />
        </button>
        <Dropdown
          align="end"
          show={isDropdownOpen}
          onToggle={(isOpen) => setIsDropdownOpen(isOpen)}
        >
          <Dropdown.Toggle className="user-dropdown">
            <CircleUserIcon />
            <span style={{ color: '#fff' }}>{getFullName()}</span>
            <FontAwesomeIcon
              icon={isDropdownOpen ? faChevronUp : faChevronDown}
              className="dropdown-arrow"
            />
          </Dropdown.Toggle>
          <Dropdown.Menu className="header-dropdown-item">
            <Dropdown.Item
              onClick={handleLogout}
              className="d-flex gap-2 header-dropdown-item"
            >
              <img
                src="/header-icons/Logout.svg"
                alt="Logout"
                className="logout"
              />
              <span style={{ color: '#5671ff' }}>Logout</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
}

export default Header;
