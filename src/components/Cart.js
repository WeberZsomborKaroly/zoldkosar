import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { fetchPromotions, getCurrentPrice, getActivePromotion } from '../utils/promotionUtils';
import './Cart.css';
import defaultKep from '../kepek/Products/default.png';

// Import product images
import csirkemellKep from '../kepek/Products/csirkemell.png';
import chivasKep from '../kepek/Products/chivas.png';
import milkaKep from '../kepek/Products/milkacsoki.png';
import bananKep from '../kepek/Products/banan.png';
import serpenyoKep from '../kepek/Products/serpenyo.png';
import almaKep from '../kepek/Products/alma.png';
import kenyerKep from '../kepek/Products/felbarna_kenyer.png';

// Import dairy product images
import joghurtKep from '../kepek/Products/tejtermekek/joghurt150g.png';
import kefirKep from '../kepek/Products/tejtermekek/kefir175g.png';
import mascarponeKep from '../kepek/Products/tejtermekek/mascarpone250g.png';
import mozzarellaKep from '../kepek/Products/tejtermekek/mozzarella125g.png';
import parmezanKep from '../kepek/Products/tejtermekek/parmezan.png';
import sajtKep from '../kepek/Products/tejtermekek/sajt200g.png';
import tejKep from '../kepek/Products/tejtermekek/tej1l.png';
import tejfolKep from '../kepek/Products/tejtermekek/tejfol330g.png';
import turoKep from '../kepek/Products/tejtermekek/turo250g.png';
import vajKep from '../kepek/Products/tejtermekek/vaj100g.png';

// Import vegetable product images
import brokkoliKep from '../kepek/Products/zoldsegek/brokkoli.png';
import burgonyaKep from '../kepek/Products/zoldsegek/burgonya.png';
import cukkiniKep from '../kepek/Products/zoldsegek/cukkini.png';
import fokhagymaKep from '../kepek/Products/zoldsegek/fokhagyma.png';
import hagymaKep from '../kepek/Products/zoldsegek/hagyma.png';
import padlizsanKep from '../kepek/Products/zoldsegek/padlizsan.png';
import paprikaKep from '../kepek/Products/zoldsegek/paprika.png';
import paradicsomKep from '../kepek/Products/zoldsegek/paradicsom.png';
import repaKep from '../kepek/Products/zoldsegek/repa.png';
import salataKep from '../kepek/Products/zoldsegek/salata.png';
import uborkaKep from '../kepek/Products/zoldsegek/uborka.png';

// Import non-food product images
import aquafreshFogkremKep from '../kepek/Products/non-food/aquafreshfogkrem.png';
import fogkefeKep from '../kepek/Products/non-food/fogkefe.png';
import uvegpoharKep from '../kepek/Products/non-food/uvegpohar.png';
import tanyerKep from '../kepek/Products/non-food/tanyer.png';

