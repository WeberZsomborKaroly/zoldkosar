import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { useLocation, useSearchParams } from 'react-router-dom';
import { fetchPromotions, getActivePromotion, getCurrentPrice } from '../utils/promotionUtils';
import './Products.css';

// Import product images
import csirkemellKep from '../kepek/Products/csirkemell.png';
import chivasKep from '../kepek/Products/chivas.png';
import milkaKep from '../kepek/Products/milkacsoki.png';
import bananKep from '../kepek/Products/banan.png';
import serpenyoKep from '../kepek/Products/serpenyo.png';
import almaKep from '../kepek/Products/alma.png';
import kenyerKep from '../kepek/Products/felbarna_kenyer.png';
import defaultKep from '../kepek/Products/default.png';

// Import 18+ product images
import kobanyai05Kep from '../kepek/Products/18+/kobanyai0,5.png';
import kobanyai2lKep from '../kepek/Products/18+/kobanyai2l.png';
import volgyesFeledesRoseKep from '../kepek/Products/18+/volgyesfeledesrose.png';
import volgyesFeledesVorosborKep from '../kepek/Products/18+/volgyesfeledesvorosbor.png';
import volgyesSzarazFeherborKep from '../kepek/Products/18+/volgyesszarazfeherbor.png';

// Import sweet product images
import balatonEtcsokisKep from '../kepek/Products/edessegek/balatonetcsokis.png';
import hariboKep from '../kepek/Products/edessegek/haribo.png';
import kinderBuenoKep from '../kepek/Products/edessegek/kinder bueno.png';
import sportszeletKep from '../kepek/Products/edessegek/sportszelet.png';

// Import food product images
import csirkecombKep from '../kepek/Products/etel/csirkecombkg.png';
import csirkeszarnyKep from '../kepek/Products/etel/csirkeszarnykg.png';
import daralthusKep from '../kepek/Products/etel/daralthus500g.png';
import kolbaszKep from '../kepek/Products/etel/kolbasz200g.png';
import marhahatszinKep from '../kepek/Products/etel/marhahatszinkg.png';
import pulykamellKep from '../kepek/Products/etel/pulykamellkg.png';
import serteskarajKep from '../kepek/Products/etel/serteskarajkg.png';
import sertesoldalasKep from '../kepek/Products/etel/sertesoldalaskg.png';
import szalamiKep from '../kepek/Products/etel/szalami100g.png';

// Import fruit product images
import ananaszKep from '../kepek/Products/gyumolcsok/ananasz.png';
import citromKep from '../kepek/Products/gyumolcsok/citrom.png';
import szederKep from '../kepek/Products/gyumolcsok/image-removebg-preview (21).png';
import narancsKep from '../kepek/Products/gyumolcsok/narancs.png';

// Import household product images
import almaleKep from '../kepek/Products/haztartasi/almale1l.png';
import asvanyviz05lKep from '../kepek/Products/haztartasi/asvanyviz05l.png';
import asvanyviz15lKep from '../kepek/Products/haztartasi/asvanyviz15l.png';
import cocacolaKep from '../kepek/Products/haztartasi/cocacola05l.png';
import fantaKep from '../kepek/Products/haztartasi/fanta05l.png';
import narancsleKep from '../kepek/Products/haztartasi/narancsle1l.png';
import spriteKep from '../kepek/Products/haztartasi/sprite05l.png';
import tejKep from '../kepek/Products/tejtermekek/tej1l.png';

// Import non-food product images
import aquafreshFogkremKep from '../kepek/Products/non-food/aquafreshfogkrem.png';
import fogkefeKep from '../kepek/Products/non-food/fogkefe.png';
import poharKep from '../kepek/Products/non-food/pohar.png';
import tanyerKep from '../kepek/Products/non-food/tanyer.png';

// Import bakery product images
import bagettKep from '../kepek/Products/pekaruk/bagett.png';
import briosKep from '../kepek/Products/pekaruk/brios.png';
import croissantKep from '../kepek/Products/pekaruk/croissant.png';
import kakaoscsigaKep from '../kepek/Products/pekaruk/kakaoscsiga.png';
import kifliKep from '../kepek/Products/pekaruk/kifli.png';
import pogacsaKep from '../kepek/Products/pekaruk/pogacsa.png';
import rozsKenyerKep from '../kepek/Products/pekaruk/rozskenyer.png';
import turosBatyuKep from '../kepek/Products/pekaruk/turosbatyu.png';
import zsemleKep from '../kepek/Products/pekaruk/zsemle.png';

