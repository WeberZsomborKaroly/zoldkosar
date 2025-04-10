import React, { useState } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import checkAndFixToken from '../../utils/fixTokenStorage';
import './CouponForm.css';

const CouponForm = ({ onApplyCoupon, totalAmount }) => {
    const [couponCode, setCouponCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const handleInputChange = (e) => {
        setCouponCode(e.target.value);
        setError('');
    };

    const applyCoupon = async (e) => {
        e.preventDefault();
        
        if (!couponCode.trim()) {
            setError('Kérjük, adjon meg egy kuponkódot!');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            // Ellenőrizzük és javítjuk a tokent, ha szükséges
            await checkAndFixToken();

            const response = await axiosInstance.post(
                '/kuponok/alkalmaz',
                {
                    kod: couponCode,
                    osszeg: totalAmount
                }
            );

            setAppliedCoupon(response.data);
            setSuccess('Kupon sikeresen alkalmazva!');
            onApplyCoupon(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Hiba történt a kupon alkalmazása közben.');
            onApplyCoupon(null);
            setAppliedCoupon(null);
        } finally {
            setLoading(false);
        }
    };

    const removeCoupon = () => {
        setCouponCode('');
        setAppliedCoupon(null);
        setSuccess('');
        setError('');
        onApplyCoupon(null);
    };

    return (
        <div className="coupon-form-container">
            <h3>Kupon beváltása</h3>
            
            {appliedCoupon ? (
                <div className="applied-coupon">
                    <div className="applied-coupon-info">
                        <span className="applied-coupon-code">{appliedCoupon.kupon.kod}</span>
                        <span className="applied-coupon-discount">
                            -{appliedCoupon.kedvezmeny.toLocaleString()} Ft
                        </span>
                    </div>
                    <button 
                        className="remove-coupon-button" 
                        onClick={removeCoupon}
                        type="button"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            ) : (
                <form onSubmit={applyCoupon} className="coupon-input-form">
                    <div className="coupon-input-container">
                        <input
                            type="text"
                            placeholder="Kuponkód"
                            value={couponCode}
                            onChange={handleInputChange}
                            className="coupon-input"
                            disabled={loading}
                        />
                        <button 
                            type="submit" 
                            className="apply-coupon-button"
                            disabled={loading || !couponCode.trim()}
                        >
                            {loading ? 'Ellenőrzés...' : 'Beváltás'}
                        </button>
                    </div>
                    {error && <div className="coupon-error">{error}</div>}
                    {success && <div className="coupon-success">{success}</div>}
                </form>
            )}
        </div>
    );
};

export default CouponForm;