// Import bakery product images
import zsemleKep from '../kepek/Products/pekaru/zsemle.png';
import kifliKep from '../kepek/Products/pekaru/kifli.png';
import kakaoscsigaKep from '../kepek/Products/pekaru/kakaoscsiga.png';
import turosbatyu from '../kepek/Products/pekaru/turosbatyu.png';
import pogacsaKep from '../kepek/Products/pekaru/pogacsa.png';
import croissantKep from '../kepek/Products/pekaru/croissant.png';
import bagettKep from '../kepek/Products/pekaru/bagett.png';
import rozskenyerKep from '../kepek/Products/pekaru/rozskenyér.png';
import briosKep from '../kepek/Products/pekaru/brios.png';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOrderForm, setShowOrderForm] = useState(false);
    const [orderFormData, setOrderFormData] = useState({
        nev: '',
        email: '',
        telefonszam: '',
        szallitasiCim: '',
        megjegyzes: '',
        fizetesiMod: 'szallitasutan' // Alapértelmezett fizetési mód
    });
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderError, setOrderError] = useState(null);

    // Function to get the correct image based on product name or image path
    const getProductImage = (product) => {
        if (!product) return defaultKep;
        
        // Check if we have an image path in the product
        if (product.kep) {
            console.log('Product has image path:', product.kep);
            
            // Check for dairy product images
            if (product.kep === 'joghurt150g.png') return joghurtKep;
            if (product.kep === 'kefir175g.png') return kefirKep;
            if (product.kep === 'mascarpone250g.png') return mascarponeKep;
            if (product.kep === 'mozzarella125g.png') return mozzarellaKep;
            if (product.kep === 'parmezan.png') return parmezanKep;
            if (product.kep === 'sajt200g.png') return sajtKep;
            if (product.kep === 'tej1l.png') return tejKep;
            if (product.kep === 'tejfol330g.png') return tejfolKep;
            if (product.kep === 'turo250g.png') return turoKep;
            if (product.kep === 'vaj100g.png') return vajKep;
            
            // Check for vegetable product images
            if (product.kep === 'brokkoli.png') return brokkoliKep;
            if (product.kep === 'burgonya.png') return burgonyaKep;
            if (product.kep === 'cukkini.png') return cukkiniKep;
            if (product.kep === 'fokhagyma.png') return fokhagymaKep;
            if (product.kep === 'hagyma.png') return hagymaKep;
            if (product.kep === 'padlizsan.png') return padlizsanKep;
            if (product.kep === 'paprika.png') return paprikaKep;
            if (product.kep === 'paradicsom.png') return paradicsomKep;
            if (product.kep === 'repa.png') return repaKep;
            if (product.kep === 'salata.png') return salataKep;
            if (product.kep === 'uborka.png') return uborkaKep;
            
            // Check for non-food product images
            if (product.kep === 'aquafreshfogkrem.png') return aquafreshFogkremKep;
            if (product.kep === 'fogkefe.png') return fogkefeKep;
            if (product.kep === 'uvegpohar.png') return uvegpoharKep;
            if (product.kep === 'tanyer.png') return tanyerKep;
            
            // Check for bakery product images
            if (product.kep === 'zsemle.png') return zsemleKep;
            if (product.kep === 'kifli.png') return kifliKep;
            if (product.kep === 'kakaoscsiga.png') return kakaoscsigaKep;
            if (product.kep === 'turosbatyu.png') return turosbatyu;
            if (product.kep === 'pogacsa.png') return pogacsaKep;
            if (product.kep === 'croissant.png') return croissantKep;
            if (product.kep === 'bagett.png') return bagettKep;
            if (product.kep === 'rozskenyér.png') return rozskenyerKep;
            if (product.kep === 'brios.png') return briosKep;
        }
        
        // Fallback to name-based matching
        const name = product.nev ? product.nev.toLowerCase() : '';
        console.log('Falling back to name-based matching for:', name);
        
        // Basic products
        if (name.includes('csirkemell')) return csirkemellKep;
        if (name.includes('chivas')) return chivasKep;
        if (name.includes('milka')) return milkaKep;
        if (name.includes('banán')) return bananKep;
        if (name.includes('serpenyő')) return serpenyoKep;
        if (name.includes('alma')) return almaKep;
        if (name.includes('kenyér')) return kenyerKep;
        
        // Dairy products
        if (name.includes('joghurt')) return joghurtKep;
        if (name.includes('kefir')) return kefirKep;
        if (name.includes('mascarpone')) return mascarponeKep;
        if (name.includes('mozzarella')) return mozzarellaKep;
        if (name.includes('parmezán')) return parmezanKep;
        if (name.includes('sajt')) return sajtKep;
        if (name.includes('tej')) return tejKep;
        if (name.includes('tejföl')) return tejfolKep;
        if (name.includes('túró')) return turoKep;
        if (name.includes('vaj')) return vajKep;
        
        // Vegetable products
        if (name.includes('brokkoli')) return brokkoliKep;
        if (name.includes('burgonya')) return burgonyaKep;
        if (name.includes('cukkini')) return cukkiniKep;
        if (name.includes('fokhagyma')) return fokhagymaKep;
        if (name.includes('hagyma')) return hagymaKep;
        if (name.includes('padlizsán')) return padlizsanKep;
        if (name.includes('paprika')) return paprikaKep;
        if (name.includes('paradicsom')) return paradicsomKep;
        if (name.includes('répa')) return repaKep;
        if (name.includes('saláta')) return salataKep;
        if (name.includes('uborka')) return uborkaKep;
        
        // Non-food products
        if (name.includes('aquafresh') || name.includes('fogkrém')) return aquafreshFogkremKep;
        if (name.includes('fogkefe')) return fogkefeKep;
        if (name.includes('üvegpohár')) return uvegpoharKep;
        if (name.includes('tányér')) return tanyerKep;
        
        // Bakery products
        if (name.includes('zsemle')) return zsemleKep;
        if (name.includes('kifli')) return kifliKep;
        if (name.includes('kakaós csiga')) return kakaoscsigaKep;
        if (name.includes('túrós batyu')) return turosbatyu;
        if (name.includes('pogácsa')) return pogacsaKep;
        if (name.includes('croissant')) return croissantKep;
        if (name.includes('bagett')) return bagettKep;
        if (name.includes('rozskenyér')) return rozskenyerKep;
        if (name.includes('briós')) return briosKep;
        
        console.log('No match found, returning default image');
        return defaultKep;
    };

    useEffect(() => {
        loadCartItems();
    }, []);

    useEffect(() => {
        // Load promotions as soon as the component mounts
        const loadInitialPromotions = async () => {
            const promos = await fetchPromotions(axiosInstance);
            console.log('Initially loaded promotions:', promos);
            setPromotions(promos);
        };
        
        loadInitialPromotions();
    }, []);

    const loadPromotions = async () => {
        const promos = await fetchPromotions(axiosInstance);
        console.log('Loaded promotions:', promos);
        setPromotions(promos);
        return promos;
    };

    const loadCartItems = async () => {
        try {
            console.log('Kosár betöltése...');
            // Use the correct endpoint without the full URL since it's in axiosInstance
            const response = await axiosInstance.get('/kosar');
            console.log('Kosár elemek:', response.data);
            
            // Make sure promotions are loaded before processing cart items
            let currentPromotions = promotions;
            if (currentPromotions.length === 0) {
                currentPromotions = await loadPromotions();
            }
            
            // Process cart items to ensure they have the correct structure
            const processedItems = response.data.map(item => {
                // Ensure termek is an object with the required properties
                if (!item.termek) {
                    console.error('Cart item missing termek property:', item);
                    return item;
                }
                
                // Ensure the product ID is a number
                if (item.termek.id && typeof item.termek.id !== 'number') {
                    item.termek.id = Number(item.termek.id);
                }
                
                // Ensure the product price is a number
                if (item.termek.ar && typeof item.termek.ar !== 'number') {
                    item.termek.ar = Number(item.termek.ar);
                }
                
                return item;
            });
            
            // Log each cart item for debugging
            processedItems.forEach(item => {
                console.log('Processed cart item:', item);
                console.log('Product ID:', item.termek?.id, 'Type:', typeof item.termek?.id);
                console.log('Product price:', item.termek?.ar, 'Type:', typeof item.termek?.ar);
                
                const activePromo = getActivePromotion(item.termek?.id, currentPromotions);
                console.log('Active promotion:', activePromo);
                
                const currentPrice = getCurrentPrice(item.termek, currentPromotions);
                console.log('Current price:', currentPrice);
            });
            
            setCartItems(processedItems);
            setLoading(false);
        } catch (error) {
            console.error('Hiba a kosár betöltésekor:', error);
            setError('Nem sikerült betölteni a kosár tartalmát.');
            setLoading(false);
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        try {
            // Use the correct endpoint without the full URL
            await axiosInstance.put(`/kosar/${itemId}`, 
                { mennyiseg: newQuantity }
            );
            loadCartItems();
        } catch (error) {
            console.error('Hiba a mennyiség módosításakor:', error);
            setError('Hiba történt a mennyiség módosítása során!');
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            // Use the correct endpoint without the full URL
            await axiosInstance.delete(`/kosar/${itemId}`);
            loadCartItems();
        } catch (error) {
            console.error('Hiba a termék törlésekor:', error);
            setError('Hiba történt a termék törlése során!');
        }
    };

    const handleAddToCart = async (product) => {
        try {
            // Ensure we have the latest promotions
            let currentPromotions = promotions;
            if (currentPromotions.length === 0) {
                currentPromotions = await loadPromotions();
            }
            
            // Calculate the current price with promotions
            const currentPrice = getCurrentPrice(product, currentPromotions);
            console.log(`Adding to cart: ${product.nev}, Original price: ${product.ar}, Current price: ${currentPrice}`);
            
            // Send the request with the current price
            const response = await axiosInstance.post('/kosar/add', {
                termek_id: Number(product.id),
                mennyiseg: 1,
                ar: currentPrice // Send the current price (with promotion applied if applicable)
            });
            
            console.log('Add to cart response:', response.data);
            
            // Reload the cart to reflect the changes
            loadCartItems();
            
            return response.data;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const handleOrderFormChange = (e) => {
        const { name, value } = e.target;
        setOrderFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        setOrderError(null);
        
        try {
            // Validate form data
            if (!orderFormData.nev || !orderFormData.email || !orderFormData.telefonszam || !orderFormData.szallitasiCim) {
                setOrderError('Kérjük töltse ki az összes kötelező mezőt!');
                return;
            }
            
            if (!orderFormData.fizetesiMod) {
                setOrderError('Kérjük válasszon fizetési módot!');
                return;
            }
            
            // Calculate total with discounted prices
            const total = cartItems.reduce((sum, item) => {
                if (!item.termek) return sum;
                const price = getCurrentPrice(item.termek, promotions);
                return sum + (price * item.mennyiseg);
            }, 0);
            
            // Prepare order data in the format expected by the backend
            const orderData = {
                vevoAdatok: {
                    nev: orderFormData.nev,
                    email: orderFormData.email,
                    telefonszam: orderFormData.telefonszam,
                    szallitasiCim: orderFormData.szallitasiCim,
                    megjegyzes: orderFormData.megjegyzes
                },
                termekek: cartItems.map(item => {
                    const currentPrice = getCurrentPrice(item.termek, promotions);
                    return {
                        termek_id: item.termek_id,
                        mennyiseg: item.mennyiseg,
                        ar: currentPrice // Use the discounted price if available
                    };
                }),
                vegosszeg: total,
                fizetesiMod: orderFormData.fizetesiMod
            };
            
            console.log('Rendelés adatok küldése:', orderData);
            
            // Send order to backend
            const response = await axiosInstance.post('/rendeles', orderData);
            console.log('Rendelés válasz:', response.data);
            
            // Clear cart and show success message
            setOrderSuccess(true);
            setCartItems([]);
            setShowOrderForm(false);
        } catch (error) {
            console.error('Hiba a rendelés leadásakor:', error.response?.data || error.message);
            setOrderError('Hiba történt a rendelés feldolgozása során. Kérjük próbálja újra később!');
        }
    };

    // Helper function to format prices
    const formatPrice = (price) => {
        if (typeof price !== 'number') {
            price = Number(price);
        }
        return isNaN(price) ? '0' : price.toLocaleString();
    };

    // Calculate total with discounted prices
    const total = cartItems.reduce((sum, item) => {
        if (!item.termek) return sum;
        const price = getCurrentPrice(item.termek, promotions);
        return sum + (price * item.mennyiseg);
    }, 0);

    if (loading) {
        return (
            <div className="cart-container">
                <h2>Kosár</h2>
                <p>Betöltés...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-container">
                <h2>Kosár</h2>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="cart-container">
                <h2>Rendelés sikeresen leadva!</h2>
                <p>Köszönjük a rendelését! A megadott elérhetőségeken hamarosan felvesszük Önnel a kapcsolatot.</p>
                <button className="checkout-button" onClick={() => setOrderSuccess(false)}>
                    Vissza a vásárláshoz
                </button>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2>Kosár</h2>
            
            {cartItems.length === 0 ? (
                <p>A kosár üres.</p>
            ) : (
                <>
                    {!showOrderForm ? (
                        <>
                            <div className="cart-items">
                                {cartItems.map(item => {
                                    // Ensure we have valid product data
                                    if (!item.termek || !item.termek.id) {
                                        console.error('Invalid cart item:', item);
                                        return null;
                                    }
                                    
                                    // Log item details for debugging
                                    console.log(`Rendering cart item: ${item.termek.nev}, ID: ${item.termek.id}`);
                                    
                                    // Get promotion information
                                    const activePromotion = getActivePromotion(item.termek.id, promotions);
                                    console.log('Active promotion for this item:', activePromotion);
                                    
                                    // Calculate current price
                                    const currentPrice = getCurrentPrice(item.termek, promotions);
                                    console.log(`Price calculation: Original: ${item.termek.ar}, Current: ${currentPrice}`);
                                    
                                    const itemTotal = currentPrice * item.mennyiseg;
                                    
                                    return (
                                        <div key={item.id} className="cart-item">
                                            <img 
                                                src={getProductImage(item.termek)} 
                                                alt={item.termek.nev} 
                                                onError={(e) => {
                                                    console.log('Image error for:', item.termek.nev, 'Path:', item.termek.kep);
                                                    e.target.onerror = null;
                                                    e.target.src = defaultKep;
                                                }}
                                            />
                                            <div className="cart-item-details">
                                                <h3>{item.termek.nev}</h3>
                                                <p>{item.termek.leiras}</p>
                                                
                                                {activePromotion ? (
                                                    <div className="price-container">
                                                        <p className="original-price">{formatPrice(item.termek.ar)} Ft</p>
                                                        <p className="discount-price">{formatPrice(currentPrice)} Ft</p>
                                                        <p className="discount-badge">-{activePromotion.discount_percent}%</p>
                                                    </div>
                                                ) : (
                                                    <p>{formatPrice(item.termek.ar)} Ft</p>
                                                )}
                                                
                                                <div className="quantity-controls">
                                                    <button 
                                                        onClick={() => handleQuantityChange(item.id, Math.max(1, item.mennyiseg - 1))}
                                                        disabled={item.mennyiseg <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span>{item.mennyiseg}</span>
                                                    <button onClick={() => handleQuantityChange(item.id, item.mennyiseg + 1)}>
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="cart-item-price">
                                                {formatPrice(itemTotal)} Ft
                                            </div>
                                            <button 
                                                className="remove-item"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                            
                            <div className="cart-summary">
                                <div className="cart-total">
                                    <span>Összesen:</span>
                                    <span>{formatPrice(total)} Ft</span>
                                </div>
                                <button 
                                    className="checkout-button"
                                    onClick={() => {
                                        // Load saved shipping data if available
                                        const savedData = localStorage.getItem('savedShippingData');
                                        if (savedData) {
                                            try {
                                                const parsedData = JSON.parse(savedData);
                                                setOrderFormData(prev => ({
                                                    ...prev,
                                                    ...parsedData
                                                }));
                                            } catch (error) {
                                                console.error('Hiba a mentett szállítási adatok betöltésekor:', error);
                                            }
                                        }
                                        
                                        // Try to load user data if available
                                        const userData = localStorage.getItem('user');
                                        if (userData) {
                                            try {
                                                const parsedUser = JSON.parse(userData);
                                                setOrderFormData(prev => ({
                                                    ...prev,
                                                    nev: parsedUser.name || prev.nev,
                                                    email: parsedUser.email || prev.email,
                                                    telefonszam: parsedUser.phone || prev.telefonszam
                                                }));
                                            } catch (error) {
                                                console.error('Hiba a felhasználói adatok betöltésekor:', error);
                                            }
                                        }
                                        
                                        setShowOrderForm(true);
                                    }}
                                >
                                    Tovább a rendeléshez
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="order-form-container">
                            <h3>Rendelési adatok</h3>
                            
                            {orderError && (
                                <div className="error-message">
                                    {orderError}
                                </div>
                            )}
                            
                            <form onSubmit={handleOrderSubmit}>
                                <div className="form-group">
                                    <label htmlFor="nev">Név*</label>
                                    <input
                                        type="text"
                                        id="nev"
                                        name="nev"
                                        value={orderFormData.nev}
                                        onChange={handleOrderFormChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="email">Email*</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={orderFormData.email}
                                        onChange={handleOrderFormChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="telefonszam">Telefonszám*</label>
                                    <input
                                        type="tel"
                                        id="telefonszam"
                                        name="telefonszam"
                                        value={orderFormData.telefonszam}
                                        onChange={handleOrderFormChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="szallitasiCim">Szállítási cím*</label>
                                    <input
                                        type="text"
                                        id="szallitasiCim"
                                        name="szallitasiCim"
                                        value={orderFormData.szallitasiCim}
                                        onChange={handleOrderFormChange}
                                        required
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label htmlFor="megjegyzes">Megjegyzés</label>
                                    <textarea
                                        id="megjegyzes"
                                        name="megjegyzes"
                                        value={orderFormData.megjegyzes}
                                        onChange={handleOrderFormChange}
                                    />
                                </div>
                                
                                <div className="payment-options">
                                    <h4>Fizetési mód*</h4>
                                    
                                    <div className="payment-option">
                                        <input
                                            type="radio"
                                            id="szallitasutan"
                                            name="fizetesiMod"
                                            value="szallitasutan"
                                            checked={orderFormData.fizetesiMod === 'szallitasutan'}
                                            onChange={handleOrderFormChange}
                                            required
                                        />
                                        <label htmlFor="szallitasutan">Fizetés szállításkor</label>
                                    </div>
                                    
                                    <div className="payment-option">
                                        <input
                                            type="radio"
                                            id="bankkartya"
                                            name="fizetesiMod"
                                            value="bankkartya"
                                            checked={orderFormData.fizetesiMod === 'bankkartya'}
                                            onChange={handleOrderFormChange}
                                        />
                                        <label htmlFor="bankkartya">Bankkártyás fizetés</label>
                                    </div>
                                    
                                    <div className="payment-option">
                                        <input
                                            type="radio"
                                            id="atutalas"
                                            name="fizetesiMod"
                                            value="atutalas"
                                            checked={orderFormData.fizetesiMod === 'atutalas'}
                                            onChange={handleOrderFormChange}
                                        />
                                        <label htmlFor="atutalas">Banki átutalás</label>
                                    </div>
                                </div>
                                
                                <div className="form-buttons">
                                    <button 
                                        type="button" 
                                        className="back-button"
                                        onClick={() => setShowOrderForm(false)}
                                    >
                                        Vissza a kosárhoz
                                    </button>
                                    <button type="submit" className="submit-button">
                                        Rendelés leadása
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Cart;
