import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Products from './components/Products';
import Login from './components/Login';
import Registration from './components/Registration';
import Cart from './components/cart/Cart';
import AdminDashboard from './components/admin/AdminDashboard';
import RecipeSearch from './components/RecipeSearch';
import Profile from './components/profile/Profile';
import About from './components/About';
import './App.css';

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    return (
        <Router>
            <div className="App">
                <Navbar user={user} setUser={setUser} />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Home user={user} />} />
                        <Route path="/products" element={<Products user={user} />} />
                        <Route path="/login" element={<Login setUser={setUser} />} />
                        <Route path="/register" element={<Registration setUser={setUser} />} />
                        <Route path="/cart" element={<Cart user={user} />} />
                        <Route path="/recipes" element={<RecipeSearch />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/admin/*" element={<AdminDashboard />} />
                        <Route path="*" element={<Home user={user} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
