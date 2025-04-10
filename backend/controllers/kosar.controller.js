const db = require("../models");
const Kosar = db.Kosar;
const Termek = db.Termek;
const { Op } = require("sequelize");

// Add item to cart - Completely rewritten for simplicity
exports.addItem = async (req, res) => {
    try {
        // Use a fixed user ID for testing
        const userId = 1;
        console.log('Adding item to cart for user ID:', userId);
        
        // Get product ID and quantity from request
        const { termek_id, mennyiseg } = req.body;
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        
        // Convert termek_id to a number
        const productId = Number(termek_id);
        const quantity = Number(mennyiseg || 1);
        
        console.log('Parsed product ID:', productId, 'Type:', typeof productId);
        
        if (isNaN(productId) || productId <= 0) {
            return res.status(400).json({
                message: "Érvénytelen termék azonosító!"
            });
        }
        
        // Check if product exists - with more detailed logging
        console.log('Searching for product with ID:', productId);
        try {
            const product = await Termek.findByPk(productId);
            console.log('Found product:', product ? {
                id: product.id,
                name: product.nev,
                price: product.ar
            } : 'Product not found');
            
            if (!product) {
                console.error(`Product with ID ${productId} not found`);
                // Let's try to find all products to see what's available
                const allProducts = await Termek.findAll();
                console.log('Available products:', allProducts.map(p => ({ id: p.id, name: p.nev })));
                
                return res.status(404).json({
                    message: "A megadott termék nem található!"
                });
            }
            
            // Check if item already exists in cart
            let cartItem = await Kosar.findOne({
                where: {
                    felhasznalo_id: userId,
                    termek_id: productId
                }
            });
            
            if (cartItem) {
                // Update quantity if item already exists
                cartItem.mennyiseg += quantity;
                await cartItem.save();
                console.log('Updated cart item:', {
                    id: cartItem.id,
                    productId: cartItem.termek_id,
                    quantity: cartItem.mennyiseg
                });
            } else {
                // Create new cart item
                cartItem = await Kosar.create({
                    felhasznalo_id: userId,
                    termek_id: productId,
                    mennyiseg: quantity
                });
                console.log('Created new cart item:', {
                    id: cartItem.id,
                    productId: cartItem.termek_id,
                    quantity: cartItem.mennyiseg
                });
            }
            
            res.status(200).json({
                message: "Termék sikeresen hozzáadva a kosárhoz!",
                cartItem
            });
        } catch (error) {
            console.error('Error finding product:', error);
            return res.status(500).json({
                message: "Hiba történt a termék keresése során!",
                error: error.message
            });
        }
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({
            message: "Hiba történt a termék kosárhoz adása során!",
            error: error.message
        });
    }
};

// Get cart items for a user - Completely rewritten for simplicity
exports.findAll = async (req, res) => {
    try {
        // Use a fixed user ID for testing
        const userId = 1;
        console.log('Loading cart for user ID:', userId);
        
        // Get all cart items for the user
        const cartItems = await Kosar.findAll({
            where: { felhasznalo_id: userId }
        });
        
        console.log(`Found ${cartItems.length} cart items`);
        
        if (cartItems.length === 0) {
            return res.json([]);
        }
        
        // Get all product IDs from cart items
        const productIds = cartItems.map(item => Number(item.termek_id));
        console.log('Product IDs in cart:', productIds);
        
        // Get all products in a single query
        const products = await Termek.findAll({
            where: { id: { [Op.in]: productIds } }
        });
        
        console.log(`Found ${products.length} products`);
        
        // Create a map of products by ID for easy lookup
        const productMap = {};
        products.forEach(product => {
            productMap[product.id] = product;
        });
        
        // Combine cart items with product details
        const result = cartItems.map(item => {
            const product = productMap[item.termek_id] || null;
            if (!product) {
                console.log(`Warning: Product with ID ${item.termek_id} not found for cart item ${item.id}`);
                return null;
            }
            
            return {
                id: item.id,
                felhasznalo_id: item.felhasznalo_id,
                termek_id: item.termek_id,
                mennyiseg: item.mennyiseg,
                termek: {
                    id: product.id,
                    nev: product.nev,
                    leiras: product.leiras,
                    ar: product.ar,
                    kep: product.kep,
                    keszlet: product.keszlet,
                    kategoria_id: product.kategoria_id,
                    aktiv: product.aktiv
                }
            };
        }).filter(item => item !== null); // Remove null items
        
        return res.json(result);
        
    } catch (error) {
        console.error('Error in findAll:', error);
        return res.status(500).json({
            message: "Hiba történt a kosár lekérése során.",
            error: error.message
        });
    }
};

// Update item quantity - Simplified
exports.updateQuantity = async (req, res) => {
    try {
        const { id } = req.params;
        const { mennyiseg } = req.body;
        const userId = 1; // Fixed user ID for testing
        
        console.log(`Updating quantity for cart item ${id} to ${mennyiseg}`);
        
        // Convert to numbers
        const cartItemId = Number(id);
        const quantity = Number(mennyiseg);
        
        if (isNaN(cartItemId) || isNaN(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Érvénytelen azonosító vagy mennyiség!"
            });
        }
        
        // Find the cart item
        const cartItem = await Kosar.findOne({
            where: {
                id: cartItemId,
                felhasznalo_id: userId
            }
        });
        
        if (!cartItem) {
            return res.status(404).json({
                message: "A kosár elem nem található!"
            });
        }
        
        // Update quantity
        cartItem.mennyiseg = quantity;
        await cartItem.save();
        
        return res.json({
            message: "A mennyiség sikeresen frissítve!",
            item: cartItem
        });
        
    } catch (error) {
        console.error('Error in updateQuantity:', error);
        return res.status(500).json({
            message: "Hiba történt a mennyiség módosítása során.",
            error: error.message
        });
    }
};

// Remove item from cart - Simplified
exports.removeItem = async (req, res) => {
    try {
        const itemId = req.params.id;
        console.log('Removing item with ID:', itemId);
        
        // Find the cart item
        const cartItem = await Kosar.findByPk(itemId);
        
        if (!cartItem) {
            return res.status(404).json({
                message: "A kosár elem nem található!"
            });
        }
        
        // Delete the cart item
        await cartItem.destroy();
        
        return res.status(200).json({
            message: "Termék sikeresen törölve a kosárból!"
        });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return res.status(500).json({
            message: "Hiba történt a termék törlése során!",
            error: error.message
        });
    }
};

// Clear all items from the cart for a user
exports.clearCart = async (req, res) => {
    try {
        // Use a fixed user ID for testing or get from token
        const userId = req.userId || 1;
        console.log('Clearing cart for user ID:', userId);
        
        // Delete all cart items for the user
        await Kosar.destroy({
            where: { felhasznalo_id: userId }
        });
        
        return res.status(200).json({
            message: "A kosár sikeresen kiürítve!"
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        return res.status(500).json({
            message: "Hiba történt a kosár ürítése során!",
            error: error.message
        });
    }
};
