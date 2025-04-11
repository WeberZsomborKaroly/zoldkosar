import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [invoiceData, setInvoiceData] = useState({
        adoszam: '',
        ceg_nev: '',
        szallitasi_cim: ''
    });
    const [formData, setFormData] = useState({
        vezeteknev: '',
        keresztnev: '',
        email: '',
        telefon: '',
        ceg_nev: '',
        adoszam: '',
        szallitasi_adatok: {
            nev: '',
            telefon: '',
            szallitasiCim: {
                megye: '',
                iranyitoszam: '',
                varos: '',
                utca: '',
                hazszam: ''
            },
            megjegyzes: ''
        }
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [returnOrder, setReturnOrder] = useState(null);

    
    const MEGYEK = [
        'Bács-Kiskun', 'Baranya', 'Békés', 'Borsod-Abaúj-Zemplén', 'Budapest',
        'Csongrád-Csanád', 'Fejér', 'Győr-Moson-Sopron', 'Hajdú-Bihar', 'Heves',
        'Jász-Nagykun-Szolnok', 'Komárom-Esztergom', 'Nógrád', 'Pest', 'Somogy',
        'Szabolcs-Szatmár-Bereg', 'Tolna', 'Vas', 'Veszprém', 'Zala'
    ];

    useEffect(() => {
        loadUserData();
        loadOrders();
    }, []);

    const loadUserData = async () => {
        try {
           
            const userData = JSON.parse(localStorage.getItem('user')) || {};
            setUser(userData);
            
            
            const initialFormData = {
                vezeteknev: userData.vezeteknev || '',
                keresztnev: userData.keresztnev || '',
                email: userData.email || '',
                telefon: userData.telefon || '',
                ceg_nev: userData.ceg_nev || '',
                adoszam: userData.adoszam || '',
                szallitasi_adatok: { 
                    nev: `${userData.vezeteknev || ''} ${userData.keresztnev || ''}`.trim(),
                    telefon: userData.telefon || '',
                    szallitasiCim: {
                        megye: '',
                        iranyitoszam: '',
                        varos: '',
                        utca: '',
                        hazszam: ''
                    },
                    megjegyzes: ''
                }
            };

            
            try {
                
                const savedShippingData = localStorage.getItem('savedShippingData');
                if (savedShippingData) {
                    const parsedData = JSON.parse(savedShippingData);
                    initialFormData.szallitasi_adatok = parsedData;
                }
            } catch (error) {
                console.log('Nincs mentett szállítási adat vagy hiba történt a betöltéskor');
            }

            setFormData(initialFormData);
            
           
            setInvoiceData({
                adoszam: userData.adoszam || '',
                ceg_nev: userData.ceg_nev || '',
                szallitasi_cim: ''
            });
        } catch (error) {
            console.error('Hiba a felhasználói adatok betöltésekor:', error);
            setMessage({ text: 'Hiba történt az adatok betöltésekor', type: 'error' });
        }
    };

   
    const fetchOrderItems = async (orderId) => {
        try {
            const response = await axiosInstance.get(`/admin/orders/${orderId}/items`);
            console.log(`Rendelés tétel a ${orderId} rendeléshez:`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Hiba a rendelés tétel lekérésékor (ID: ${orderId}):`, error);
            return [];
        }
    };
    
    
    const loadOrders = async () => {
        try {
           
            const userData = JSON.parse(localStorage.getItem('user')) || {};
            
            if (!userData.email) {
                console.log('Nincs belépett felhasználó vagy hiányzik az email cím');
                setOrders([]);
                return;
            }
            
            console.log('Rendelések lekérése a következő email címhez:', userData.email);
            
         
            const response = await axiosInstance.get('/admin/orders');
            console.log('Összes rendelés:', response.data);
            
            if (response.data && Array.isArray(response.data)) {
               
                const userOrders = response.data.filter(order => {
                    try {
                       
                        if (typeof order.szallitasi_cim === 'string') {
                            if (order.szallitasi_cim.includes(userData.email)) {
                                return true;
                            }
                            
                           
                            try {
                                if (order.szallitasi_cim.startsWith('{')) {
                                    const szallitasiData = JSON.parse(order.szallitasi_cim);
                                    if (szallitasiData.email && szallitasiData.email.includes(userData.email)) {
                                        return true;
                                    }
                                }
                            } catch (jsonError) {
                                
                            }
                        }
                        
                        
                        if (order.email && order.email.includes(userData.email)) {
                            return true;
                        }
                        
                        return false;
                    } catch (e) {
                        console.error('Hiba a rendelés szűrésékor:', e);
                        return false;
                    }
                });
                
                console.log('Felhasználó rendelései:', userOrders);
                
                
                const ordersWithItems = await Promise.all(userOrders.map(async (order) => {
                    const items = await fetchOrderItems(order.id);
                    return {
                        ...order,
                        termekek: items
                    };
                }));
                
                console.log('Rendelések tétellel együtt:', ordersWithItems);
                setOrders(ordersWithItems);
            } else {
                console.log('Nincs rendelés adat vagy nem tömb formátumú');
                setOrders([]);
            }
        } catch (error) {
            console.error('Hiba a rendelések betöltésekor:', error);
            setMessage({ text: 'Hiba történt a rendelések betöltésekor', type: 'error' });
            setOrders([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name.includes('.')) {
            const parts = name.split('.');
            if (parts.length === 2) {
                setFormData(prev => ({
                    ...prev,
                    [parts[0]]: {
                        ...prev[parts[0]],
                        [parts[1]]: value
                    }
                }));
            } else if (parts.length === 3) {
                setFormData(prev => ({
                    ...prev,
                    [parts[0]]: {
                        ...prev[parts[0]],
                        [parts[1]]: {
                            ...prev[parts[0]][parts[1]],
                            [parts[2]]: value
                        }
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleInvoiceInputChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePersonalDataSubmit = async (e) => {
        e.preventDefault();
        try {
            const personalData = {
                vezeteknev: formData.vezeteknev,
                keresztnev: formData.keresztnev,
                telefon: formData.telefon,
                ceg_nev: formData.ceg_nev,
                adoszam: formData.adoszam
            };
            
            
            
           
            const updatedUser = {
                ...user,
                ...personalData
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            
            
            setInvoiceData({
                adoszam: personalData.adoszam || '',
                ceg_nev: personalData.ceg_nev || '',
                szallitasi_cim: invoiceData.szallitasi_cim
            });
            
            setMessage({ text: 'Személyes adatok sikeresen frissítve!', type: 'success' });
            setEditMode(false);
        } catch (error) {
            console.error('Hiba a profil mentésekor:', error);
            setMessage({ text: 'Hiba történt a profil mentésekor', type: 'error' });
        }
    };

    const handleShippingDataSubmit = async (e) => {
        e.preventDefault();
        try {
          
            localStorage.setItem('savedShippingData', JSON.stringify(formData.szallitasi_adatok));
            
            setMessage({ text: 'Szállítási adatok sikeresen mentve!', type: 'success' });
        } catch (error) {
            console.error('Hiba a szállítási adatok mentésekor:', error);
            setMessage({ text: 'Hiba történt a szállítási adatok mentésekor', type: 'error' });
        }
    };

    const handleReturnOrder = async (order) => {
        try {
            
            console.log('Termék visszaküldése kérése:', order);
            
           
            const updatedOrders = orders.map((o) => {
                if (o.id === order.id) {
                    return { ...o, statusz: 'visszakuldve' };
                }
                return o;
            });
            setOrders(updatedOrders);
            
            setMessage({ text: 'Termék visszaküldése sikeresen kezdeményezve!', type: 'success' });
        } catch (error) {
            console.error('Hiba a termék visszaküldésekor:', error);
            setMessage({ text: 'Hiba történt a termék visszaküldésekor', type: 'error' });
        }
    };

    
    const openReturnModal = (order) => {
        setReturnOrder(order);
        setReturnModalOpen(true);
    };

    
    const closeReturnModal = () => {
        setReturnModalOpen(false);
        setReturnOrder(null);
    };

    const openInvoiceModal = (order) => {
        setSelectedOrder(order);
        setInvoiceData(prev => ({
            ...prev,
            szallitasi_cim: order.szallitasi_cim
        }));
        setInvoiceModalOpen(true);
    };

    const closeInvoiceModal = () => {
        setInvoiceModalOpen(false);
        setSelectedOrder(null);
    };

    const generateInvoicePDF = () => {
        try {
            if (!selectedOrder) {
                console.error('Nincs kiválasztott rendelés');
                setMessage({ text: 'Hiba történt a számla generálásakor: nincs kiválasztott rendelés', type: 'error' });
                return;
            }
            
            
            if (!selectedOrder.termekek) {
                selectedOrder.termekek = [];
            }
            
            console.log('Számla generálása a következő rendeléshez:', selectedOrder);
            
            
            const printWindow = window.open('', '_blank', 'width=800,height=600');
            if (!printWindow) {
                setMessage({ text: 'A felugró ablakok blokkolva vannak. Kérjük, engedélyezze a felugró ablakokat.', type: 'error' });
                return;
            }
            
           
            const orderDate = selectedOrder.letrehozva ? new Date(selectedOrder.letrehozva).toLocaleDateString('hu-HU') : 
                             selectedOrder.datum ? new Date(selectedOrder.datum).toLocaleDateString('hu-HU') : 'N/A';
            
           
            let totalNet = 0;
            let totalVat = 0;
            let totalGross = 0;
            
            
            let productRows = '';
            
            if (Array.isArray(selectedOrder.termekek) && selectedOrder.termekek.length > 0) {
                productRows = selectedOrder.termekek.map(item => {
                    if (!item) return ''; 
                    
                    
                    const egysegar = typeof item.egysegar === 'number' ? item.egysegar : 
                                    typeof item.ar === 'number' ? item.ar : 0;
                    
                    const netPrice = Math.round(egysegar / 1.27);
                    const vatAmount = egysegar - netPrice;
                    const netTotal = netPrice * (item.mennyiseg || 1);
                    const vatTotal = vatAmount * (item.mennyiseg || 1);
                    const grossTotal = egysegar * (item.mennyiseg || 1);
                    
                    totalNet += netTotal;
                    totalVat += vatTotal;
                    totalGross += grossTotal;
                    
                    return `
                        <tr>
                            <td>${item.termek_nev || item.nev || 'Ismeretlen termék'}</td>
                            <td>${item.mennyiseg || 1}</td>
                            <td>${egysegar.toLocaleString()} Ft</td>
                            <td>${netTotal.toLocaleString()} Ft</td>
                            <td>${vatTotal.toLocaleString()} Ft</td>
                            <td>${grossTotal.toLocaleString()} Ft</td>
                        </tr>
                    `;
                }).join('');
            } else {
               
                productRows = `
                    <tr>
                        <td colspan="6">Nincs elérhető termék információ</td>
                    </tr>
                `;
                
               
                if (selectedOrder.osszeg || selectedOrder.vegosszeg) {
                    totalGross = selectedOrder.osszeg || selectedOrder.vegosszeg || 0;
                    totalNet = Math.round(totalGross / 1.27);
                    totalVat = totalGross - totalNet;
                }
            }
            
           
            const invoiceNumber = selectedOrder.rendeles_szam || `ORD-${selectedOrder.id || 'UNKNOWN'}`;
            
            
            const invoiceHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Számla - ${invoiceNumber}</title>
                    <meta charset="UTF-8">
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 20px;
                            color: #333;
                        }
                        .invoice-header {
                            text-align: center;
                            margin-bottom: 30px;
                        }
                        .invoice-header h1 {
                            color: #2c3e50;
                            margin-bottom: 5px;
                        }
                        .invoice-details {
                            margin-bottom: 20px;
                        }
                        .columns {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 30px;
                        }
                        .column {
                            width: 48%;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 30px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 10px;
                            text-align: left;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        .total-row {
                            font-weight: bold;
                            background-color: #f8f9fa;
                        }
                        .footer {
                            margin-top: 50px;
                            font-size: 12px;
                            color: #666;
                            text-align: center;
                        }
                        @media print {
                            body {
                                print-color-adjust: exact;
                                -webkit-print-color-adjust: exact;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice-header">
                        <h1>Számla</h1>
                        <p>Számla sorszáma: INV-${invoiceNumber}</p>
                    </div>
                    
                    <div class="invoice-details">
                        <p><strong>Rendelés száma:</strong> ${invoiceNumber}</p>
                        <p><strong>Dátum:</strong> ${orderDate}</p>
                        <p><strong>Fizetés módja:</strong> Utánvét</p>
                    </div>
                    
                    <div class="columns">
                        <div class="column">
                            <h3>Eladó</h3>
                            <p>Webshop Kft.</p>
                            <p>Adószám: 12345678-2-42</p>
                            <p>Cím: 1234 Budapest, Példa utca 1.</p>
                            <p>Telefonszám: +36 1 234 5678</p>
                        </div>
                        
                        <div class="column">
                            <h3>Vevő</h3>
                            <p>${user?.vezeteknev || ''} ${user?.keresztnev || ''}</p>
                            ${invoiceData.ceg_nev ? 
                                `<p>${invoiceData.ceg_nev}</p>
                                <p>Adószám: ${invoiceData.adoszam}</p>` : ''}
                            <p>${invoiceData.szallitasi_cim || selectedOrder.szallitasi_cim || 'Nincs megadva'}</p>
                        </div>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Termék</th>
                                <th>Mennyiség</th>
                                <th>Egységár (Ft)</th>
                                <th>Nettó (Ft)</th>
                                <th>ÁFA (27%)</th>
                                <th>Bruttó (Ft)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productRows}
                            <tr class="total-row">
                                <td colspan="3">Összesen:</td>
                                <td>${totalNet.toLocaleString()} Ft</td>
                                <td>${totalVat.toLocaleString()} Ft</td>
                                <td>${totalGross.toLocaleString()} Ft</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <div class="footer">
                        <p>Ez a számla a 2007. évi CXXVII. törvény alapján elektronikusan kiállított hiteles bizonylat.</p>
                        <p>A számla aláírás és bélyegző nélkül is érvényes.</p>
                    </div>
                </body>
                </html>
            `;
            
            
            printWindow.document.open();
            printWindow.document.write(invoiceHtml);
            printWindow.document.close();
            
            
            closeInvoiceModal();
            
            
            setMessage({ text: 'Számla sikeresen elkészítve! Használja a Nyomtatás gombot a letöltéshez.', type: 'success' });
        } catch (error) {
            console.error('Hiba a számla generálásakor:', error);
            setMessage({ text: 'Hiba történt a számla generálásakor', type: 'error' });
        }
    };

    const renderPersonalDataTab = () => (
        <div className="profile-section">
            <h3>Személyes adatok</h3>
            {!editMode ? (
                <div className="profile-details">
                    <p><strong>Név:</strong> {user?.vezeteknev} {user?.keresztnev}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Telefon:</strong> {user?.telefon || 'Nincs megadva'}</p>
                    {user?.ceg_nev && (
                        <>
                            <p><strong>Cégnév:</strong> {user.ceg_nev}</p>
                            <p><strong>Adószám:</strong> {user.adoszam}</p>
                        </>
                    )}
                    <button onClick={() => setEditMode(true)} className="edit-button">
                        Adatok szerkesztése
                    </button>
                </div>
            ) : (
                <form onSubmit={handlePersonalDataSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Vezetéknév:</label>
                        <input
                            type="text"
                            name="vezeteknev"
                            value={formData.vezeteknev}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Keresztnév:</label>
                        <input
                            type="text"
                            name="keresztnev"
                            value={formData.keresztnev}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Telefon:</label>
                        <input
                            type="tel"
                            name="telefon"
                            value={formData.telefon}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Cégnév (opcionális):</label>
                        <input
                            type="text"
                            name="ceg_nev"
                            value={formData.ceg_nev}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Adószám (opcionális):</label>
                        <input
                            type="text"
                            name="adoszam"
                            value={formData.adoszam}
                            onChange={handleInputChange}
                            placeholder="12345678-1-23"
                        />
                    </div>
                    <div className="form-buttons">
                        <button type="submit" className="save-button">Mentés</button>
                        <button 
                            type="button" 
                            onClick={() => {
                                setEditMode(false);
                            }} 
                            className="cancel-button"
                        >
                            Mégse
                        </button>
                    </div>
                </form>
            )}
        </div>
    );

    const renderShippingDataTab = () => (
        <div className="profile-section">
            <h3>Szállítási adatok</h3>
            <p className="info-text">
                Az itt megadott adatokat automatikusan kitöltjük a rendelés leadásakor.
            </p>
            <form onSubmit={handleShippingDataSubmit} className="profile-form">
                <div className="form-group">
                    <label>Teljes név:</label>
                    <input
                        type="text"
                        name="szallitasi_adatok.nev"
                        value={formData.szallitasi_adatok.nev}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Telefonszám:</label>
                    <input
                        type="tel"
                        name="szallitasi_adatok.telefon"
                        value={formData.szallitasi_adatok.telefon}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="address-section">
                    <h4>Szállítási cím</h4>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Megye:</label>
                            <select
                                name="szallitasi_adatok.szallitasiCim.megye"
                                value={formData.szallitasi_adatok.szallitasiCim.megye}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Válasszon megyét</option>
                                {MEGYEK.map(megye => (
                                    <option key={megye} value={megye}>
                                        {megye}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Irányítószám:</label>
                            <input
                                type="text"
                                name="szallitasi_adatok.szallitasiCim.iranyitoszam"
                                value={formData.szallitasi_adatok.szallitasiCim.iranyitoszam}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Város:</label>
                        <input
                            type="text"
                            name="szallitasi_adatok.szallitasiCim.varos"
                            value={formData.szallitasi_adatok.szallitasiCim.varos}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Utca:</label>
                            <input
                                type="text"
                                name="szallitasi_adatok.szallitasiCim.utca"
                                value={formData.szallitasi_adatok.szallitasiCim.utca}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Házszám:</label>
                            <input
                                type="text"
                                name="szallitasi_adatok.szallitasiCim.hazszam"
                                value={formData.szallitasi_adatok.szallitasiCim.hazszam}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Megjegyzés a futárnak (opcionális):</label>
                    <textarea
                        name="szallitasi_adatok.megjegyzes"
                        value={formData.szallitasi_adatok.megjegyzes}
                        onChange={handleInputChange}
                        rows="3"
                    ></textarea>
                </div>

                <div className="form-buttons">
                    <button type="submit" className="save-button">Mentés</button>
                </div>
            </form>
        </div>
    );

    const renderOrdersTab = () => (
        <div className="orders-section">
            <h3>Korábbi rendelések</h3>
            {orders && orders.length > 0 ? (
                <div className="orders-list">
                    {orders.map(order => {
                        if (!order) return null; 
                        
                        
                        const orderDate = order.letrehozva ? new Date(order.letrehozva).toLocaleDateString('hu-HU') : 
                                         order.datum ? new Date(order.datum).toLocaleDateString('hu-HU') : 'N/A';
                        
                      
                        const orderNumber = order.rendeles_szam || `ORD-${order.id || 'UNKNOWN'}`;
                        
                       
                        const orderTotal = typeof order.osszeg === 'number' ? order.osszeg.toLocaleString() : 
                                          typeof order.vegosszeg === 'number' ? order.vegosszeg.toLocaleString() : 'N/A';
                        
                        
                        const orderItems = Array.isArray(order.termekek) ? order.termekek : [];
                        
                       
                        let orderStatus = (order.statusz || order.allapot || 'feldolgozas_alatt').toString();
                        
                        
                        orderStatus = orderStatus.normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
                                                .replace(/\s+/g, '_')      
                                                .replace(/-/g, '_')         
                                                .toLowerCase();             
                        
                        return (
                            <div key={order.id || Math.random()} className="order-card">
                                <div className="order-header">
                                    <span className="order-number">Rendelés #{orderNumber}</span>
                                    <span className={`order-status ${orderStatus}`}>
                                        {orderStatus}
                                    </span>
                                </div>
                                <div className="order-details">
                                    <p><strong>Dátum:</strong> {orderDate}</p>
                                    <p><strong>Összeg:</strong> {orderTotal} Ft</p>
                                    <p><strong>Szállítási cím:</strong> {order.szallitasi_cim || 'Nincs megadva'}</p>
                                </div>
                                <div className="order-items">
                                    {orderItems.length > 0 ? (
                                        orderItems.map((item, index) => {
                                            if (!item) return null; 
                                            
                                           
                                            const itemName = item.termek_nev || item.nev || 'Ismeretlen termék';
                                            const itemPrice = typeof item.egysegar === 'number' ? item.egysegar : 
                                                            typeof item.ar === 'number' ? item.ar : 0;
                                            const itemQuantity = item.mennyiseg || 1;
                                            
                                            return (
                                                <div key={index} className="order-item">
                                                    <span>{itemName}</span>
                                                    <span>{itemQuantity} db</span>
                                                    <span>{itemPrice.toLocaleString()} Ft/db</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="no-items">Nincs elérhető termék információ</p>
                                    )}
                                </div>
                                <div className="order-actions">
                                    <button 
                                        className="invoice-button"
                                        onClick={() => openInvoiceModal(order)}
                                    >
                                        <i className="fas fa-file-invoice"></i> Számla letöltése
                                    </button>
                                    <button 
                                        className="return-button"
                                        onClick={() => openReturnModal(order)}
                                        disabled={order.statusz === 'visszakuldve' || order.statusz === 'lemondva'}
                                    >
                                        <i className="fas fa-undo-alt"></i> Termék visszaküldése
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="no-orders">Még nincsenek korábbi rendelések.</p>
            )}
        </div>
    );

    const renderInvoiceModal = () => {
        if (!invoiceModalOpen || !selectedOrder) return null;
        
        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Számla adatok</h3>
                    <p>Kérjük, ellenőrizze a számlázási adatokat a számla letöltése előtt.</p>
                    
                    <form className="invoice-form">
                        <div className="form-group">
                            <label>Számlázási név:</label>
                            <input
                                type="text"
                                value={`${user?.vezeteknev || ''} ${user?.keresztnev || ''}`}
                                disabled
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Cégnév (opcionális):</label>
                            <input
                                type="text"
                                name="ceg_nev"
                                value={invoiceData.ceg_nev}
                                onChange={handleInvoiceInputChange}
                                placeholder="Ha cég nevére kéri a számlát"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Adószám (opcionális):</label>
                            <input
                                type="text"
                                name="adoszam"
                                value={invoiceData.adoszam}
                                onChange={handleInvoiceInputChange}
                                placeholder="12345678-1-23"
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Szállítási cím:</label>
                            <input
                                type="text"
                                name="szallitasi_cim"
                                value={invoiceData.szallitasi_cim}
                                onChange={handleInvoiceInputChange}
                            />
                        </div>
                        
                        <div className="form-buttons">
                            <button 
                                type="button" 
                                className="save-button"
                                onClick={generateInvoicePDF}
                            >
                                Számla letöltése
                            </button>
                            <button 
                                type="button" 
                                className="cancel-button"
                                onClick={closeInvoiceModal}
                            >
                                Mégse
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderReturnModal = () => {
        if (!returnModalOpen || !returnOrder) return null;
        
        return (
            <div className="modal-overlay">
                <div className="modal-content return-info-modal">
                    <div className="return-modal-header">
                        <h3><i className="fas fa-undo-alt"></i> Termék visszaküldése</h3>
                        <button className="modal-close" onClick={closeReturnModal}>×</button>
                    </div>
                    
                    <div className="return-info-content">
                        <div className="return-order-details">
                            <p><strong>Rendelés száma:</strong> {returnOrder.rendeles_szam || `ORD-${returnOrder.id || 'UNKNOWN'}`}</p>
                            <p><strong>Dátum:</strong> {returnOrder.letrehozva ? new Date(returnOrder.letrehozva).toLocaleDateString('hu-HU') : 'N/A'}</p>
                        </div>
                        
                        <div className="return-info-box">
                            <h4>Termék visszaküldési tájékoztató</h4>
                            <p>A termék visszaküldéséhez kérjük, vegye fel a kapcsolatot ügyfélszolgálatunkkal az alábbi elérhetőségek egyikén:</p>
                            
                            <div className="contact-methods">
                                <div className="contact-method">
                                    <i className="fas fa-phone-alt"></i>
                                    <div>
                                        <h5>Telefon</h5>
                                        <p>+36 1 123 4567</p>
                                        <small>Hétköznap 9:00-17:00</small>
                                    </div>
                                </div>
                                
                                <div className="contact-method">
                                    <i className="fas fa-envelope"></i>
                                    <div>
                                        <h5>Email</h5>
                                        <p>ugyfelszolgalat@webshop.hu</p>
                                        <small>24 órán belül válaszolunk</small>
                                    </div>
                                </div>
                                
                                <div className="contact-method">
                                    <i className="fas fa-comments"></i>
                                    <div>
                                        <h5>Online chat</h5>
                                        <p>Webshop.hu/chat</p>
                                        <small>Hétköznap 8:00-20:00</small>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="return-policy-info">
                                <h5>Fontos információk:</h5>
                                <ul>
                                    <li>A termékeket a kézhezvételtől számított 14 napon belül küldheti vissza.</li>
                                    <li>A visszaküldött termékeknek sértetlen állapotban kell lennie.</li>
                                    <li>A visszatérítést a termék beérkezése után 5 munkanapon belül feldolgozzuk.</li>
                                </ul>
                            </div>
                            
                            <div className="return-modal-footer">
                                <button className="close-button" onClick={closeReturnModal}>Bezárás</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="profile-container">
            <h2>Fiókom</h2>
            
            {message.text && (
                <div className={`alert ${message.type}`}>
                    {message.text}
                </div>
            )}

            <div className="profile-tabs">
                <button 
                    className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                >
                    <i className="fas fa-user"></i> Személyes adatok
                </button>
                <button 
                    className={`tab-button ${activeTab === 'shipping' ? 'active' : ''}`}
                    onClick={() => setActiveTab('shipping')}
                >
                    <i className="fas fa-truck"></i> Szállítási adatok
                </button>
                <button 
                    className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >
                    <i className="fas fa-shopping-bag"></i> Rendelések
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'personal' && renderPersonalDataTab()}
                {activeTab === 'shipping' && renderShippingDataTab()}
                {activeTab === 'orders' && renderOrdersTab()}
            </div>
            
            {renderInvoiceModal()}
            {renderReturnModal()}
        </div>
    );
};

export default Profile;
