import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import './PromotionList.css';

const PromotionList = () => {
    const [products, setProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [discountPercent, setDiscountPercent] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [editingPromotion, setEditingPromotion] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchPromotions();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            
            try {
                const response = await axiosInstance.get('/admin/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products from API:', error);
                
                
                const storedProducts = localStorage.getItem('products');
                if (storedProducts) {
                    setProducts(JSON.parse(storedProducts));
                } else {
                    
                    const mockProducts = [
                        {
                            id: 1,
                            nev: 'Csirkemell filé',
                            ar: 1800,
                            leiras: 'Friss csirkemell filé, kiváló minőségű, hazai forrásból.',
                            kategoria_id: 8
                        },
                        {
                            id: 2,
                            nev: 'Chivas Regal 12 éves',
                            ar: 9990,
                            leiras: 'Prémium skót whisky, 12 éves érlelésű.',
                            kategoria_id: 2
                        },
                        {
                            id: 3,
                            nev: 'Milka csokoládé',
                            ar: 450,
                            leiras: 'Alpesi tejcsokoládé, 100g.',
                            kategoria_id: 1
                        },
                        {
                            id: 4,
                            nev: 'Banán',
                            ar: 450,
                            leiras: 'Friss, érett banán, kg.',
                            kategoria_id: 5
                        },
                        {
                            id: 5,
                            nev: 'Teflon serpenyő',
                            ar: 4990,
                            leiras: '28 cm átmérőjű tapadásmentes serpenyő.',
                            kategoria_id: 3
                        }
                    ];
                    setProducts(mockProducts);
                    localStorage.setItem('products', JSON.stringify(mockProducts));
                }
            }
            setLoading(false);
        } catch (err) {
            console.error('Error in fetchProducts:', err);
            setError('Hiba történt a termékek betöltése közben');
            setLoading(false);
        }
    };

    const fetchPromotions = async () => {
        try {
            setLoading(true);
            
            try {
                const response = await axiosInstance.get('/admin/promotions');
                setPromotions(response.data);
            } catch (error) {
                console.error('Error fetching promotions from API:', error);
                
                
                const storedPromotions = localStorage.getItem('promotions');
                if (storedPromotions) {
                    setPromotions(JSON.parse(storedPromotions));
                } else {
                    
                    setPromotions([]);
                    localStorage.setItem('promotions', JSON.stringify([]));
                }
            }
            setLoading(false);
        } catch (err) {
            console.error('Error in fetchPromotions:', err);
            setError('Hiba történt az akciók betöltése közben');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedProduct || !discountPercent || !startDate || !endDate) {
            setError('Kérjük, töltsön ki minden mezőt!');
            return;
        }
        
        if (isNaN(discountPercent) || discountPercent <= 0 || discountPercent > 100) {
            setError('A kedvezmény százalékának 0 és 100 között kell lennie!');
            return;
        }
        
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        
        if (endDateObj <= startDateObj) {
            setError('A befejezési dátumnak a kezdési dátum után kell lennie!');
            return;
        }
        
        try {
            const selectedProductObj = products.find(p => p.id.toString() === selectedProduct.toString());
            
            if (!selectedProductObj) {
                setError('Érvénytelen termék kiválasztva!');
                return;
            }
            
            const newPromotion = {
                id: editingPromotion ? editingPromotion.id : Date.now(), // Use timestamp as ID for new promotions
                product_id: parseInt(selectedProduct),
                product_name: selectedProductObj.nev,
                original_price: selectedProductObj.ar,
                discount_percent: parseInt(discountPercent),
                discounted_price: Math.round(selectedProductObj.ar * (1 - parseInt(discountPercent) / 100)),
                start_date: startDate,
                end_date: endDate,
                active: new Date() >= startDateObj && new Date() <= endDateObj
            };
            
            let updatedPromotions;
            
            if (editingPromotion) {
               
                updatedPromotions = promotions.map(promo => 
                    promo.id === editingPromotion.id ? newPromotion : promo
                );
                
                
                try {
                    await axiosInstance.put(`/admin/promotions/${editingPromotion.id}`, newPromotion);
                } catch (error) {
                    console.error('Error updating promotion via API:', error);
                }
            } else {
                
                updatedPromotions = [...promotions, newPromotion];
                
                
                try {
                    await axiosInstance.post('/admin/promotions', newPromotion);
                } catch (error) {
                    console.error('Error adding promotion via API:', error);
                }
            }
            
            
            localStorage.setItem('promotions', JSON.stringify(updatedPromotions));
            
            
            setPromotions(updatedPromotions);
            resetForm();
            setError(null);
            
            
            alert(editingPromotion ? 'Akció sikeresen frissítve!' : 'Akció sikeresen hozzáadva!');
        } catch (error) {
            console.error('Error saving promotion:', error);
            setError('Hiba történt az akció mentése közben!');
        }
    };

    const handleDelete = async (promotion) => {
        if (!window.confirm(`Biztosan törölni szeretné a(z) ${promotion.product_name} termék akcióját?`)) {
            return;
        }
        
        try {
            
            try {
                await axiosInstance.delete(`/admin/promotions/${promotion.id}`);
            } catch (error) {
                console.error('Error deleting promotion via API:', error);
            }
            
            
            const updatedPromotions = promotions.filter(p => p.id !== promotion.id);
            setPromotions(updatedPromotions);
            
            
            localStorage.setItem('promotions', JSON.stringify(updatedPromotions));
            
            alert('Akció sikeresen törölve!');
        } catch (error) {
            console.error('Error deleting promotion:', error);
            setError('Hiba történt az akció törlése közben!');
        }
    };

    const handleEdit = (promotion) => {
        setEditingPromotion(promotion);
        setSelectedProduct(promotion.product_id.toString());
        setDiscountPercent(promotion.discount_percent.toString());
        setStartDate(promotion.start_date);
        setEndDate(promotion.end_date);
    };

    const resetForm = () => {
        setSelectedProduct('');
        setDiscountPercent('');
        setStartDate('');
        setEndDate('');
        setEditingPromotion(null);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('hu-HU', options);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(price);
    };

    if (loading && promotions.length === 0) {
        return <div className="loading">Akciók betöltése...</div>;
    }

    return (
        <div className="promotion-list">
            <h2>Akciók kezelése</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="promotion-form">
                <h3>{editingPromotion ? 'Akció szerkesztése' : 'Új akció hozzáadása'}</h3>
                
                <div className="form-group">
                    <label>Termék:</label>
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        required
                    >
                        <option value="">Válasszon terméket</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.nev} - {formatPrice(product.ar)}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Kedvezmény (%):</label>
                    <input
                        type="number"
                        min="1"
                        max="99"
                        value={discountPercent}
                        onChange={(e) => setDiscountPercent(e.target.value)}
                        required
                    />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label>Kezdés dátuma:</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Befejezés dátuma:</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                        />
                    </div>
                </div>
                
                <div className="form-buttons">
                    <button type="submit" className="save-button">
                        {editingPromotion ? 'Frissítés' : 'Hozzáadás'}
                    </button>
                    {editingPromotion && (
                        <button type="button" className="cancel-button" onClick={resetForm}>
                            Mégse
                        </button>
                    )}
                </div>
            </form>
            
            <div className="table-container">
                <h3>Aktív akciók</h3>
                {promotions.length > 0 ? (
                    <table className="promotion-table">
                        <thead>
                            <tr>
                                <th>Termék</th>
                                <th>Eredeti ár</th>
                                <th>Kedvezmény</th>
                                <th>Akciós ár</th>
                                <th>Kezdés</th>
                                <th>Befejezés</th>
                                <th>Státusz</th>
                                <th>Műveletek</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map(promotion => {
                                const now = new Date();
                                const startDate = new Date(promotion.start_date);
                                const endDate = new Date(promotion.end_date);
                                let status;
                                
                                if (now < startDate) {
                                    status = 'Jövőbeli';
                                } else if (now > endDate) {
                                    status = 'Lejárt';
                                } else {
                                    status = 'Aktív';
                                }
                                
                                return (
                                    <tr key={promotion.id}>
                                        <td>{promotion.product_name}</td>
                                        <td>{formatPrice(promotion.original_price)}</td>
                                        <td>{promotion.discount_percent}%</td>
                                        <td>{formatPrice(promotion.discounted_price)}</td>
                                        <td>{formatDate(promotion.start_date)}</td>
                                        <td>{formatDate(promotion.end_date)}</td>
                                        <td>
                                            <span className={`status-badge status-${status.toLowerCase()}`}>
                                                {status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(promotion)}
                                            >
                                                Szerkesztés
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(promotion)}
                                            >
                                                Törlés
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-promotions">Nincsenek akciók</p>
                )}
            </div>
        </div>
    );
};

export default PromotionList;
