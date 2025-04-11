import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserList from './UserList';
import ProductList from './ProductList';
import OrderList from './OrderList';
import CouponList from './CouponList';
import CategoryList from './CategoryList';
import './AdminPanel.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [stats, setStats] = useState({
        productCount: 0,
        orderCount: 0,
        userCount: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                throw new Error('Nincs bejelentkezve!');
            }
            const user = JSON.parse(userStr);
            const token = user.accessToken;

            const response = await axios.get('http://localhost:3001/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setStats(response.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    return (
        <div className="admin-panel">
            <h2 style={{ color: 'white' }}>Admin Panel</h2>
            
            
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Termékek</h3>
                    <p>{stats.productCount} db</p>
                </div>
                <div className="stat-card">
                    <h3>Rendelések</h3>
                    <p>{stats.orderCount} db</p>
                </div>
                <div className="stat-card">
                    <h3>Felhasználók</h3>
                    <p>{stats.userCount} fő</p>
                </div>
                <div className="stat-card">
                    <h3>Összes bevétel</h3>
                    <p>{stats.totalRevenue.toLocaleString()} Ft</p>
                </div>
            </div>

           
            <div className="admin-tabs">
                <button 
                    className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Felhasználók
                </button>
                <button 
                    className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >
                    Termékek
                </button>
                <button 
                    className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => setActiveTab('categories')}
                >
                    Kategóriák
                </button>
                <button 
                    className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    Rendelések
                </button>
                <button 
                    className={`tab-button ${activeTab === 'coupons' ? 'active' : ''}`}
                    onClick={() => setActiveTab('coupons')}
                >
                    Kuponok
                </button>
            </div>

          
            <div className="tab-content">
                {activeTab === 'users' && <UserList />}
                {activeTab === 'products' && <ProductList />}
                {activeTab === 'categories' && <CategoryList />}
                {activeTab === 'orders' && <OrderList />}
                {activeTab === 'coupons' && <CouponList />}
            </div>
        </div>
    );
};

export default AdminPanel;
