import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import './CouponList.css';
import checkAndFixToken from '../../utils/fixTokenStorage';

const CouponList = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        kod: '',
        tipus: 'fix',
        ertek: '',
        minimum_osszeg: '0',
        lejarat_datum: ''
    });

    const loadCoupons = async () => {
        setLoading(true);
        try {
            checkAndFixToken();
            
            const response = await axiosInstance.get('/kuponok');
            setCoupons(response.data);
        } catch (err) {
            console.error('Hiba a kuponok betöltésekor:', err);
            setError(err.response?.data?.message || err.message);
            
            if (err.response && err.response.status === 401) {
                setError('A munkamenet lejárt vagy érvénytelen. Kérjük, jelentkezzen be újra!');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCoupons();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            checkAndFixToken();
            
            await axiosInstance.post('/kuponok', formData);
            
            setFormData({
                kod: '',
                tipus: 'fix',
                ertek: '',
                minimum_osszeg: '0',
                lejarat_datum: ''
            });
            setShowForm(false);
            loadCoupons();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Biztosan törölni szeretné ezt a kupont?')) return;
        
        try {
            checkAndFixToken();
            
            await axiosInstance.delete(`/kuponok/${id}`);
            loadCoupons();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="coupon-list">
            <div className="coupon-header">
                <h3>Kuponok kezelése</h3>
                <button 
                    className="btn-add-coupon"
                    onClick={() => setShowForm(true)}
                >
                    + Új Kupon
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="coupon-form">
                    <h3>Új Kupon Létrehozása</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Kupon Kód:</label>
                            <input
                                type="text"
                                name="kod"
                                value={formData.kod}
                                onChange={handleInputChange}
                                required
                                placeholder="pl. NYAR2024"
                            />
                        </div>
                        <div className="form-group">
                            <label>Kedvezmény Típusa:</label>
                            <select
                                name="tipus"
                                value={formData.tipus}
                                onChange={handleInputChange}
                            >
                                <option value="fix">Fix összeg (Ft)</option>
                                <option value="szazalek">Százalékos (%)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Kedvezmény Értéke:</label>
                            <input
                                type="number"
                                name="ertek"
                                value={formData.ertek}
                                onChange={handleInputChange}
                                required
                                min="1"
                                max={formData.tipus === 'szazalek' ? "100" : "999999"}
                            />
                        </div>
                        <div className="form-group">
                            <label>Minimum Kosárérték (Ft):</label>
                            <input
                                type="number"
                                name="minimum_osszeg"
                                value={formData.minimum_osszeg}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </div>
                        <div className="form-group">
                            <label>Lejárati Dátum:</label>
                            <input
                                type="date"
                                name="lejarat_datum"
                                value={formData.lejarat_datum}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-buttons">
                            <button type="submit" className="btn-save">Mentés</button>
                            <button 
                                type="button" 
                                className="btn-cancel"
                                onClick={() => setShowForm(false)}
                            >
                                Mégse
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="loading">Betöltés...</div>
            ) : coupons.length === 0 ? (
                <div className="no-coupons">Nincsenek kuponok a rendszerben.</div>
            ) : (
                <table className="coupon-table">
                    <thead>
                        <tr>
                            <th>Kupon Kód</th>
                            <th>Típus</th>
                            <th>Érték</th>
                            <th>Min. Összeg</th>
                            <th>Lejárat</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(coupon => (
                            <tr key={coupon.id}>
                                <td>{coupon.kod}</td>
                                <td>{coupon.kedvezmeny_tipus === 'fix' ? 'Fix összeg' : 'Százalékos'}</td>
                                <td>{coupon.ertek}{coupon.kedvezmeny_tipus === 'szazalek' ? '%' : ' Ft'}</td>
                                <td>{coupon.minimum_osszeg} Ft</td>
                                <td>{new Date(coupon.ervenyes_vege).toLocaleDateString('hu-HU')}</td>
                                <td>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(coupon.id)}
                                    >
                                        Törlés
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CouponList;
