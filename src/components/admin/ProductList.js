import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import './ProductList.css';
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

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [editForm, setEditForm] = useState({
        nev: '',
        leiras: '',
        ar: '',
        keszlet: '',
        kategoria_id: '',
        kep: ''
    });
    const [newProductForm, setNewProductForm] = useState({
        nev: '',
        leiras: '',
        ar: '',
        keszlet: '',
        kategoria_id: '',
        kep: ''
    });
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const newFileInputRef = useRef(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        // Filter products based on search term and selected category
        if (!products) return;

        let filtered = [...products];

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(product => 
                product.nev.toLowerCase().includes(searchLower) || 
                (product.leiras && product.leiras.toLowerCase().includes(searchLower))
            );
        }

        // Apply category filter
        if (selectedCategory) {
            filtered = filtered.filter(product => 
                product.kategoria_id.toString() === selectedCategory
            );
        }

        setFilteredProducts(filtered);
    }, [products, searchTerm, selectedCategory]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            console.log('Fetching products from API...');
            // Since axiosInstance.baseURL is 'http://localhost:3001/api'
            // we don't need to include '/api' in our endpoint paths
            const response = await axiosInstance.get('/admin/products');
            console.log('Fetched products:', response.data);
            setProducts(response.data);
            setFilteredProducts(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Hiba történt a termékek betöltése közben');
            setLoading(false);
        }
    };

    // Fetch categories with error handling and retries
    const fetchCategories = async () => {
        try {
            // Try multiple endpoints for categories
            try {
                // First try to get categories from the kategoriak endpoint
                const response = await axiosInstance.get('/kategoriak');
                console.log('Fetched categories from /kategoriak:', response.data);
                if (response.data && response.data.length > 0) {
                    setCategories(response.data);
                    return;
                }
            } catch (err) {
                console.log('Could not fetch from /kategoriak, trying /categories');
            }
            
            // If the first endpoint fails, try the categories endpoint
            try {
                const response = await axiosInstance.get('/categories');
                console.log('Fetched categories from /categories:', response.data);
                if (response.data && response.data.length > 0) {
                    setCategories(response.data);
                    return;
                }
            } catch (err) {
                console.log('Could not fetch from /categories either');
                throw new Error('Could not fetch categories from any endpoint');
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            
            // If the API fails, use default categories
            setCategories([
                { id: 1, nev: 'Élelmiszer' },
                { id: 2, nev: 'Ital' },
                { id: 3, nev: 'Háztartási cikk' },
                { id: 4, nev: 'Zöldségek' },
                { id: 5, nev: 'Gyümölcsök' },
                { id: 6, nev: 'Pékáruk' },
                { id: 7, nev: 'Tejtermékek' },
                { id: 8, nev: 'Húsok' },
                { id: 9, nev: 'Egyéb' }
            ]);
        }
    };

    const handleEditClick = (product) => {
        // Convert product to form data
        const formData = {
            nev: product.nev || '',
            leiras: product.leiras || '',
            ar: product.ar || 0,
            keszlet: product.keszlet || 0,
            kategoria_id: product.kategoria_id || '',
            kep: product.kep || ''
        };
        
        setEditForm(formData);
        setEditingProduct(product);
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setEditForm({
            nev: '',
            leiras: '',
            ar: '',
            keszlet: '',
            kategoria_id: '',
            kep: ''
        });
    };

    const handleNewProductInputChange = (e) => {
        const { name, value } = e.target;
        setNewProductForm({
            ...newProductForm,
            [name]: value
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Make sure to convert numeric values properly
            const formData = {
                ...editForm,
                ar: parseInt(editForm.ar, 10), // Ensure ar is an integer
                keszlet: parseInt(editForm.keszlet, 10),
                // Make sure kep is properly formatted
                kep: editForm.kep || null
            };
            
            console.log('Updating product with data:', formData);
            await axiosInstance.put(`/admin/products/${editingProduct.id}`, formData);
            await fetchProducts();
            setEditingProduct(null);
            alert('Termék sikeresen frissítve!');
        } catch (err) {
            console.error('Error updating product:', err);
            setError(err.response?.data?.message || 'Hiba történt a termék módosítása során');
        }
    };

    const handleAddNewProduct = async (e) => {
        e.preventDefault();
        
        try {
            const formData = {
                ...newProductForm,
                kategoria_id: newProductForm.kategoria_id || '1',
                ar: parseInt(newProductForm.ar, 10), // Ensure ar is an integer
                keszlet: parseInt(newProductForm.keszlet, 10),
                // Make sure kep is properly formatted
                kep: newProductForm.kep || null
            };
            
            console.log('Sending product data:', formData);
            const response = await axiosInstance.post('/admin/products', formData);
            console.log('Product added successfully:', response.data);
            
            await fetchProducts();
            setNewProductForm({
                nev: '',
                leiras: '',
                ar: '',
                keszlet: '',
                kategoria_id: '',
                kep: ''
            });
            setShowAddForm(false);
            alert('Termék sikeresen hozzáadva!');
        } catch (err) {
            console.error('Error adding product:', err);
            setError(err.response?.data?.message || 'Hiba történt a termék hozzáadása során');
        }
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`Biztosan törölni szeretné a következő terméket: ${product.nev}?`)) {
            return;
        }

        try {
            await axiosInstance.delete(`/admin/products/${product.id}`);
            await fetchProducts();
            alert('Termék sikeresen törölve!');
        } catch (err) {
            console.error('Error deleting product:', err);
            alert('Hiba történt a termék törlése során');
        }
    };

    // Kép URL kezelése
    const getImageUrl = (imagePath) => {
        if (!imagePath) {
            return defaultKep;
        }
        
        // Ha /uploads kezdetű, akkor a szerver statikus tartalmából szolgáljuk ki
        if (imagePath.startsWith('/uploads/')) {
            return `http://localhost:3001${imagePath}`;
        }

        // Ha 300x200 vagy hasonló méretű kép, akkor használjuk a default képet
        if (imagePath.includes('300x200') || imagePath === '300x200') {
            return defaultKep;
        }
        
        // Egyébként feltételezzük, hogy a /kepek/ mappában van
        try {
            // Próbáljuk meg importálni a megfelelő képet a productNameMap-ből
            const productNameMap = {
                'csirkemell': csirkemellKep,
                'chivas': chivasKep,
                'milka': milkaKep,
                'banan': bananKep,
                'serpenyo': serpenyoKep,
                'alma': almaKep,
                'kenyer': kenyerKep,
                'tej': tejKep,
                'paradicsom': paradicsomKep,
                // 18+ termékek
                'kobanyai0,5': kobanyai05Kep,
                'kobanyai2l': kobanyai2lKep,
                'volgyesfeledesrose': volgyesFeledesRoseKep,
                'volgyesfeledesvorosbor': volgyesFeledesVorosborKep,
                'volgyesszarazfeherbor': volgyesSzarazFeherborKep
            };
            
            // Ellenőrizzük, hogy a kép neve szerepel-e a mappában
            const imageName = imagePath.toLowerCase();
            for (const [name, image] of Object.entries(productNameMap)) {
                if (imageName.includes(name.toLowerCase())) {
                    return image;
                }
            }
            
            // Ha a fájlnév alapján nem találtuk meg, próbáljuk a szerver elérési útját
            return `http://localhost:3001/kepek/Products/${imagePath}`;
        } catch (error) {
            console.error('Error resolving image path:', error);
            return defaultKep;
        }
    };

    // ProductImage component for better image handling
    const ProductImage = ({ product }) => {
        try {
            // First try to use the kep field if available
            if (product && product.kep) {
                const imageSource = getImageUrl(product.kep);
                return <img src={imageSource} alt={product.nev} className="product-image" onError={(e) => { e.target.onerror = null; e.target.src = defaultKep; }} />;
            }
            
            // If no kep field, use default
            return <img src={defaultKep} alt={product.nev || "Termék kép"} className="product-image" />;
        } catch (error) {
            console.error('Error rendering product image:', error);
            return <img src={defaultKep} alt="Termék kép" className="product-image" />;
        }
    };

    const handleImageUpload = async (file, isNewProduct = false) => {
        if (!file) {
            alert('Kérjük, válassz ki egy képet a feltöltéshez!');
            return;
        }

        // Ellenőrizzük a fájl típusát
        if (!file.type.startsWith('image/')) {
            alert('Csak képfájlok tölthetők fel!');
            return;
        }

        // Ellenőrizzük a fájl méretét (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('A fájl mérete nem haladhatja meg az 5MB-ot!');
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(0);

            // Létrehozzuk a FormData objektumot a fájl feltöltéséhez
            const formData = new FormData();
            formData.append('image', file);

            // Feltöltjük a képet
            console.log('Kép feltöltése: ', file.name);
            const response = await axiosInstance.post('/upload/product-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            console.log('Feltöltés válasz: ', response.data);

            // Sikeres feltöltés után frissítjük a megfelelő űrlapot
            if (isNewProduct) {
                setNewProductForm({
                    ...newProductForm,
                    kep: response.data.filePath
                });
            } else {
                setEditForm({
                    ...editForm,
                    kep: response.data.filePath
                });
            }

            alert('A kép sikeresen feltöltve!');
        } catch (error) {
            console.error('Hiba a kép feltöltése során:', error);
            alert('Hiba történt a kép feltöltése során: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleFileSelect = (e, isNewProduct = false) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file, isNewProduct);
        }
    };

    const openFileSelector = (isNewProduct = false) => {
        try {
            if (isNewProduct) {
                if (newFileInputRef && newFileInputRef.current) {
                    newFileInputRef.current.click();
                } else {
                    console.error('newFileInputRef vagy annak current tulajdonsága null');
                }
            } else {
                if (fileInputRef && fileInputRef.current) {
                    fileInputRef.current.click();
                } else {
                    console.error('fileInputRef vagy annak current tulajdonsága null');
                }
            }
        } catch (error) {
            console.error('Hiba a fájl kiválasztó megnyitásakor:', error);
        }
    };

    if (loading && products.length === 0) {
        return <div className="loading">Termékek betöltése...</div>;
    }

    return (
        <div className="admin-product-list">
            <h2>Termékek kezelése</h2>
            
            {/* Rejtett file input elemek a képfeltöltéshez */}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                style={{ display: 'none' }} 
                accept="image/*"
            />
            <input 
                type="file" 
                ref={newFileInputRef} 
                onChange={(e) => handleFileSelect(e, true)} 
                style={{ display: 'none' }} 
                accept="image/*"
            />
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="admin-filters">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Keresés termék neve vagy leírása alapján..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-search-input"
                    />
                </div>
                
                <div className="category-filter">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="admin-category-select"
                    >
                        <option value="">Összes kategória</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id.toString()}>
                                {category.nev}
                            </option>
                        ))}
                    </select>
                </div>
                
                {(searchTerm || selectedCategory) && (
                    <button 
                        className="clear-filters-btn"
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('');
                        }}
                    >
                        Szűrők törlése
                    </button>
                )}
                
                <div className="results-count">
                    {filteredProducts.length} termék található
                </div>
            </div>
            
            <button className="add-button" onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Bezár' : 'Új termék hozzáadása'}
            </button>
            
            {showAddForm && (
                <form onSubmit={handleAddNewProduct} className="add-product-form">
                    <h3>Új termék hozzáadása</h3>
                    
                    <div className="form-group">
                        <label>Név:</label>
                        <input
                            type="text"
                            name="nev"
                            value={newProductForm.nev}
                            onChange={handleNewProductInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Leírás:</label>
                        <textarea
                            name="leiras"
                            value={newProductForm.leiras}
                            onChange={handleNewProductInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Ár (Ft):</label>
                        <input
                            type="number"
                            name="ar"
                            value={newProductForm.ar}
                            onChange={handleNewProductInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Készlet:</label>
                        <input
                            type="number"
                            name="keszlet"
                            value={newProductForm.keszlet}
                            onChange={handleNewProductInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Kategória:</label>
                        <select
                            name="kategoria_id"
                            value={newProductForm.kategoria_id}
                            onChange={handleNewProductInputChange}
                            required
                        >
                            <option value="">Válassz kategóriát</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.nev}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Kép feltöltése:</label>
                        <div className="image-upload-container">
                            <button 
                                type="button" 
                                onClick={() => openFileSelector(true)} 
                                className="upload-button"
                            >
                                <i className="fas fa-upload"></i> Kép kiválasztása
                            </button>
                            {uploading && (
                                <div className="upload-progress">
                                    <div 
                                        className="upload-progress-bar" 
                                        style={{ width: `${uploadProgress}%` }}
                                    >
                                        {uploadProgress}%
                                    </div>
                                </div>
                            )}
                            {newProductForm.kep && (
                                <div className="image-preview">
                                    <img 
                                        src={newProductForm.kep.startsWith('/uploads') ? `http://localhost:3001${newProductForm.kep}` : getImageUrl(newProductForm.kep)} 
                                        alt="Előnézet" 
                                        className="preview-image"
                                    />
                                    <div className="image-path">{newProductForm.kep}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <button type="submit" className="save-button">Mentés</button>
                </form>
            )}
            
            {editingProduct && (
                <form onSubmit={handleSubmit} className="edit-product-form">
                    <h3>Termék szerkesztése</h3>
                    
                    <div className="form-group">
                        <label>Név:</label>
                        <input
                            type="text"
                            name="nev"
                            value={editForm.nev}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Leírás:</label>
                        <textarea
                            name="leiras"
                            value={editForm.leiras}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Ár (Ft):</label>
                        <input
                            type="number"
                            name="ar"
                            value={editForm.ar}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Készlet:</label>
                        <input
                            type="number"
                            name="keszlet"
                            value={editForm.keszlet}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Kategória:</label>
                        <select
                            name="kategoria_id"
                            value={editForm.kategoria_id}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Válassz kategóriát</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.nev}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label>Kép feltöltése:</label>
                        <div className="image-upload-container">
                            <button 
                                type="button" 
                                onClick={openFileSelector} 
                                className="upload-button"
                            >
                                <i className="fas fa-upload"></i> Kép kiválasztása
                            </button>
                            {uploading && (
                                <div className="upload-progress">
                                    <div 
                                        className="upload-progress-bar" 
                                        style={{ width: `${uploadProgress}%` }}
                                    >
                                        {uploadProgress}%
                                    </div>
                                </div>
                            )}
                            {editForm.kep && (
                                <div className="image-preview">
                                    <img 
                                        src={editForm.kep.startsWith('/uploads') ? `http://localhost:3001${editForm.kep}` : getImageUrl(editForm.kep)} 
                                        alt="Előnézet" 
                                        className="preview-image"
                                    />
                                    <div className="image-path">{editForm.kep}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="form-buttons">
                        <button type="submit" className="save-button">Mentés</button>
                        <button type="button" className="cancel-button" onClick={handleCancelEdit}>
                            Mégse
                        </button>
                    </div>
                </form>
            )}
            
            <div className="table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Kép</th>
                            <th>Név</th>
                            <th>Leírás</th>
                            <th>Ár</th>
                            <th>Készlet</th>
                            <th>Kategória</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => {
                                // Find category name
                                const category = categories.find(c => c.id === product.kategoria_id);
                                const categoryName = category ? category.nev : 'Ismeretlen kategória';
                                
                                return (
                                    <tr key={product.id}>
                                        <td>
                                            <ProductImage product={product} />
                                        </td>
                                        <td>{product.nev}</td>
                                        <td className="description-cell">{product.leiras}</td>
                                        <td>{product.ar} Ft</td>
                                        <td>{product.keszlet}</td>
                                        <td>{categoryName}</td>
                                        <td>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEditClick(product)}
                                            >
                                                Szerkesztés
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(product)}
                                            >
                                                Törlés
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-products">Nincsenek termékek</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
