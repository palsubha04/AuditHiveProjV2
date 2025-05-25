import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Handle password reset logic here
    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="reset-password-page">
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="reset-password-box">
          <h1 className="text-center mb-4">Reset Password</h1>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-3">
              Password updated successfully! Redirecting to login...
            </Alert>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3 input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faLock} color="#968D8D" size="lg" />
                </span>
              </div>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-input"
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
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-input"
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <a 
                href="#" 
                className="back-to-login"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/login');
                }}
              >
                Back to Login
              </a>
            </div>

            <Button 
              type="submit" 
              className="w-100 reset-button"
              disabled={success}
            >
              Reset Password
            </Button>
          </Form>
        </div>
      </Container>
    </div>
  );
}

export default ResetPassword; 