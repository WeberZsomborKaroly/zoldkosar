
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();


app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
app.use('/kepek', express.static(path.join(__dirname, 'public', 'kepek')));


const inMemoryDB = {
    termekek: [
        { id: 1, nev: 'Példa termék 1', leiras: 'Ez egy példa termék leírás', ar: 1990, kep: 'product1.jpg', keszlet: 10, kategoria_id: 1, aktiv: 1 },
        { id: 2, nev: 'Példa termék 2', leiras: 'Ez egy másik példa termék', ar: 2990, kep: 'product2.jpg', keszlet: 5, kategoria_id: 1, aktiv: 1 },
        { id: 3, nev: 'Példa termék 3', leiras: 'Harmadik példa termék', ar: 3990, kep: 'product3.jpg', keszlet: 15, kategoria_id: 2, aktiv: 1 }
    ],
    kategoriak: [
        { id: 1, nev: 'Kategória 1' },
        { id: 2, nev: 'Kategória 2' }
    ],
    felhasznalok: [],
    rendelesek: [],
    temporary_cart: []
};


app.get('/api/termekek', (req, res) => {
    try {
        const products = inMemoryDB.termekek.filter(product => product.aktiv === 1);
        console.log('Fetched products:', products);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error loading products' });
    }
});

app.get('/api/products', (req, res) => {
    try {
        const products = inMemoryDB.termekek.filter(product => product.aktiv === 1);
        console.log('Fetched products:', products);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error loading products' });
    }
});


app.get('/api/categories', (req, res) => {
    try {
        res.json(inMemoryDB.kategoriak);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Error loading categories' });
    }
});


app.get('/api/cart', (req, res) => {
    try {
        const cartId = req.cookies?.cartId;
        console.log('Getting cart items for cartId:', cartId);
        
        if (!cartId) {
            return res.json([]);
        }

        const cartItems = inMemoryDB.temporary_cart
            .filter(item => item.cart_id === cartId)
            .map(item => {
                const product = inMemoryDB.termekek.find(p => p.id === item.termek_id);
                return {
                    id: item.id,
                    termek_id: item.termek_id,
                    quantity: item.mennyiseg,
                    name: product?.nev || 'Unknown Product',
                    price: product?.ar || 0,
                    image: product?.kep || '',
                    stock: product?.keszlet || 0
                };
            });

        console.log('Found cart items:', cartItems);
        res.json(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Hiba történt a kosár betöltése során!' });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
