import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';

import {
  faUser,
  faLock,
  faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import './Login.css';
import { fetchDatasets } from '../slice/datasetsSlice';
import { useDispatch } from 'react-redux';

function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Check for message in location state (from password reset)
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({
        email,
        password
      });

      // Check if password needs to be reset
      if (response.password_needs_reset) {
        // Redirect to force password reset page
        navigate(`/force-password-reset?token=${response.reset_token}`);
        return;
      }

      // Store tokens and user data
      if (response.access_token && response.refresh_token && response.user) {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Update auth context with user data
        login(response.user);

        dispatch(fetchDatasets());

        navigate('/gst', { replace: true });
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.forgotPassword({ email });
      alert('Password reset instructions have been sent to your email');
      setIsForgotPassword(false);
    } catch (err) {
      // Handle the specific error format from the API
      if (err.response?.data?.email?.[0]) {
        setError(err.response.data.email[0]);
      } else {
        setError('Error sending reset instructions. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url('/login/LoginBackground.svg')` }}>
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="login-box">
          <div className="text-center mb-4" style={{ color: '#4F545B', fontFamily: 'Poppins', fontWeight: '600', fontSize: '30px', lineHeight: '100%', letterSpacing: '0px', textAlign: 'center', }}>
            {isForgotPassword ? 'Forgot Password' : 'Login'}
          </div>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          {!isForgotPassword ? (
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3 input-group d-flex flex-column">
                <Form.Label style={{ color: '#666666', fontSize: '16px' }}>Username</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input-login w-100"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3 input-group position-relative">
                <Form.Label style={{ color: '#666666', fontSize: '16px' }}>Password</Form.Label>
                <div className="position-relative w-100">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input-login w-100 pe-5"
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      right: '10px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#666',
                    }}
                  >
                    {showPassword ? <EyeOff style={{color: "#999999"}} size={18} /> : <Eye style={{color: "#999999"}} size={18} />}
                  </span>
                </div>
              </Form.Group>

              <div className="text-end mb-3">
                <a
                  href="#"
                  className="forgot-password"
                  onClick={(e) => {
                    e.preventDefault();
                    setError('');
                    setIsForgotPassword(true);
                  }}
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-100 login-button"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login Now'}
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleForgotPassword}>
              <Form.Group className="mb-3 input-group">
                <Form.Label style={{ color: '#666666' }}>Enter email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input-login w-100"
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <a
                  href="#"
                  className="back-to-login"
                  onClick={(e) => {
                    e.preventDefault();
                    setError('');
                    setIsForgotPassword(false);
                  }}
                >
                  Back to Login
                </a>
              </div>

              <Button
                type="submit"
                className="w-100 login-button"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </Button>
            </Form>
          )}
        </div>
      </Container >
    </div >
  );
}

export default Login; 