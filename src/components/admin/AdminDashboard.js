import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../utils/axiosConfig';
import ProductList from './ProductList';
import OrderList from './OrderList';
import UserList from './UserList';
import CouponList from './CouponList';
import CategoryList from './CategoryList';
import PromotionList from './PromotionList';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarActive, setSidebarActive] = useState(false);

    useEffect(() => {
        const checkAdminRole = () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                console.log('No user found in localStorage');
                setIsAdmin(false);
                setLoading(false);
                return;
            }

            try {
                const userData = JSON.parse(userStr);
                console.log('Checking admin role for user:', userData);
                if (userData.szerepkor === 'admin') {
                    console.log('User is admin');
                    setIsAdmin(true);
                } else {
                    console.log('User is not admin');
                    setIsAdmin(false);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error checking admin role:', error);
                setIsAdmin(false);
                setLoading(false);
            }
        };

        checkAdminRole();
        window.addEventListener('storage', checkAdminRole);
        window.addEventListener('authChange', checkAdminRole);

        return () => {
            window.removeEventListener('storage', checkAdminRole);
            window.removeEventListener('authChange', checkAdminRole);
        };
    }, []);

    const toggleSidebar = () => {
        setSidebarActive(!sidebarActive);
    };

    
    const isActive = (path) => {
        return location.pathname === path || 
               (path !== '/admin' && location.pathname.startsWith(path));
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Betöltés...</p>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="admin-access-denied">
                <div className="access-denied-icon">
                    <i className="fas fa-lock"></i>
                </div>
                <h2>Hozzáférés megtagadva</h2>
                <p>Nincs jogosultsága az admin felület megtekintéséhez.</p>
                <button className="btn btn-primary" onClick={() => navigate('/')}>
                    Vissza a főoldalra
                </button>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className={`admin-sidebar ${sidebarActive ? 'active' : ''}`}>
                <div className="sidebar-header">
                    <h2 style={{ color: 'white' }}>Admin Panel</h2>
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <nav>
                    <ul>
                        <li className={isActive('/admin') && !isActive('/admin/products') && !isActive('/admin/categories') && !isActive('/admin/orders') && !isActive('/admin/users') && !isActive('/admin/coupons') && !isActive('/admin/promotions') ? 'active' : ''}>
                            <Link to="/admin">
                                <i className="fas fa-chart-line"></i>
                                <span>Áttekintés</span>
                            </Link>
                        </li>
                        <li className={isActive('/admin/products') ? 'active' : ''}>
                            <Link to="/admin/products">
                                <i className="fas fa-box"></i>
                                <span>Termékek</span>
                            </Link>
                        </li>
                        <li className={isActive('/admin/categories') ? 'active' : ''}>
                            <Link to="/admin/categories">
                                <i className="fas fa-tags"></i>
                                <span>Kategóriák</span>
                            </Link>
                        </li>
                        <li className={isActive('/admin/promotions') ? 'active' : ''}>
                            <Link to="/admin/promotions">
                                <i className="fas fa-percent"></i>
                                <span>Akciók</span>
                            </Link>
                        </li>
                        <li className={isActive('/admin/orders') ? 'active' : ''}>
                            <Link to="/admin/orders">
                                <i className="fas fa-shopping-cart"></i>
                                <span>Rendelések</span>
                            </Link>
                        </li>
                        <li className={isActive('/admin/users') ? 'active' : ''}>
                            <Link to="/admin/users">
                                <i className="fas fa-users"></i>
                                <span>Felhasználók</span>
                            </Link>
                        </li>
                        <li className={isActive('/admin/coupons') ? 'active' : ''}>
                            <Link to="/admin/coupons">
                                <i className="fas fa-ticket-alt"></i>
                                <span>Kuponok</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="admin-content">
                <div className="mobile-header">
                    <button className="sidebar-toggle" onClick={toggleSidebar}>
                        <i className="fas fa-bars"></i>
                    </button>
                </div>
                <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/products" element={<ProductList />} />
                    <Route path="/categories" element={<CategoryList />} />
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/coupons" element={<CouponList />} />
                    <Route path="/promotions" element={<PromotionList />} />
                </Routes>
            </div>
        </div>
    );
};

