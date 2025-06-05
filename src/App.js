import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import './App.css';

// Import pages
import Login from './pages/Login';
import Analytics from './pages/Analytics';
import ConsolidatedProfile from './pages/ConsolidatedProfile';
import PendingReturns from './pages/PendingReturns';
import FraudDetections from './pages/FraudDetections';
import UploadSheets from './pages/UploadSheets';
import HelpCentre from './pages/HelpCentre';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';
import ResetPassword from './pages/ResetPassword';
import ForcePasswordReset from './pages/ForcePasswordReset';
import RiskAssessment from './pages/RiskAssessment';
import RiskProfiling from './pages/RiskProfiling';
import GST from './pages/GST';
import CIT from './pages/CIT';
import SWT from './pages/SWT';

// Import components
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import UploadHistory from './pages/UploadHistory';
import Compliance from './pages/Compliance';
import RecentUploads from './pages/RecentUploads';
import TaxPayerProfile from './pages/TaxPayerProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route
            path="/force-password-reset"
            element={<ForcePasswordReset />}
          />
          <Route
            path="/gst"
            element={
              <ProtectedRoute>
                <GST />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cit"
            element={
              <ProtectedRoute>
                <CIT />
              </ProtectedRoute>
            }
          />
          <Route
            path="/swt"
            element={
              <ProtectedRoute>
                <SWT />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/gst" replace />} />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/risk-assessment"
            element={
              <ProtectedRoute>
                <RiskAssessment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/risk-profiling"
            element={
              <ProtectedRoute>
                <RiskProfiling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/compliance"
            element={
              <ProtectedRoute>
                <Compliance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recent-uploads"
            element={
              <ProtectedRoute>
                <RecentUploads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tax-payer-profile"
            element={
              <ProtectedRoute>
                <TaxPayerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-sheets"
            element={
              <ProtectedRoute>
                <UploadSheets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload-history"
            element={
              <ProtectedRoute>
                <UploadHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/help-centre"
            element={
              <ProtectedRoute>
                <HelpCentre />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact-us"
            element={
              <ProtectedRoute>
                <ContactUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
