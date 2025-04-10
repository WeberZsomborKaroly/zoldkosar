import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CategoryList.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Form states
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        nev: '',
        szulo_kategoria: '',
        hivatkozas: '',
        tizennyolc_plusz: false
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            // Használjuk a token-t a localStorage-ból
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Nincs bejelentkezve!');
            }

            const response = await axios.get('http://localhost:3001/api/kategoriak', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCategories(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Hiba történt a kategóriák betöltése során.');
            toast.error('🚫 Hiba történt a kategóriák betöltése során.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            nev: '',
            szulo_kategoria: '',
            hivatkozas: '',
            tizennyolc_plusz: false
        });
        setEditingCategory(null);
        setShowForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleAddNew = () => {
        resetForm();
        setShowForm(true);
    };

    const handleEdit = (category) => {
        setFormData({
            nev: category.nev,
            szulo_kategoria: category.szulo_kategoria || '',
            hivatkozas: category.hivatkozas || '',
            tizennyolc_plusz: category.tizennyolc_plusz || false
        });
        setEditingCategory(category.id);
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Használjuk a token-t a localStorage-ból
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Nincs bejelentkezve!');
            }
            
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            let response;
            
            if (editingCategory) {
                // Update existing category
                response = await axios.put(
                    `http://localhost:3001/api/kategoriak/${editingCategory}`,
                    formData,
                    { headers }
                );
                toast.success(`✅ A(z) "${formData.nev}" kategória sikeresen frissítve!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                // Create new category
                response = await axios.post(
                    'http://localhost:3001/api/kategoriak',
                    formData,
                    { headers }
                );
                toast.success(`✅ A(z) "${formData.nev}" kategória sikeresen létrehozva!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
            
            resetForm();
            fetchCategories();
        } catch (err) {
            console.error('Error saving category:', err);
            toast.error(`🚫 ${err.response?.data?.message || 'Hiba történt a kategória mentése során.'}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Biztosan törölni szeretnéd ezt a kategóriát?')) {
            return;
        }
        
        try {
            // Használjuk a token-t a localStorage-ból
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Nincs bejelentkezve!');
            }
            
            // Megkeressük a kategória nevét a törlés előtt
            const categoryToDelete = categories.find(cat => cat.id === id);
            const categoryName = categoryToDelete ? categoryToDelete.nev : 'Ismeretlen';
            
            await axios.delete(`http://localhost:3001/api/kategoriak/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            toast.info(`🗑️ A(z) "${categoryName}" kategória sikeresen törölve!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            
            fetchCategories();
        } catch (err) {
            console.error('Error deleting category:', err);
            toast.error(`🚫 ${err.response?.data?.message || 'Hiba történt a kategória törlése során.'}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    if (loading) {
        return <div className="category-loading">Betöltés...</div>;
    }

    if (error) {
        return <div className="category-error">{error}</div>;
    }

    return (
        <div className="category-list-container">
            <div className="category-header">
                <h2>Kategóriák kezelése</h2>
                <button 
                    className="btn btn-primary add-category-btn"
                    onClick={handleAddNew}
                >
                    Új kategória
                </button>
            </div>

            {showForm && (
                <div className="category-form-container">
                    <h3>{editingCategory ? 'Kategória szerkesztése' : 'Új kategória hozzáadása'}</h3>
                    <form onSubmit={handleSubmit} className="category-form">
                        <div className="form-group">
                            <label htmlFor="nev">Kategória neve*</label>
                            <input
                                type="text"
                                id="nev"
                                name="nev"
                                value={formData.nev}
                                onChange={handleInputChange}
                                required
                                className="form-control"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="szulo_kategoria">Szülő kategória</label>
                            <select
                                id="szulo_kategoria"
                                name="szulo_kategoria"
                                value={formData.szulo_kategoria || ''}
                                onChange={handleInputChange}
                                className="form-control"
                            >
                                <option value="">Nincs szülő kategória</option>
                                {categories.map(category => (
                                    <option 
                                        key={category.id} 
                                        value={category.id}
                                        disabled={category.id === editingCategory}
                                    >
                                        {category.nev}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="hivatkozas">Hivatkozás (URL)</label>
                            <input
                                type="text"
                                id="hivatkozas"
                                name="hivatkozas"
                                value={formData.hivatkozas || ''}
                                onChange={handleInputChange}
                                className="form-control"
                                placeholder="pl. ferfi-ruhak"
                            />
                        </div>

                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                id="tizennyolc_plusz"
                                name="tizennyolc_plusz"
                                checked={formData.tizennyolc_plusz || false}
                                onChange={handleInputChange}
                                className="form-check-input"
                            />
                            <label htmlFor="tizennyolc_plusz" className="form-check-label">
                                18+ kategória
                            </label>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-success">
                                {editingCategory ? 'Mentés' : 'Hozzáadás'}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-secondary"
                                onClick={resetForm}
                            >
                                Mégse
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="category-table-container">
                <table className="category-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Név</th>
                            <th>Szülő kategória</th>
                            <th>Hivatkozás</th>
                            <th>18+</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="no-categories">
                                    Nincsenek kategóriák. Kattints az "Új kategória" gombra a hozzáadáshoz.
                                </td>
                            </tr>
                        ) : (
                            categories.map(category => (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.nev}</td>
                                    <td>
                                        {category.szulo_kategoria ? 
                                            categories.find(c => c.id === category.szulo_kategoria)?.nev || 'Ismeretlen' 
                                            : '-'}
                                    </td>
                                    <td>{category.hivatkozas || '-'}</td>
                                    <td>{category.tizennyolc_plusz ? 'Igen' : 'Nem'}</td>
                                    <td className="action-buttons">
                                        <button 
                                            className="btn btn-sm btn-info"
                                            onClick={() => handleEdit(category)}
                                        >
                                            Szerkesztés
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            Törlés
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CategoryList;