const Overview = () => {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsResponse = await axiosInstance.get('/admin/stats');
                setStats({
                    totalProducts: statsResponse.data.productCount || 0,
                    totalOrders: statsResponse.data.orderCount || 0,
                    totalUsers: statsResponse.data.userCount || 0,
                    totalRevenue: statsResponse.data.totalRevenue || 0
                });
            } catch (error) {
                console.error('Hiba a statisztikák lekérése során:', error);
            }
        };

        const fetchRecentOrders = async () => {
            try {
                const ordersResponse = await axiosInstance.get('/admin/orders?limit=5');
                setRecentOrders(ordersResponse.data.map(order => ({
                    id: order.id,
                    customer: order.felhasznalo_nev || 'Ismeretlen',
                    date: new Date(order.datum).toLocaleDateString('hu-HU'),
                    status: order.allapot,
                    total: order.osszeg || 0
                })));
            } catch (error) {
                console.error('Hiba a rendelések lekérése során:', error);
            }
        };

        const fetchTopProducts = async () => {
            try {
                const productsResponse = await axiosInstance.get('/admin/products/top');
                setTopProducts(productsResponse.data.map(product => ({
                    id: product.id,
                    name: product.nev || 'Ismeretlen termék',
                    sales: product.eladasok || 0,
                    revenue: product.ar * (product.eladasok || 0)
                })));
            } catch (error) {
                console.error('Hiba a népszerű termékek lekérése során:', error);
            }
        };

        

        const fetchAllData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    fetchStats(),
                    fetchRecentOrders(),
                    fetchTopProducts()
                ]);
            } catch (error) {
                console.error('Hiba az adatok lekérése során:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF' }).format(amount);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        const currentDate = new Date().toLocaleDateString('hu-HU');
        
       
        doc.setFontSize(18);
        doc.text('Admin Panel Jelentés', 105, 15, { align: 'center' });
        
        doc.setFontSize(12);
        doc.text(`Generálva: ${currentDate}`, 105, 25, { align: 'center' });
        
        
        doc.setFontSize(14);
        doc.text('Statisztikák', 14, 35);
        
        const statsData = [
            ['Összes termék', stats.totalProducts.toString()],
            ['Összes rendelés', stats.totalOrders.toString()],
            ['Felhasználók', stats.totalUsers.toString()],
            ['Összes bevétel', formatCurrency(stats.totalRevenue)]
        ];
        
        autoTable(doc, {
            startY: 40,
            head: [['Megnevezés', 'Érték']],
            body: statsData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            styles: { fontSize: 10, cellPadding: 5 }
        });
        
        
        const finalY1 = doc.lastAutoTable ? doc.lastAutoTable.finalY : 40;
        doc.setFontSize(14);
        doc.text('Legutóbbi rendelések', 14, finalY1 + 15);
        
        const ordersData = recentOrders.map(order => [
            `#${order.id}`,
            order.customer,
            order.date,
            order.status,
            formatCurrency(order.total)
        ]);
        
        autoTable(doc, {
            startY: finalY1 + 20,
            head: [['Rendelés #', 'Vásárló', 'Dátum', 'Státusz', 'Összeg']],
            body: ordersData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            styles: { fontSize: 10, cellPadding: 5 }
        });
        
        
        const finalY2 = doc.lastAutoTable ? doc.lastAutoTable.finalY : finalY1 + 20;
        doc.setFontSize(14);
        doc.text('Legnépszerubb termékek', 14, finalY2 + 15);
        
        const productsData = topProducts.map(product => [
            product.name,
            `${product.sales} db`,
            formatCurrency(product.revenue)
        ]);
        
        autoTable(doc, {
            startY: finalY2 + 20,
            head: [['Termék', 'Eladások', 'Bevétel']],
            body: productsData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            styles: { fontSize: 10, cellPadding: 5 }
        });
        
        
        const finalY3 = doc.lastAutoTable ? doc.lastAutoTable.finalY : finalY2 + 20;
        doc.setFontSize(14);
        doc.text('Alacsony készletű termékek (20 db alatt)', 14, finalY3 + 15);
        
        const lowStockData = lowStockProducts.map(product => [
            product.name,
            product.category,
            `${product.stock} db`,
            formatCurrency(product.price)
        ]);
        
        autoTable(doc, {
            startY: finalY3 + 20,
            head: [['Termék', 'Kategória', 'Készlet', 'Ár']],
            body: lowStockData,
            theme: 'grid',
            headStyles: { fillColor: [255, 87, 34], textColor: 255 },
            styles: { fontSize: 10, cellPadding: 5 }
        });
        
        
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(
                `${i} / ${pageCount} oldal`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }
        
        // PDF letöltése
        doc.save(`admin-jelentes-${currentDate}.pdf`);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Adatok betöltése...</p>
            </div>
        );
    }

    return (
        <div className="overview">
            <div className="content-header">
                <h1>Áttekintés</h1>
                <div className="content-actions">
                    <button className="btn btn-primary" onClick={generatePDF}>
                        <i className="fas fa-download"></i> Jelentés letöltése
                    </button>
                </div>
            </div>

            <div className="stats-cards">
                <div className="stat-card" onClick={() => navigate('/admin/products')}>
                    <div className="stat-icon">
                        <i className="fas fa-box"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Összes termék</h3>
                        <p className="stat-value">{stats.totalProducts}</p>
                        <button className="card-link" style={{ background: 'none', backgroundColor: 'transparent' }}>Részletek <i className="fas fa-arrow-right"></i></button>
                    </div>
                </div>
                
                <div className="stat-card" onClick={() => navigate('/admin/orders')}>
                    <div className="stat-icon">
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Összes rendelés</h3>
                        <p className="stat-value">{stats.totalOrders}</p>
                        <button className="card-link" style={{ background: 'none', backgroundColor: 'transparent' }}>Részletek <i className="fas fa-arrow-right"></i></button>
                    </div>
                </div>
                
                <div className="stat-card" onClick={() => navigate('/admin/users')}>
                    <div className="stat-icon">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Felhasználók</h3>
                        <p className="stat-value">{stats.totalUsers}</p>
                        <button className="card-link" style={{ background: 'none', backgroundColor: 'transparent' }}>Részletek <i className="fas fa-arrow-right"></i></button>
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-icon">
                        <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div className="stat-info">
                        <h3>Összes bevétel</h3>
                        <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
                    </div>
                </div>
            </div>

            
            {lowStockProducts.length > 0 && (
                <div className="section-card low-stock-products">
                    <div className="section-header">
                        <h2>
                            <i className="fas fa-exclamation-triangle" style={{ color: '#ff5722', marginRight: '10px' }}></i>
                            Alacsony készletű termékek
                        </h2>
                        <div className="section-actions">
                            <button className="btn btn-warning" onClick={() => navigate('/admin/products')}>
                                Termékek kezelése
                            </button>
                        </div>
                    </div>
                    
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Termék</th>
                                <th>Kategória</th>
                                <th>Készlet</th>
                                <th>Ár</th>
                                <th>Művelet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockProducts.map(product => (
                                <tr key={product.id} className="low-stock-row">
                                    <td>{product.name}</td>
                                    <td>{product.category}</td>
                                    <td className="stock-cell">
                                        <span className={`stock-badge ${product.stock <= 5 ? 'critical' : 'warning'}`}>
                                            {product.stock} db
                                        </span>
                                    </td>
                                    <td>{formatCurrency(product.price)}</td>
                                    <td>
                                        <button 
                                            className="edit-button"
                                            onClick={() => navigate(`/admin/products?edit=${product.id}`)}
                                        >
                                            Szerkesztés
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div className="dashboard-sections">
                <div className="section-card recent-orders">
                    <div className="section-header">
                        <h2>Legutóbbi rendelések</h2>
                        <div className="section-actions">
                            <button className="btn btn-primary" onClick={() => navigate('/admin/orders')}>
                                Összes megtekintése
                            </button>
                        </div>
                    </div>
                    
                    {recentOrders.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Rendelés #</th>
                                    <th>Vásárló</th>
                                    <th>Dátum</th>
                                    <th>Státusz</th>
                                    <th>Összeg</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id} className="clickable-row" onClick={() => navigate(`/admin/orders/${order.id}`)}>
                                        <td>#{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.date}</td>
                                        <td>
                                            <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>{formatCurrency(order.total)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data">Nincsenek rendelések</p>
                    )}
                </div>
                
                <div className="section-card top-products">
                    <div className="section-header">
                        <h2>Legnépszerűbb termékek</h2>
                        <div className="section-actions">
                            <button className="btn btn-primary" onClick={() => navigate('/admin/products')}>
                                Összes megtekintése
                            </button>
                        </div>
                    </div>
                    
                    {topProducts.length > 0 ? (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Termék</th>
                                    <th>Eladások</th>
                                    <th>Bevétel</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map(product => (
                                    <tr key={product.id} className="clickable-row" onClick={() => navigate(`/admin/products/${product.id}`)}>
                                        <td>{product.name}</td>
                                        <td>{product.sales} db</td>
                                        <td>{formatCurrency(product.revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-data">Nincsenek népszerű termékek</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
