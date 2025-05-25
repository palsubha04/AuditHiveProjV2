import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import api from '../services/axios.config';
import './Login.css';

function ForcePasswordReset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    // Validate token on component mount
    const validateToken = async () => {
      try {
        await api.get(`/validate-reset-token/${token}`);
      } catch (error) {
        setTokenValid(false);
        setError('Invalid or expired token. Please request a new password reset link.');
      }
    };

    if (token) {
      validateToken();
    } else {
      setTokenValid(false);
      setError('No reset token provided.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await api.post('/reset-password', {
        token,
        password
      });

      // Show success message and redirect to login
      setError('');
      navigate('/login', { 
        state: { 
          message: 'Password has been reset successfully. Please login with your new password.' 
        }
      });
    } catch (error) {
      console.error('Password reset error:', error);
      setError(error.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <Container className="login-container">
        <div className="login-box">
          <h2>Password Reset</h2>
          <Alert variant="danger">{error}</Alert>
          <Button 
            variant="primary" 
            className="w-100 mt-3"
            onClick={() => navigate('/login')}
          >
            Return to Login
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="login-container">
      <div className="login-box">
        <h2>Set New Password</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label>New Password</Form.Label>
            <div className="input-group">
              <span className="input-icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Confirm Password</Form.Label>
            <div className="input-group">
              <span className="input-icon">
                <FontAwesomeIcon icon={faLock} />
              </span>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100"
            disabled={loading}
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default ForcePasswordReset; 