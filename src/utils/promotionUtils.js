/**
 * 
 */

/**
 * 
 * @returns {Promise<Array>} 
 */
export const fetchPromotions = async (axiosInstance) => {
    try {
      
        try {
            const response = await axiosInstance.get('/admin/promotions');
            if (response.data) {
                console.log('Fetched promotions from API:', response.data);
                
              
                const processedPromotions = response.data.map(promo => ({
                    ...promo,
                    product_id: typeof promo.product_id === 'string' ? Number(promo.product_id) : promo.product_id,
                    discount_percent: typeof promo.discount_percent === 'string' ? Number(promo.discount_percent) : promo.discount_percent
                }));
                
                return processedPromotions;
            }
        } catch (error) {
            console.log('Could not fetch promotions from API, using localStorage data');
        }
        
     
        const storedPromotions = localStorage.getItem('promotions');
        if (storedPromotions) {
            const parsedPromotions = JSON.parse(storedPromotions);
            
            
            const processedPromotions = parsedPromotions.map(promo => ({
                ...promo,
                product_id: typeof promo.product_id === 'string' ? Number(promo.product_id) : promo.product_id,
                discount_percent: typeof promo.discount_percent === 'string' ? Number(promo.discount_percent) : promo.discount_percent
            }));
            
            return processedPromotions;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching promotions:', error);
        return [];
    }
};

/**
 * 
 * @param {number|string} productId 
 * @param {Array} promotions 
 * @returns {Object|null} 
 */
export const getActivePromotion = (productId, promotions) => {
    if (!promotions || promotions.length === 0 || productId === undefined || productId === null) {
        console.log('No promotions available or invalid productId:', productId);
        return null;
    }
    
   
    const numericProductId = typeof productId === 'string' ? Number(productId) : productId;
    if (isNaN(numericProductId)) {
        console.log('Invalid product ID (not a number):', productId);
        return null;
    }
    
    const now = new Date();
    
    
    console.log('Looking for promotions for product ID:', numericProductId);
    console.log('Available promotions:', promotions);
    
    const activePromotion = promotions.find(promo => {
        
        const promoProductId = typeof promo.product_id === 'string' ? Number(promo.product_id) : promo.product_id;
        
        const startDate = new Date(promo.start_date);
        const endDate = new Date(promo.end_date);
        
        console.log(`Checking promo: product_id=${promoProductId}, start=${startDate}, end=${endDate}, now=${now}`);
        
        return (
            promoProductId === numericProductId && 
            startDate <= now && 
            endDate >= now
        );
    });
    
    console.log('Active promotion found:', activePromotion);
    return activePromotion;
};

/**
 * 
 * @param {Object} product 
 * @param {Array} promotions 
 * @returns {number} 
 */
export const getCurrentPrice = (product, promotions) => {
    if (!product) {
        console.log('Invalid product object (null or undefined)');
        return 0;
    }
    
    if (product.id === undefined || product.id === null || product.ar === undefined || product.ar === null) {
        console.log('Invalid product object (missing id or ar):', product);
        return 0;
    }
    
   
    const originalPrice = typeof product.ar === 'string' ? Number(product.ar) : product.ar;
    if (isNaN(originalPrice)) {
        console.log('Invalid product price (not a number):', product.ar);
        return 0;
    }
    
    const activePromotion = getActivePromotion(product.id, promotions);
    if (activePromotion) {
        const discountPercent = typeof activePromotion.discount_percent === 'string' ? 
            Number(activePromotion.discount_percent) : activePromotion.discount_percent;
            
        if (isNaN(discountPercent)) {
            console.log('Invalid discount percent (not a number):', activePromotion.discount_percent);
            return originalPrice;
        }
        
        const discountedPrice = Math.round(originalPrice * (1 - discountPercent / 100));
        console.log(`Calculated discounted price: original=${originalPrice}, discount=${discountPercent}%, final=${discountedPrice}`);
        return discountedPrice;
    }
    
    return originalPrice;
};

/**
 * 
 * @param {Object} product 
 * @param {Array} promotions 
 * @returns {Object} 
 */
export const enrichProductWithPromotion = (product, promotions) => {
    if (!product) return product;
    
    const activePromotion = getActivePromotion(product.id, promotions);
    const currentPrice = getCurrentPrice(product, promotions);
    
    return {
        ...product,
        activePromotion: activePromotion || null,
        discountPercent: activePromotion ? activePromotion.discount_percent : null,
        originalPrice: product.ar,
        currentPrice: currentPrice
    };
};
