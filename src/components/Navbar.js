import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ user, setUser }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('authChange'));
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="nav-logo">
                    ZöldKosár Webshop
                </Link>
                <div className="navbar-menu">
                    <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                        <i className="fas fa-home"></i>
                        <span>Főoldal</span>
                    </Link>
                    <Link to="/products" className={`nav-item ${isActive('/products') ? 'active' : ''}`}>
                        <i className="fas fa-shopping-basket"></i>
                        <span>Termékek</span>
                    </Link>
                    <Link to="/recipes" className={`nav-item ${isActive('/recipes') ? 'active' : ''}`}>
                        <i className="fas fa-utensils"></i>
                        <span>Receptek</span>
                    </Link>
                    <Link to="/about" className={`nav-item ${isActive('/about') ? 'active' : ''}`}>
                        <i className="fas fa-info-circle"></i>
                        <span>Rólunk</span>
                    </Link>
                    {user ? (
                        <>
                            <Link to="/cart" className={`nav-item ${isActive('/cart') ? 'active' : ''}`}>
                                <i className="fas fa-shopping-cart"></i>
                                <span>Kosár</span>
                            </Link>
                            <div className="user-section">
                                {user.szerepkor === 'admin' && (
                                    <Link to="/admin" className={`nav-item admin-button ${isActive('/admin') ? 'active' : ''}`}>
                                        <i className="fas fa-user-shield"></i>
                                        <span>Admin</span>
                                    </Link>
                                )}
                                <Link to="/profile" className={`nav-item user-name ${isActive('/profile') ? 'active' : ''}`}>
                                    <i className="fas fa-user"></i>
                                    <span>{user.vezeteknev} {user.keresztnev}</span>
                                </Link>
                                <button onClick={handleLogout} className="logout-button">
                                    <i className="fas fa-sign-out-alt"></i>
                                    <span>Kilépés</span>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="user-section">
                            <Link to="/login" className={`nav-item ${isActive('/login') ? 'active' : ''}`}>
                                <i className="fas fa-sign-in-alt"></i>
                                <span>Belépés</span>
                            </Link>
                            <Link to="/register" className={`nav-item ${isActive('/register') ? 'active' : ''}`}>
                                <i className="fas fa-user-plus"></i>
                                <span>Regisztráció</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
