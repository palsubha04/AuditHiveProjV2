import { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';
import './Login.css';
import { fetchDatasets } from '../slice/datasetsSlice';
import { useDispatch } from 'react-redux';
import ReactApexChart from 'react-apexcharts';

function getRandomSeries(length = 5) {
    return Array.from({ length }, () => Math.floor(Math.random() * 100));
}

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
        if (location.state?.message) {
            setError(location.state.message);
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await authService.login({ email, password });
            if (response.password_needs_reset) {
                navigate(`/force-password-reset?token=${response.reset_token}`);
                return;
            }
            if (response.access_token && response.refresh_token && response.user) {
                localStorage.setItem('access_token', response.access_token);
                localStorage.setItem('refresh_token', response.refresh_token);
                localStorage.setItem('user', JSON.stringify(response.user));
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
            if (err.response?.data?.email?.[0]) {
                setError(err.response.data.email[0]);
            } else {
                setError('Error sending reset instructions. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const chartOptions = {
        chart: { type: 'line', toolbar: { show: false }, background: 'transparent', },
        stroke: { curve: 'smooth' },
        xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
        theme: { mode: 'dark' },
        colors: ['#5671FF'],
    };

    const charts = [
        { type: 'line', title: 'Analysis' },
        { type: 'bar', title: 'Segmentation' },
        { type: 'area', title: 'Taxes Paid' }
    ];

    return (
        <div className="login-page" style={{ backgroundImage: `url('/login/LoginBackground.svg')` }}>
            <div className="login-logo">
                <img src="/header-icons/Logo.svg" alt="Logo" />
            </div>
            <div className="login-graphics">
                {charts.map((chart, index) => (
                    <div key={index} className="chart-card">
                        <ReactApexChart
                            options={{ ...chartOptions, chart: { type: chart.type, background: 'transparent', toolbar: { show: false } }, title: { text: chart.title, style: { color: '#fff' } } }}
                            series={[{ name: chart.title, data: getRandomSeries() }]}
                            type={chart.type}
                            height={200}
                        />
                    </div>
                ))}
            </div>

            <Container style={{borderRadius: '25px 0 0 25px'}} className="d-flex align-items-center justify-content-center">
                <div className={error ? "login-box-error" : "login-box"}>
                    <div className="text-center mb-4 login-title">
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
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input-login w-100"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3 input-group position-relative">
                                <Form.Label>Password</Form.Label>
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
                                        className="password-toggle-icon"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

                            <Button type="submit" className="w-100 login-button" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login Now'}
                            </Button>
                        </Form>
                    ) : (
                        <Form onSubmit={handleForgotPassword}>
                            <Form.Group className="mb-3 input-group">
                                <Form.Label>Enter email</Form.Label>
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

                            <Button type="submit" className="w-100 login-button" disabled={loading}>
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
