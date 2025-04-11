import React, { useState, useEffect } from 'react';
import './OrderForm.css';

// Magyar megyék listája és távolságuk Zala megyétől (km)
const MEGYEK = {
    'Bács-Kiskun': 280,
    'Baranya': 150,
    'Békés': 380,
    'Borsod-Abaúj-Zemplén': 450,
    'Budapest': 230,
    'Csongrád-Csanád': 320,
    'Fejér': 160,
    'Győr-Moson-Sopron': 180,
    'Hajdú-Bihar': 420,
    'Heves': 350,
    'Jász-Nagykun-Szolnok': 300,
    'Komárom-Esztergom': 200,
    'Nógrád': 320,
    'Pest': 230,
    'Somogy': 100,
    'Szabolcs-Szatmár-Bereg': 480,
    'Tolna': 180,
    'Vas': 80,
    'Veszprém': 90,
    'Zala': 0
};

const OrderForm = ({ onSubmit, onCancel, total, appliedCoupon, discountAmount }) => {
    const [formData, setFormData] = useState({
        nev: '',
        email: '',
        telefon: '',
        szallitasiCim: {
            megye: '',
            iranyitoszam: '',
            varos: '',
            utca: '',
            hazszam: ''
        },
        megjegyzes: '',
        fizetesiMod: '',
        kartyaAdatok: {
            kartyaSzam: '',
            kartyaNev: '',
            lejaratiDatum: '',
            cvv: ''
        }
    });

    const [szallitasiKoltseg, setSzallitasiKoltseg] = useState(0);
    const [subtotal, setSubtotal] = useState(total);
    const [showPaymentStep, setShowPaymentStep] = useState(false);
    const [showCardForm, setShowCardForm] = useState(false);
    const [savedShippingData, setSavedShippingData] = useState(null);

    // Szállítási költség számítása
    const calculateShippingCost = (megye) => {
        if (total >= 15000) return 0; 
        if (megye === 'Zala') return 0; 
        
        const tavolsag = MEGYEK[megye] || 0;
        // Minden 100 km után 500 Ft
        return Math.ceil(tavolsag / 100) * 500;
    };

   
    const handleMegyeChange = (e) => {
        const selectedMegye = e.target.value;
        setFormData(prev => ({
            ...prev,
            szallitasiCim: {
                ...prev.szallitasiCim,
                megye: selectedMegye
            }
        }));
        setSzallitasiKoltseg(calculateShippingCost(selectedMegye));
    };

    
    useEffect(() => {
        const loadUserData = async () => {
            try {
               
                const userData = JSON.parse(localStorage.getItem('user')) || {};
                
              
                const initialFormData = {
                    ...formData,
                    nev: `${userData.vezeteknev || ''} ${userData.keresztnev || ''}`.trim(),
                    email: userData.email || '',
                    telefon: userData.telefon || ''
                };
                
              
                try {
                    const savedShippingData = localStorage.getItem('savedShippingData');
                    if (savedShippingData) {
                        const savedData = JSON.parse(savedShippingData);
                        setSavedShippingData(savedData);
                        
                     
                        initialFormData.nev = savedData.nev || initialFormData.nev;
                        initialFormData.telefon = savedData.telefon || initialFormData.telefon;
                        initialFormData.szallitasiCim = savedData.szallitasiCim || initialFormData.szallitasiCim;
                        initialFormData.megjegyzes = savedData.megjegyzes || initialFormData.megjegyzes;
                        
                      
                        if (savedData.szallitasiCim?.megye) {
                            setSzallitasiKoltseg(calculateShippingCost(savedData.szallitasiCim.megye));
                        }
                    }
                } catch (error) {
                    console.log('Nincs mentett szállítási adat vagy hiba történt a betöltéskor');
                }
                
                setFormData(initialFormData);
            } catch (error) {
                console.error('Hiba a felhasználói adatok betöltésekor:', error);
            }
        };

        loadUserData();
    }, []);

    
    useEffect(() => {
        if (appliedCoupon) {
            setSubtotal(total + discountAmount);
        } else {
            setSubtotal(total);
        }
    }, [total, appliedCoupon, discountAmount]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleShippingFormSubmit = (e) => {
        e.preventDefault();
        setShowPaymentStep(true);
    };

    const handlePaymentMethodSelect = (method) => {
        setFormData(prev => ({
            ...prev,
            fizetesiMod: method
        }));
        setShowCardForm(method === 'kartya');
    };

    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        
        try {
            
            localStorage.setItem('savedShippingData', JSON.stringify({
                nev: formData.nev,
                telefon: formData.telefon,
                szallitasiCim: formData.szallitasiCim,
                megjegyzes: formData.megjegyzes
            }));
            
            
            onSubmit({
                ...formData,
                szallitasiKoltseg
            });
        } catch (error) {
            console.error('Hiba a szállítási adatok mentésekor:', error);
            alert('Hiba történt az adatok mentésekor. Kérjük próbálja újra.');
        }
    };

    const handleBack = () => {
        if (showCardForm) {
            setShowCardForm(false);
        } else if (showPaymentStep) {
            setShowPaymentStep(false);
        } else {
            onCancel();
        }
    };

    
    const renderShippingForm = () => (
        <div className="order-form-container">
            <h2>Szállítási adatok</h2>
            {savedShippingData && (
                <div className="saved-data-info">
                    <i className="fas fa-info-circle"></i>
                    Az űrlap a profilodban mentett szállítási adatokkal lett kitöltve.
                </div>
            )}
            <form onSubmit={handleShippingFormSubmit} className="order-form">
                <div className="form-group">
                    <label htmlFor="nev">Név*</label>
                    <input
                        type="text"
                        id="nev"
                        name="nev"
                        value={formData.nev}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email cím*</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="telefon">Telefonszám*</label>
                    <input
                        type="tel"
                        id="telefon"
                        name="telefon"
                        value={formData.telefon}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="address-section">
                    <h3>Szállítási cím</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="megye">Megye*</label>
                            <select
                                id="megye"
                                name="szallitasiCim.megye"
                                value={formData.szallitasiCim.megye}
                                onChange={handleMegyeChange}
                                required
                            >
                                <option value="">Válasszon megyét</option>
                                {Object.keys(MEGYEK).sort().map(megye => (
                                    <option key={megye} value={megye}>
                                        {megye}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="iranyitoszam">Irányítószám*</label>
                            <input
                                type="text"
                                id="iranyitoszam"
                                name="szallitasiCim.iranyitoszam"
                                value={formData.szallitasiCim.iranyitoszam}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="varos">Város*</label>
                            <input
                                type="text"
                                id="varos"
                                name="szallitasiCim.varos"
                                value={formData.szallitasiCim.varos}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="utca">Utca*</label>
                            <input
                                type="text"
                                id="utca"
                                name="szallitasiCim.utca"
                                value={formData.szallitasiCim.utca}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="hazszam">Házszám*</label>
                            <input
                                type="text"
                                id="hazszam"
                                name="szallitasiCim.hazszam"
                                value={formData.szallitasiCim.hazszam}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="megjegyzes">Megjegyzés</label>
                    <textarea
                        id="megjegyzes"
                        name="megjegyzes"
                        value={formData.megjegyzes}
                        onChange={handleChange}
                        rows="3"
                    ></textarea>
                </div>

                <div className="order-summary">
                    <h3>Rendelés összesítő</h3>
                    <div className="summary-row">
                        <span>Részösszeg:</span>
                        <span>{subtotal.toLocaleString()} Ft</span>
                    </div>
                    
                    {appliedCoupon && (
                        <div className="summary-row discount">
                            <span>Kupon kedvezmény ({appliedCoupon.kod}):</span>
                            <span>-{discountAmount.toLocaleString()} Ft</span>
                        </div>
                    )}
                    
                    <div className="summary-row">
                        <span>Szállítási költség:</span>
                        <span>{szallitasiKoltseg.toLocaleString()} Ft</span>
                    </div>
                    <div className="summary-row total">
                        <span>Végösszeg:</span>
                        <span>{(total + szallitasiKoltseg).toLocaleString()} Ft</span>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={onCancel}>
                        Vissza a kosárhoz
                    </button>
                    <button type="submit" className="submit-button">
                        Tovább a fizetéshez
                    </button>
                </div>
            </form>
        </div>
    );

   
    const renderPaymentMethodForm = () => (
        <div className="order-form-container">
            <h2>Fizetési mód kiválasztása</h2>
            <div className="payment-methods">
                <div 
                    className={`payment-method ${formData.fizetesiMod === 'utanvet' ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodSelect('utanvet')}
                >
                    <div className="payment-method-radio">
                        <input 
                            type="radio" 
                            name="fizetesiMod" 
                            value="utanvet" 
                            checked={formData.fizetesiMod === 'utanvet'} 
                            onChange={() => handlePaymentMethodSelect('utanvet')}
                        />
                    </div>
                    <div className="payment-method-content">
                        <h3>Utánvét</h3>
                        <p>Fizetés készpénzben a futárnak az átvételkor</p>
                    </div>
                </div>

                <div 
                    className={`payment-method ${formData.fizetesiMod === 'kartya' ? 'selected' : ''}`}
                    onClick={() => handlePaymentMethodSelect('kartya')}
                >
                    <div className="payment-method-radio">
                        <input 
                            type="radio" 
                            name="fizetesiMod" 
                            value="kartya" 
                            checked={formData.fizetesiMod === 'kartya'} 
                            onChange={() => handlePaymentMethodSelect('kartya')}
                        />
                    </div>
                    <div className="payment-method-content">
                        <h3>Bankkártyás fizetés</h3>
                        <p>Biztonságos online fizetés bankkártyával</p>
                    </div>
                </div>
            </div>

            <div className="order-summary">
                <h3>Rendelés összesítő</h3>
                <div className="summary-row">
                    <span>Részösszeg:</span>
                    <span>{subtotal.toLocaleString()} Ft</span>
                </div>
                
                {appliedCoupon && (
                    <div className="summary-row discount">
                        <span>Kupon kedvezmény ({appliedCoupon.kod}):</span>
                        <span>-{discountAmount.toLocaleString()} Ft</span>
                    </div>
                )}
                
                <div className="summary-row">
                    <span>Szállítási költség:</span>
                    <span>{szallitasiKoltseg.toLocaleString()} Ft</span>
                </div>
                <div className="summary-row total">
                    <span>Végösszeg:</span>
                    <span>{(total + szallitasiKoltseg).toLocaleString()} Ft</span>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="cancel-button" onClick={handleBack}>
                    Vissza a szállítási adatokhoz
                </button>
                {formData.fizetesiMod === 'utanvet' ? (
                    <button type="button" className="submit-button" onClick={handleFinalSubmit}>
                        Rendelés véglegesítése
                    </button>
                ) : formData.fizetesiMod === 'kartya' ? (
                    <button type="button" className="submit-button" onClick={() => setShowCardForm(true)}>
                        Tovább a kártyaadatokhoz
                    </button>
                ) : (
                    <button type="button" className="submit-button" disabled>
                        Kérjük válasszon fizetési módot
                    </button>
                )}
            </div>
        </div>
    );

    // Bankkártya adatok űrlap
    const renderCardForm = () => (
        <div className="order-form-container">
            <h2>Bankkártya adatok</h2>
            <form onSubmit={handleFinalSubmit} className="order-form card-form">
                <div className="form-group">
                    <label htmlFor="kartyaNev">Kártyán szereplő név*</label>
                    <input
                        type="text"
                        id="kartyaNev"
                        name="kartyaAdatok.kartyaNev"
                        value={formData.kartyaAdatok.kartyaNev}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="kartyaSzam">Kártyaszám*</label>
                    <input
                        type="text"
                        id="kartyaSzam"
                        name="kartyaAdatok.kartyaSzam"
                        value={formData.kartyaAdatok.kartyaSzam}
                        onChange={handleChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="lejaratiDatum">Lejárati dátum*</label>
                        <input
                            type="text"
                            id="lejaratiDatum"
                            name="kartyaAdatok.lejaratiDatum"
                            value={formData.kartyaAdatok.lejaratiDatum}
                            onChange={handleChange}
                            placeholder="HH/ÉÉ"
                            maxLength="5"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cvv">CVV/CVC*</label>
                        <input
                            type="text"
                            id="cvv"
                            name="kartyaAdatok.cvv"
                            value={formData.kartyaAdatok.cvv}
                            onChange={handleChange}
                            placeholder="123"
                            maxLength="3"
                            required
                        />
                    </div>
                </div>

                <div className="order-summary">
                    <h3>Rendelés összesítő</h3>
                    <div className="summary-row">
                        <span>Részösszeg:</span>
                        <span>{subtotal.toLocaleString()} Ft</span>
                    </div>
                    
                    {appliedCoupon && (
                        <div className="summary-row discount">
                            <span>Kupon kedvezmény ({appliedCoupon.kod}):</span>
                            <span>-{discountAmount.toLocaleString()} Ft</span>
                        </div>
                    )}
                    
                    <div className="summary-row">
                        <span>Szállítási költség:</span>
                        <span>{szallitasiKoltseg.toLocaleString()} Ft</span>
                    </div>
                    <div className="summary-row total">
                        <span>Végösszeg:</span>
                        <span>{(total + szallitasiKoltseg).toLocaleString()} Ft</span>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-button" onClick={handleBack}>
                        Vissza a fizetési módokhoz
                    </button>
                    <button type="submit" className="submit-button">
                        Rendelés véglegesítése
                    </button>
                </div>
            </form>
        </div>
    );

    
    if (showCardForm) {
        return renderCardForm();
    } else if (showPaymentStep) {
        return renderPaymentMethodForm();
    } else {
        return renderShippingForm();
    }
};

export default OrderForm;