// Import dairy product images
import joghurtKep from '../kepek/Products/tejtermekek/joghurt150g.png';
import kefirKep from '../kepek/Products/tejtermekek/kefir175g.png';
import mascarponeKep from '../kepek/Products/tejtermekek/mascarpone250g.png';
import mozzarellaKep from '../kepek/Products/tejtermekek/mozzarella125g.png';
import parmezanKep from '../kepek/Products/tejtermekek/parmezan.png';
import sajtKep from '../kepek/Products/tejtermekek/sajt200g.png';
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

const Products = ({ user }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [promotions, setPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [searchParams] = useSearchParams();

    // Function to get the correct image based on product name
    const getProductImage = (productName, imagePath) => {
        // If we have an image path from the database, check if it matches our imported images
        if (imagePath) {
            if (imagePath === 'almale1l.png') return almaleKep;
            if (imagePath === 'narancsle1l.png') return narancsleKep;
            if (imagePath === 'asvanyviz05l.png') return asvanyviz05lKep;
            if (imagePath === 'asvanyviz15l.png') return asvanyviz15lKep;
            if (imagePath === 'cocacola05l.png') return cocacolaKep;
            if (imagePath === 'fanta05l.png') return fantaKep;
            if (imagePath === 'sprite05l.png') return spriteKep;
            
            // Check for sweet product images
            if (imagePath === 'balatonetcsokis.png') return balatonEtcsokisKep;
            if (imagePath === 'haribo.png') return hariboKep;
            if (imagePath === 'kinder bueno.png') return kinderBuenoKep;
            if (imagePath === 'sportszelet.png') return sportszeletKep;
            
            // Check for fruit product images
            if (imagePath === 'ananasz.png') return ananaszKep;
            if (imagePath === 'citrom.png') return citromKep;
            if (imagePath === 'image-removebg-preview (21).png') return szederKep;
            if (imagePath === 'narancs.png') return narancsKep;
            
            // Check for food product images
            if (imagePath === 'csirkecombkg.png') return csirkecombKep;
            if (imagePath === 'csirkeszarnykg.png') return csirkeszarnyKep;
            if (imagePath === 'daralthus500g.png') return daralthusKep;
            if (imagePath === 'kolbasz200g.png') return kolbaszKep;
            if (imagePath === 'marhahatszinkg.png') return marhahatszinKep;
            if (imagePath === 'pulykamellkg.png') return pulykamellKep;
            if (imagePath === 'serteskarajkg.png') return serteskarajKep;
            if (imagePath === 'sertesoldalaskg.png') return sertesoldalasKep;
            if (imagePath === 'szalami100g.png') return szalamiKep;
            
            // Check for non-food product images
            if (imagePath === 'aquafreshfogkrem.png') return aquafreshFogkremKep;
            if (imagePath === 'fogkefe.png') return fogkefeKep;
            if (imagePath === 'pohar.png') return poharKep;
            if (imagePath === 'tanyer.png') return tanyerKep;
            
            // Check for bakery product images
            if (imagePath === 'bagett.png') return bagettKep;
            if (imagePath === 'brios.png') return briosKep;
            if (imagePath === 'croissant.png') return croissantKep;
            if (imagePath === 'kakaoscsiga.png') return kakaoscsigaKep;
            if (imagePath === 'kifli.png') return kifliKep;
            if (imagePath === 'pogacsa.png') return pogacsaKep;
            if (imagePath === 'rozskenyer.png') return rozsKenyerKep;
            if (imagePath === 'turosbatyu.png') return turosBatyuKep;
            if (imagePath === 'zsemle.png') return zsemleKep;
            
            // Check for dairy product images
            if (imagePath === 'joghurt150g.png') return joghurtKep;
            if (imagePath === 'kefir175g.png') return kefirKep;
            if (imagePath === 'mascarpone250g.png') return mascarponeKep;
            if (imagePath === 'mozzarella125g.png') return mozzarellaKep;
            if (imagePath === 'parmezan.png') return parmezanKep;
            if (imagePath === 'sajt200g.png') return sajtKep;
            if (imagePath === 'tej1l.png') return tejKep;
            if (imagePath === 'tejfol330g.png') return tejfolKep;
            if (imagePath === 'turo250g.png') return turoKep;
            if (imagePath === 'vaj100g.png') return vajKep;
            
            // Check for vegetable product images
            if (imagePath === 'brokkoli.png') return brokkoliKep;
            if (imagePath === 'burgonya.png') return burgonyaKep;
            if (imagePath === 'cukkini.png') return cukkiniKep;
            if (imagePath === 'fokhagyma.png') return fokhagymaKep;
            if (imagePath === 'hagyma.png') return hagymaKep;
            if (imagePath === 'padlizsan.png') return padlizsanKep;
            if (imagePath === 'paprika.png') return paprikaKep;
            if (imagePath === 'paradicsom.png') return paradicsomKep;
            if (imagePath === 'repa.png') return repaKep;
            if (imagePath === 'salata.png') return salataKep;
            if (imagePath === 'uborka.png') return uborkaKep;
            
            return defaultKep;
        }
        
        // Fallback to name-based matching if image path doesn't match
        const name = productName.toLowerCase();
        if (name.includes('csirkemell')) return csirkemellKep;
        if (name.includes('chivas')) return chivasKep;
        if (name.includes('milka')) return milkaKep;
        if (name.includes('banán')) return bananKep;
        if (name.includes('serpenyő')) return serpenyoKep;
        if (name.includes('alma')) return almaKep;
        if (name.includes('kenyér')) return kenyerKep;
        if (name.includes('tej')) return tejKep;
        
        // 18+ products
        if (name.includes('kőbányai') && name.includes('0.5')) return kobanyai05Kep;
        if (name.includes('kőbányai') && name.includes('2l')) return kobanyai2lKep;
        if (name.includes('völgyes') && name.includes('félédes') && name.includes('rozé')) return volgyesFeledesRoseKep;
        if (name.includes('völgyes') && name.includes('félédes') && name.includes('vörösbor')) return volgyesFeledesVorosborKep;
        if (name.includes('völgyes') && name.includes('száraz') && name.includes('fehérbor')) return volgyesSzarazFeherborKep;
        
        // Sweet products
        if (name.includes('balaton') && name.includes('étcsokoládés')) return balatonEtcsokisKep;
        if (name.includes('haribo')) return hariboKep;
        if (name.includes('kinder') && name.includes('bueno')) return kinderBuenoKep;
        if (name.includes('sport') && name.includes('szelet')) return sportszeletKep;
        
        // Food products
        if (name.includes('csirkecomb')) return csirkecombKep;
        if (name.includes('csirkeszárny')) return csirkeszarnyKep;
        if (name.includes('darált') && name.includes('hús')) return daralthusKep;
        if (name.includes('kolbász')) return kolbaszKep;
        if (name.includes('marha') && name.includes('hátszín')) return marhahatszinKep;
        if (name.includes('pulykamell')) return pulykamellKep;
        if (name.includes('sertéskaraj')) return serteskarajKep;
        if (name.includes('sertésoldalas')) return sertesoldalasKep;
        if (name.includes('szalámi')) return szalamiKep;
        
        // Fruit products
        if (name.includes('ananász')) return ananaszKep;
        if (name.includes('citrom')) return citromKep;
        if (name.includes('szeder')) return szederKep;
        if (name.includes('narancs')) return narancsKep;
        
        // Household products
        if (name.includes('almalé')) return almaleKep;
        if (name.includes('ásványvíz') && name.includes('0.5')) return asvanyviz05lKep;
        if (name.includes('ásványvíz') && name.includes('1.5')) return asvanyviz15lKep;
        if (name.includes('coca-cola')) return cocacolaKep;
        if (name.includes('fanta')) return fantaKep;
        if (name.includes('narancslé')) return narancsleKep;
        if (name.includes('sprite')) return spriteKep;
        
        // Non-food products
        if (name.includes('aquafresh') || name.includes('fogkrém')) return aquafreshFogkremKep;
        if (name.includes('fogkefe')) return fogkefeKep;
        if (name.includes('pohár')) return poharKep;
        if (name.includes('tányér')) return tanyerKep;
        
        // Bakery products
        if (name.includes('bagett')) return bagettKep;
        if (name.includes('briós')) return briosKep;
        if (name.includes('croissant')) return croissantKep;
        if (name.includes('kakaós') && name.includes('csiga')) return kakaoscsigaKep;
        if (name.includes('kifli')) return kifliKep;
        if (name.includes('pogácsa')) return pogacsaKep;
        if (name.includes('rozskenyér')) return rozsKenyerKep;
        if (name.includes('túrós') && name.includes('batyu')) return turosBatyuKep;
        if (name.includes('zsemle')) return zsemleKep;
        
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
        
        return defaultKep;
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products from API...');
                const response = await axiosInstance.get('/termekek');
                console.log('Fetched products:', response.data);
                
                // Log each product's ID to see what's happening
                response.data.forEach(product => {
                    console.log(`Product: ${product.nev}, ID: ${product.id}, Type: ${typeof product.id}`);
                });
                
                setProducts(response.data);
                setFilteredProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setMessage({
                    type: 'error',
                    text: error.message
                });
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                console.log('Fetching categories from API...');
                // Először próbáljuk meg az új végpontot
                try {
                    const response = await axiosInstance.get('/kategoriak');
                    console.log('Fetched categories from /kategoriak:', response.data);
                    if (response.data && response.data.length > 0) {
                        setCategories(response.data);
                        return;
                    }
                } catch (err) {
                    console.log('Could not fetch from /kategoriak, trying /categories');
                }
                
                // Ha az új végpont nem működik, próbáljuk a régit
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
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Fallback kategóriák, ha nem sikerül lekérni
                setCategories([
                    { id: 1, nev: "Élelmiszer" },
                    { id: 2, nev: "Ital" },
                    { id: 3, nev: "Háztartási cikk" },
                    { id: 4, nev: "Zöldségek" },
                    { id: 5, nev: "Gyümölcsök" },
                    { id: 6, nev: "Pékáruk" },
                    { id: 7, nev: "Tejtermékek" },
                    { id: 8, nev: "Húsok" },
                    { id: 9, nev: "Egyéb" }
                ]);
            }
        };

        const loadPromotions = async () => {
            const promos = await fetchPromotions(axiosInstance);
            setPromotions(promos);
        };

        fetchProducts();
        fetchCategories();
        loadPromotions();
    }, []);

    // URL paraméter feldolgozása a kategória szűréshez
    useEffect(() => {
        const categoryParam = searchParams.get('kategoria');
        if (categoryParam) {
            console.log('Category param found:', categoryParam);
            // Keressük meg a kategória ID-t a név alapján
            if (categories.length > 0) {
                const category = categories.find(cat => 
                    cat.nev.toLowerCase() === categoryParam.toLowerCase() ||
                    cat.nev.toLowerCase().includes(categoryParam.toLowerCase())
                );
                
                if (category) {
                    console.log('Setting category filter to:', category.id);
                    setSelectedCategory(category.id.toString());
                } else {
                    console.log('Category not found in available categories');
                }
            }
        }
    }, [searchParams, categories]);

    // Filter products when search term or category changes
    useEffect(() => {
        if (products.length > 0) {
            let filtered = [...products];
            
            // Filter by search term
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                filtered = filtered.filter(product => 
                    product.nev.toLowerCase().includes(searchLower) || 
                    (product.leiras && product.leiras.toLowerCase().includes(searchLower))
                );
            }
            
            // Filter by category
            if (selectedCategory) {
                filtered = filtered.filter(product => 
                    product.kategoria_id === parseInt(selectedCategory)
                );
            }
            
            setFilteredProducts(filtered);
        }
    }, [searchTerm, selectedCategory, products]);

    // Ellenőrzi, hogy egy termékhez van-e aktív akció
    const getActivePromotion = (productId) => {
        if (!promotions || promotions.length === 0) return null;
        
        const now = new Date();
        return promotions.find(promo => 
            promo.product_id === productId && 
            new Date(promo.start_date) <= now && 
            new Date(promo.end_date) >= now
        );
    };

    // Kiszámolja a termék aktuális árát (eredeti vagy akciós)
    const getCurrentPrice = (product, promotions) => {
        const activePromotion = getActivePromotion(product.id);
        if (activePromotion) {
            return Math.round(product.ar * (1 - activePromotion.discount_percent / 100));
        }
        return product.ar;
    };

    const handleAddToCart = async (product) => {
        try {
            // Get the current price (original or discounted)
            const currentPrice = getCurrentPrice(product, promotions);
            
            // Log detailed product information for debugging
            console.log('Adding product to cart:', {
                id: product.id,
                name: product.nev,
                originalPrice: product.ar,
                currentPrice: currentPrice
            });
            
            // Make sure we're sending the correct product ID as a number
            const productId = Number(product.id);
            console.log('Product ID type before conversion:', typeof product.id);
            console.log('Product ID after conversion:', productId, 'Type:', typeof productId);
            
            if (isNaN(productId) || productId <= 0) {
                console.error('Invalid product ID:', product.id);
                setMessage({
                    type: 'error',
                    text: 'Érvénytelen termék azonosító!'
                });
                setTimeout(() => setMessage(null), 3000);
                return;
            }
            
            // Send the product ID as a number to ensure correct type handling
            // Also send the current price (discounted if applicable)
            const response = await axiosInstance.post('/kosar/add', {
                termek_id: productId,
                mennyiseg: 1,
                ar: currentPrice // Send the current price to the backend
            });
            
            console.log('Server response:', response.data);
            
            setMessage({
                type: 'success',
                text: `A termék (${product.nev}) sikeresen hozzáadva a kosárhoz!`
            });
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
            console.error('Error response:', error.response?.data);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Hiba történt a kosárhoz adás során!'
            });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleShowDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
    };

    if (loading) {
        return <div className="loading">Termékek betöltése...</div>;
    }

    return (
        <div className="products-container">
            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
            
            <div className="filter-container">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Keresés termékek között..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                </div>
                
                <div className="category-filter">
                    <select 
                        value={selectedCategory} 
                        onChange={handleCategoryChange}
                        className="category-select"
                    >
                        <option value="">Összes kategória</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.nev}
                            </option>
                        ))}
                    </select>
                </div>
                
                {(searchTerm || selectedCategory) && (
                    <button onClick={clearFilters} className="clear-filters-btn">
                        Szűrők törlése
                    </button>
                )}
                
                <div className="results-count">
                    {filteredProducts.length} termék található
                </div>
            </div>
            
            <div className="products-grid">
                {filteredProducts.map((product) => {
                    const activePromotion = getActivePromotion(product.id);
                    const currentPrice = getCurrentPrice(product, promotions);
                    
                    return (
                        <div key={product.id} className="product-card">
                            {activePromotion && (
                                <div className="product-discount-badge">
                                    -{activePromotion.discount_percent}%
                                </div>
                            )}
                            <div className="product-image-container">
                                <img 
                                    src={getProductImage(product.nev, product.kep)} 
                                    alt={product.nev} 
                                    className="product-img"
                                />
                            </div>
                            <div className="product-info">
                                <h3>{product.nev || 'Ismeretlen termék'}</h3>
                                <p className="description">{product.leiras || 'Nincs leírás'}</p>
                                {activePromotion ? (
                                    <div className="price-container">
                                        <p className="original-price">{product.ar ? `${product.ar} Ft` : 'Ár nem elérhető'}</p>
                                        <p className="discount-price">{currentPrice ? `${currentPrice} Ft` : 'Ár nem elérhető'}</p>
                                    </div>
                                ) : (
                                    <p className="price">{product.ar ? `${product.ar} Ft` : 'Ár nem elérhető'}</p>
                                )}
                                <p className="stock">Készlet: {product.keszlet || 0} db</p>
                                <div className="product-buttons">
                                    <button onClick={() => handleShowDetails({
                                        ...product,
                                        discountedPrice: activePromotion ? currentPrice : null,
                                        discountPercent: activePromotion ? activePromotion.discount_percent : null
                                    })} className="details-button">
                                        Részletek
                                    </button>
                                    <button 
                                        onClick={() => handleAddToCart(product)} 
                                        className="cart-button"
                                        disabled={!product.keszlet || product.keszlet <= 0}
                                    >
                                        <i className="fas fa-shopping-cart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showModal && selectedProduct && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedProduct.nev || 'Ismeretlen termék'}</h2>
                            <button className="modal-close" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-image-container">
                                <img 
                                    src={getProductImage(selectedProduct.nev, selectedProduct.kep)} 
                                    alt={selectedProduct.nev} 
                                    className="modal-image"
                                />
                            </div>
                            <div className="modal-details">
                                <h3>Termék információk</h3>
                                <p className="modal-description">{selectedProduct.leiras || 'Nincs leírás'}</p>
                                <div className="modal-info-grid">
                                    <div className="info-item">
                                        <span className="label">Ár</span>
                                        {selectedProduct.discountedPrice ? (
                                            <div className="value price-container">
                                                <span className="original-price">{selectedProduct.ar} Ft</span>
                                                <span className="discount-price">{selectedProduct.discountedPrice} Ft</span>
                                                <span className="discount-text">-{selectedProduct.discountPercent}%</span>
                                            </div>
                                        ) : (
                                            <span className="value">{selectedProduct.ar ? `${selectedProduct.ar} Ft` : 'Ár nem elérhető'}</span>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <span className="label">Készleten</span>
                                        <span className="value">{selectedProduct.keszlet || 0} db</span>
                                    </div>
                                    {selectedProduct.kategoria_id && (
                                        <div className="info-item">
                                            <span className="label">Kategória</span>
                                            <span className="value">
                                                {categories.find(c => c.id === selectedProduct.kategoria_id)?.nev || 'Ismeretlen kategória'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-actions">
                                    <button 
                                        onClick={() => { handleAddToCart(selectedProduct); closeModal(); }} 
                                        className="add-to-cart-button"
                                        disabled={!selectedProduct.keszlet || selectedProduct.keszlet <= 0}
                                    >
                                        Kosárba
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Products;
