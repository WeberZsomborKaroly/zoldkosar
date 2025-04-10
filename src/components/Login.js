import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import './Login.css';

const Login = ({ setUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        jelszo: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting login with:', formData); // Debug log
            const response = await axiosInstance.post('/bejelentkezes', formData);
            console.log('Login response:', response.data); // Debug log
            
            // Handle different response structures
            const { accessToken, token } = response.data;
            const actualToken = accessToken || token;

            if (!actualToken) {
                throw new Error('No token received from server');
            }
            
            localStorage.setItem('token', actualToken);
            console.log('Stored token:', localStorage.getItem('token')); // Debug log
            
            // Store user info
            const userData = response.data.user || response.data;
            localStorage.setItem('user', JSON.stringify(userData));
            
            // Update the user state in the App component
            setUser(userData);
            
            // Dispatch event to notify other components about auth change
            window.dispatchEvent(new Event('authChange'));
            
            // Redirect to home page
            navigate('/');
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || error.message || 'Hiba történt a bejelentkezés során');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-form-container">
                <h2>Bejelentkezés</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email cím</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="jelszo">Jelszó</label>
                        <input
                            type="password"
                            id="jelszo"
                            name="jelszo"
                            value={formData.jelszo}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
                    </button>
                </form>
                <div className="login-links">
                    <p>
                        Nincs még fiókod? <Link to="/register">Regisztrálj itt</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
