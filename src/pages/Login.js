import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    <div className="login-page">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="login-box">
          <h1 className="text-center mb-4">
            {isForgotPassword ? 'Forgot Password' : 'Login'}
          </h1>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          {!isForgotPassword ? (
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3 input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faUser} color="#968D8D" size="lg" />
                  </span>
                </div>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3 input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faLock} color="#968D8D" size="lg" />
                  </span>
                </div>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  required
                />
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
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <FontAwesomeIcon icon={faEnvelope} color="#968D8D" size="lg" />
                  </span>
                </div>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
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
      </Container>
    </div>
  );
}

export default Login; 