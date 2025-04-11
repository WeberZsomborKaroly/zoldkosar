import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import './OrderList.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [orderItems, setOrderItems] = useState({});
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/admin/orders');
            console.log('Rendelések:', response.data);
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Hiba a rendelések betöltésekor:', err);
            setError('Hiba történt a rendelések betöltése közben');
            setLoading(false);
        }
    };

    const fetchOrderItems = async (orderId) => {
        if (orderItems[orderId]) return; 

        try {
            const response = await axiosInstance.get(`/admin/orders/${orderId}/items`);
            console.log(`Rendelés tételek (${orderId}):`, response.data);
            setOrderItems(prev => ({
                ...prev,
                [orderId]: response.data
            }));
        } catch (err) {
            console.error(`Hiba a rendelés tételek betöltésekor (${orderId}):`, err);
            setOrderItems(prev => ({
                ...prev,
                [orderId]: []
            }));
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axiosInstance.put(`/admin/orders/${orderId}`, {
                allapot: newStatus
            });
            
           
            setOrders(orders.map(order => 
                order.id === orderId 
                    ? { ...order, allapot: newStatus }
                    : order
            ));
        } catch (err) {
            console.error('Hiba a rendelés státuszának módosításakor:', err);
            setError('Hiba történt a rendelés státuszának módosítása során');
        }
    };

    const toggleOrderDetails = async (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
        } else {
            setExpandedOrder(orderId);
            await fetchOrderItems(orderId);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'feldolgozás alatt':
            case 'feldolgozas_alatt':
                return 'Feldolgozás alatt';
            case 'szállítás alatt':
            case 'szallitas_alatt':
                return 'Szállítás alatt';
            case 'teljesítve':
            case 'teljesitve':
                return 'Teljesítve';
            case 'törölve':
            case 'torolve':
                return 'Törölve';
            case 'új':
                return 'Új rendelés';
            default:
                return status || 'Ismeretlen';
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'feldolgozás alatt':
            case 'feldolgozas_alatt':
            case 'új':
                return 'status-processing';
            case 'szállítás alatt':
            case 'szallitas_alatt':
                return 'status-shipping';
            case 'teljesítve':
            case 'teljesitve':
                return 'status-completed';
            case 'törölve':
            case 'torolve':
                return 'status-cancelled';
            default:
                return 'status-unknown';
        }
    };

    
    const getStatusValue = (status) => {
        switch (status) {
            case 'feldolgozás alatt':
                return 'feldolgozas_alatt';
            case 'szállítás alatt':
                return 'szallitas_alatt';
            case 'teljesítve':
                return 'teljesitve';
            case 'törölve':
                return 'torolve';
            case 'új':
                return 'feldolgozas_alatt'; 
            default:
                return status;
        }
    };

    const filteredOrders = orders
        .filter(order => {
            if (filter === 'all') return true;
            const orderStatus = getStatusValue(order.allapot);
            return orderStatus === filter;
        })
        .filter(order => {
            if (!searchTerm) return true;
            const searchLower = searchTerm.toLowerCase();
            return (
                (order.id?.toString().includes(searchTerm)) ||
                (order.rendeles_szam?.toLowerCase().includes(searchLower)) ||
                (order.felhasznalo_nev?.toLowerCase().includes(searchLower)) ||
                (order.email?.toLowerCase().includes(searchLower))
            );
        });

    if (loading) {
        return <div className="loading">Rendelések betöltése...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="order-list-container">
            <h2>Rendelések kezelése</h2>
            
            <div className="order-filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Keresés rendelés ID, rendelésszám vagy vásárló szerint..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search"></i>
                </div>
                
                <div className="status-filter">
                    <label htmlFor="status-filter">Szűrés státusz szerint:</label>
                    <select 
                        id="status-filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Összes rendelés</option>
                        <option value="feldolgozas_alatt">Feldolgozás alatt</option>
                        <option value="szallitas_alatt">Szállítás alatt</option>
                        <option value="teljesitve">Teljesítve</option>
                        <option value="torolve">Törölve</option>
                    </select>
                </div>
            </div>
            
            {filteredOrders.length === 0 ? (
                <div className="no-orders">
                    {searchTerm || filter !== 'all' 
                        ? 'Nincs a keresési feltételeknek megfelelő rendelés.' 
                        : 'Nincsenek rendelések az adatbázisban.'}
                </div>
            ) : (
                <div className="order-table">
                    <div className="order-table-header">
                        <div className="order-id">Rendelés ID</div>
                        <div className="order-date">Dátum</div>
                        <div className="customer-name">Vásárló</div>
                        <div className="order-total">Összeg</div>
                        <div className="order-status">Státusz</div>
                        <div className="order-actions">Műveletek</div>
                    </div>
                    
                    {filteredOrders.map(order => (
                        <React.Fragment key={order.id}>
                            <div className="order-row">
                                <div className="order-id">#{order.id}</div>
                                <div className="order-date">{formatDate(order.datum)}</div>
                                <div className="customer-name">
                                    <div>{order.felhasznalo_nev || order.szallitasi_nev || 'Ismeretlen'}</div>
                                    <div className="customer-email">{order.email || ''}</div>
                                </div>
                                <div className="order-total">{order.vegosszeg?.toLocaleString() || order.osszeg?.toLocaleString() || 0} Ft</div>
                                <div className="order-status" style={{background:'transparent'}}>
                                    <span className={`status-badge ${getStatusClass(order.allapot)}`}>
                                        {getStatusLabel(order.allapot)}
                                    </span>
                                </div>
                                <div className="order-actions">
                                    <select
                                        value={getStatusValue(order.allapot)}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="feldolgozas_alatt">Feldolgozás alatt</option>
                                        <option value="szallitas_alatt">Szállítás alatt</option>
                                        <option value="teljesitve">Teljesítve</option>
                                        <option value="torolve">Törölve</option>
                                    </select>
                                    <button 
                                        className="details-button"
                                        onClick={() => toggleOrderDetails(order.id)}
                                    >
                                        {expandedOrder === order.id ? 'Bezárás' : 'Részletek'}
                                    </button>
                                </div>
                            </div>
                            
                            {expandedOrder === order.id && (
                                <div className="order-details">
                                    <div className="order-details-grid">
                                        <div className="order-details-section">
                                            <h3>Rendelési adatok</h3>
                                            <div className="details-info">
                                                <p><strong>Rendelés azonosító:</strong> #{order.id}</p>
                                                <p><strong>Rendelésszám:</strong> {order.rendeles_szam || 'N/A'}</p>
                                                <p><strong>Rendelés dátuma:</strong> {formatDate(order.datum)}</p>
                                                <p><strong>Fizetési mód:</strong> {order.fizetesi_mod || 'Bankkártya'}</p>
                                                <p><strong>Megjegyzés:</strong> {order.megjegyzes || 'Nincs megjegyzés'}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="order-details-section">
                                            <h3>Vásárló adatai</h3>
                                            <div className="details-info">
                                                <p><strong>Név:</strong> {order.felhasznalo_nev || order.szallitasi_nev || 'Nem megadott'}</p>
                                                <p><strong>Email:</strong> {order.email || 'Nem megadott'}</p>
                                                <p><strong>Telefon:</strong> {order.telefon || 'Nem megadott'}</p>
                                                {order.adoszam && <p><strong>Adószám:</strong> {order.adoszam}</p>}
                                            </div>
                                        </div>
                                        
                                        <div className="order-details-section">
                                            <h3>Szállítási adatok</h3>
                                            <div className="details-info">
                                                {order.szallitasi_cim ? (
                                                    <div className="shipping-address">
                                                        <p><strong>Név:</strong> {order.szallitasi_nev || order.felhasznalo_nev || 'Nem megadott'}</p>
                                                        <p><strong>Cím:</strong> {order.szallitasi_cim}</p>
                                                    </div>
                                                ) : (
                                                    <p>Nincs szállítási információ</p>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="order-details-section">
                                            <h3>Számlázási adatok</h3>
                                            <div className="details-info">
                                                {order.szamlazasi_cim ? (
                                                    <div className="billing-address">
                                                        <p><strong>Név:</strong> {order.szamlazasi_nev || order.felhasznalo_nev || 'Nem megadott'}</p>
                                                        <p><strong>Cím:</strong> {order.szamlazasi_cim}</p>
                                                    </div>
                                                ) : (
                                                    <p>Nincs számlázási információ</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="order-items-section">
                                        <h3>Rendelt termékek</h3>
                                        {orderItems[order.id] ? (
                                            orderItems[order.id].length > 0 ? (
                                                <table className="order-items-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Termék</th>
                                                            <th>Mennyiség</th>
                                                            <th>Egységár</th>
                                                            <th>Összesen</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orderItems[order.id].map((item, index) => (
                                                            <tr key={index}>
                                                                <td>{item.termek_nev}</td>
                                                                <td>{item.mennyiseg} db</td>
                                                                <td>{item.egysegar?.toLocaleString() || 0} Ft</td>
                                                                <td>{(item.mennyiseg * item.egysegar)?.toLocaleString() || 0} Ft</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colSpan="3" className="total-label">Végösszeg:</td>
                                                            <td className="total-value">{order.vegosszeg?.toLocaleString() || order.osszeg?.toLocaleString() || 0} Ft</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            ) : (
                                                <p className="no-items">Nincsenek termékek a rendelésben</p>
                                            )
                                        ) : (
                                            <div className="loading-items">Termékek betöltése...</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderList;
