import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import OrderForm from './OrderForm';
import CouponForm from './CouponForm';
import Notification from '../common/Notification';
import './Cart.css';

// Import product images
import csirkemellKep from '../../kepek/Products/csirkemell.png';
import chivasKep from '../../kepek/Products/chivas.png';
import milkaKep from '../../kepek/Products/milkacsoki.png';
import bananKep from '../../kepek/Products/banan.png';
import serpenyoKep from '../../kepek/Products/serpenyo.png';
import almaKep from '../../kepek/Products/alma.png';
import kenyerKep from '../../kepek/Products/felbarna_kenyer.png';
import tejKep from '../../kepek/Products/friss_tej.png';
import paradicsomKep from '../../kepek/Products/paradicsom.png';
import defaultKep from '../../kepek/Products/default.png';

// Import 18+ product images
import kobanyai05Kep from '../../kepek/Products/18+/kobanyai0,5.png';
import kobanyai2lKep from '../../kepek/Products/18+/kobanyai2l.png';
import volgyesFeledesRoseKep from '../../kepek/Products/18+/volgyesfeledesrose.png';
import volgyesFeledesVorosborKep from '../../kepek/Products/18+/volgyesfeledesvorosbor.png';
import volgyesSzarazFeherborKep from '../../kepek/Products/18+/volgyesszarazfeherbor.png';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [notification, setNotification] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    // Function to get the correct image based on product name
    const getProductImage = (productName) => {
        if (!productName) return defaultKep;
        
        const name = productName.toLowerCase();
        if (name.includes('csirkemell')) return csirkemellKep;
        if (name.includes('chivas')) return chivasKep;
        if (name.includes('milka')) return milkaKep;
        if (name.includes('banán') || name.includes('banan')) return bananKep;
        if (name.includes('serpenyő') || name.includes('serpenyo')) return serpenyoKep;
        if (name.includes('alma')) return almaKep;
        if (name.includes('kenyér') || name.includes('kenyer')) return kenyerKep;
        if (name.includes('tej')) return tejKep;
        if (name.includes('paradicsom')) return paradicsomKep;
        
        // 18+ products
        if (name.includes('kőbányai') && name.includes('0.5')) return kobanyai05Kep;
        if (name.includes('kőbányai') && name.includes('2l')) return kobanyai2lKep;
        if (name.includes('völgyes') && name.includes('félédes') && name.includes('rozé')) return volgyesFeledesRoseKep;
        if (name.includes('völgyes') && name.includes('félédes') && name.includes('vörösbor')) return volgyesFeledesVorosborKep;
        if (name.includes('völgyes') && name.includes('száraz') && name.includes('fehérbor')) return volgyesSzarazFeherborKep;
        
        return defaultKep;
    };

    useEffect(() => {
        loadCartItems();
    }, []);

    const loadCartItems = async () => {
        try {
            console.log('Kosár betöltése...');
            const response = await axiosInstance.get('/kosar');
            console.log('Kosár elemek:', response.data);
            
            // Check if we have valid data
            if (response.data && Array.isArray(response.data)) {
                setCartItems(response.data);
                
                // Calculate total
                const subtotal = response.data.reduce((sum, item) => {
                    const price = item.termek?.ar || 0;
                    return sum + (price * item.mennyiseg);
                }, 0);
                
                // Apply discount if coupon is applied
                const finalTotal = appliedCoupon ? subtotal - discountAmount : subtotal;
                setTotal(finalTotal);
            }
        } catch (error) {
            console.error('Hiba a kosár betöltésekor:', error);
            console.error('Hiba részletei:', error.response?.data);
        }
    };

    useEffect(() => {
        if (cartItems.length > 0) {
            const subtotal = cartItems.reduce((sum, item) => {
                const price = item.termek?.ar || 0;
                return sum + (price * item.mennyiseg);
            }, 0);
            
            // Apply discount if coupon is applied
            const finalTotal = appliedCoupon ? subtotal - discountAmount : subtotal;
            setTotal(finalTotal);
        } else {
            setTotal(0);
            setAppliedCoupon(null);
            setDiscountAmount(0);
        }
    }, [cartItems, appliedCoupon, discountAmount]);

    const updateQuantity = async (itemId, mennyiseg) => {
        if (mennyiseg < 1) return;
        
        try {
            await axiosInstance.put(`/kosar/${itemId}`, {
                mennyiseg
            });
            loadCartItems();
        } catch (error) {
            console.error('Hiba a mennyiség frissítésekor:', error);
        }
    };

    const removeItem = async (itemId) => {
        try {
            await axiosInstance.delete(`/kosar/${itemId}`);
            loadCartItems();
        } catch (error) {
            console.error('Hiba a termék törlésekor:', error);
        }
    };

    const handleCheckout = () => {
        // Minimum rendelési érték ellenőrzése (2000 Ft)
        if (total < 2000) {
            setNotification({
                message: 'A minimum rendelési érték 2000 Ft. Kérjük, adjon meg termékeket a kosárhoz.',
                type: 'error'
            });
            return;
        }
        
        setShowOrderForm(true);
    };

    const handleCouponApply = (couponData) => {
        if (couponData) {
            setAppliedCoupon(couponData.kupon);
            setDiscountAmount(couponData.kedvezmeny);
        } else {
            setAppliedCoupon(null);
            setDiscountAmount(0);
        }
    };

    const handleOrderSubmit = async (orderData) => {
        try {
            // Prepare order data in the format expected by the backend
            const cartItemsData = cartItems.map(item => ({
                termek_id: item.termek_id,
                mennyiseg: item.mennyiseg,
                ar: item.termek.ar
            }));
            
            // Rendelés létrehozása a szállítási adatokkal és költséggel
            const orderPayload = {
                vevoAdatok: orderData,
                termekek: cartItemsData,
                vegosszeg: total + orderData.szallitasiKoltseg - discountAmount,
                kupon: appliedCoupon,
                kedvezmeny: discountAmount,
                szallitasiKoltseg: orderData.szallitasiKoltseg || 0
            };
            
            console.log('Rendelés adatok küldése:', orderPayload);
            
            // Use the orders/create endpoint which is registered in the server
            const response = await axiosInstance.post('/orders/create', orderPayload);
            console.log('Rendelés válasz:', response.data);
            
            // Clear the cart in the backend
            await axiosInstance.delete('/kosar/clear');
            
            // Update local state
            setCartItems([]);
            setTotal(0);
            setShowOrderForm(false);
            setAppliedCoupon(null);
            setDiscountAmount(0);
            
            // Show success notification instead of alert
            setNotification({
                message: 'Rendelés sikeresen leadva!',
                type: 'success'
            });
        } catch (error) {
            console.error('Hiba a rendelés leadásakor:', error.response?.data || error.message);
            
            // Show error notification instead of alert
            setNotification({
                message: 'Hiba történt a rendelés során! Kérjük próbálja újra később.',
                type: 'error'
            });
        }
    };

    const handleOrderCancel = () => {
        setShowOrderForm(false);
    };

    if (showOrderForm) {
        return <OrderForm 
            onSubmit={handleOrderSubmit}
            onCancel={handleOrderCancel}
            total={total}
            appliedCoupon={appliedCoupon}
            discountAmount={discountAmount}
        />;
    }

    return (
        <div className="cart-container">
            {notification && (
                <Notification 
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
            
            <h2 className="cart-title">Kosár</h2>
            
            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <i className="fa fa-shopping-cart"></i>
                    <p>A kosár üres</p>
                    <button className="continue-shopping-btn" onClick={() => window.location.href = '/'}>
                        Vásárlás folytatása
                    </button>
                </div>
            ) : (
                <div className="cart-content">
                    <div className="cart-header">
                        <div className="cart-header-product">Termék</div>
                        <div className="cart-header-price">Ár</div>
                        <div className="cart-header-quantity">Mennyiség</div>
                        <div className="cart-header-total">Összesen</div>
                        <div className="cart-header-action"></div>
                    </div>
                    
                    <div className="cart-items">
                        {cartItems.map(item => {
                            const product = item.termek || {};
                            const price = product.ar || 0;
                            const itemTotal = price * item.mennyiseg;
                            const productName = product.nev || 'Ismeretlen termék';
                            
                            return (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-product">
                                        <img 
                                            src={getProductImage(productName)}
                                            alt={productName} 
                                            className="product-image"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = defaultKep;
                                            }}
                                        />
                                        <div className="product-info">
                                            <h3>{productName}</h3>
                                            <p className="product-description">{product.leiras || ''}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="cart-price">
                                        <span className="price">{price} Ft</span>
                                    </div>
                                    
                                    <div className="quantity-controls">
                                        <button 
                                            className="quantity-btn"
                                            onClick={() => updateQuantity(item.id, item.mennyiseg - 1)}
                                            disabled={item.mennyiseg <= 1}
                                        >
                                            -
                                        </button>
                                        <input 
                                            type="number" 
                                            value={item.mennyiseg} 
                                            min="1"
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                            className="quantity-input"
                                        />
                                        <button 
                                            className="quantity-btn"
                                            onClick={() => updateQuantity(item.id, item.mennyiseg + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    
                                    <div className="item-total">
                                        {itemTotal.toLocaleString()} Ft
                                    </div>
                                    
                                    <button 
                                        className="remove-button"
                                        onClick={() => removeItem(item.id)}
                                        title="Termék törlése"
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="cart-summary">
                        {cartItems.length > 0 && (
                            <CouponForm 
                                onApplyCoupon={handleCouponApply} 
                                totalAmount={cartItems.reduce((sum, item) => sum + (item.termek?.ar || 0) * item.mennyiseg, 0)}
                            />
                        )}
                        
                        <div className="summary-row subtotal">
                            <span>Részösszeg:</span>
                            <span>{cartItems.reduce((sum, item) => sum + (item.termek?.ar || 0) * item.mennyiseg, 0).toLocaleString()} Ft</span>
                        </div>
                        
                        {appliedCoupon && (
                            <div className="summary-row discount">
                                <span>Kupon kedvezmény ({appliedCoupon.kod}):</span>
                                <span>-{discountAmount.toLocaleString()} Ft</span>
                            </div>
                        )}
                        
                        <div className="summary-row shipping">
                            <span>Szállítási költség:</span>
                            <span>0 Ft</span>
                        </div>
                        <div className="summary-row total">
                            <span>Végösszeg:</span>
                            <span>{total.toLocaleString()} Ft</span>
                        </div>
                        
                        {/* Minimum rendelési érték figyelmeztetés */}
                        {total < 2000 && (
                            <div className="minimum-order-alert">
                                <div className="minimum-order-icon">
                                    <i className="fa fa-exclamation-triangle"></i>
                                </div>
                                <div className="minimum-order-content">
                                    <h4>Minimum rendelési érték: 2000 Ft</h4>
                                    <p>Jelenleg a kosár értéke: <strong>{total.toLocaleString()} Ft</strong></p>
                                    <div className="progress-container">
                                        <div 
                                            className="progress-bar" 
                                            style={{ width: `${Math.min(total / 2000 * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="minimum-order-tip">Még <strong>{(2000 - total).toLocaleString()} Ft</strong> hiányzik a minimum érték eléréséhez</p>
                                </div>
                                <button className="minimum-order-close" onClick={() => {}}>×</button>
                            </div>
                        )}
                        
                        <div className="cart-actions">
                            <button className="continue-shopping" onClick={() => window.location.href = '/'}>
                                Vásárlás folytatása
                            </button>
                            <button 
                                className="checkout-button"
                                onClick={handleCheckout}
                            >
                                Rendelés leadása
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
