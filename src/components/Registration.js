import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toast from './Toast';
import './Login.css';

const Registration = ({ setUser }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        jelszo: '',
        vezeteknev: '',
        keresztnev: '',
        telefon: ''
    });
    const [hibaUzenet, setHibaUzenet] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHibaUzenet('');

        try {
            // Regisztráció
            const response = await axios.post('http://localhost:3001/api/auth/signup', {
                email: formData.email,
                jelszo: formData.jelszo,
                vezeteknev: formData.vezeteknev,
                keresztnev: formData.keresztnev,
                telefon: formData.telefon
            });
            
            if (response.data.user) {
                // Sikeres regisztráció, mentjük a felhasználó adatait
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setUser(response.data.user);
                
                // Üdvözlő üzenet megjelenítése
                setShowToast(true);
                
                // Késleltetett átirányítás a bejelentkezési oldalra
                setTimeout(() => {
                    navigate('/login');
                }, 4000);
            }
        } catch (error) {
            console.error('Regisztrációs hiba:', error);
            setHibaUzenet(error.response?.data?.message || 'Hiba történt a regisztráció során!');
        }
    };

    return (
        <>
            {showToast && (
                <Toast
                    message={`Üdvözöljük ${formData.vezeteknev} ${formData.keresztnev}! Sikeres regisztráció! Átirányítás a bejelentkezéshez...`}
                    onClose={() => setShowToast(false)}
                />
            )}
            <div className="login-container">
                <div className="login-box">
                    <h2>Regisztráció</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Vezetéknév:</label>
                            <input
                                type="text"
                                name="vezeteknev"
                                value={formData.vezeteknev}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Keresztnév:</label>
                            <input
                                type="text"
                                name="keresztnev"
                                value={formData.keresztnev}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Telefonszám:</label>
                            <input
                                type="tel"
                                name="telefon"
                                value={formData.telefon}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Email cím:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Jelszó:</label>
                            <input
                                type="password"
                                name="jelszo"
                                value={formData.jelszo}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        {hibaUzenet && <div className="hiba-uzenet">{hibaUzenet}</div>}
                        <button type="submit" className="submit-button">
                            Regisztráció
                        </button>
                    </form>
                    <div className="switch-form">
                        <p>
                            Már van fiókod?
                            <button 
                                className="switch-button"
                                onClick={() => navigate('/login')}
                            >
                                Bejelentkezés
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Registration;
