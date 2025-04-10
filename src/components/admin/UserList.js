import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/axiosConfig';
import './UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({
        vezeteknev: '',
        keresztnev: '',
        email: '',
        telefon: '',
        szerepkor: ''
    });
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            console.log('Fetching users from API...');
            const response = await axiosInstance.get('/admin/users');
            console.log('Fetched users:', response.data);
            // Log each user's role for debugging
            response.data.forEach(user => {
                console.log(`User ${user.email} has role: "${user.szerepkor}"`);
            });
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Hiba történt a felhasználók betöltése közben');
            setLoading(false);
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditForm({
            vezeteknev: user.vezeteknev || '',
            keresztnev: user.keresztnev || '',
            email: user.email || '',
            telefon: user.telefon || '',
            szerepkor: user.szerepkor || 'user'
        });
    };

    const handleCancelEdit = () => {
        setEditingUser(null);
        setEditForm({
            vezeteknev: '',
            keresztnev: '',
            email: '',
            telefon: '',
            szerepkor: ''
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Updating user with data:', editForm);
            const response = await axiosInstance.put(
                `/admin/users/${editingUser.id}`,
                editForm
            );

            console.log('Update response:', response.data);
            
            // Update the users list with the updated user
            setUsers(users.map(user => 
                user.id === editingUser.id ? response.data.user : user
            ));

            // Close the edit form
            handleCancelEdit();
        } catch (err) {
            console.error('Error updating user:', err);
            setError(err.response?.data?.message || 'Hiba történt a felhasználó módosítása során');
        }
    };

    const handleDeleteClick = (user) => {
        setDeleteConfirm(user);
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;
        
        try {
            console.log(`Deleting user with ID: ${deleteConfirm.id}`);
            await axiosInstance.delete(`/admin/users/${deleteConfirm.id}`);
            
            // Remove the user from the list
            setUsers(users.filter(user => user.id !== deleteConfirm.id));
            
            // Clear the confirmation
            setDeleteConfirm(null);
        } catch (err) {
            console.error('Error deleting user:', err);
            setError(err.response?.data?.message || 'Hiba történt a felhasználó törlése során');
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            // Check if the date string includes time information
            if (dateString.includes(':')) {
                // Format with date and time
                const date = new Date(dateString);
                return new Intl.DateTimeFormat('hu-HU', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                }).format(date);
            } else {
                // Format date only
                return new Date(dateString).toLocaleDateString('hu-HU');
            }
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    const getRoleDisplayName = (role) => {
        // Convert to lowercase for case-insensitive comparison
        const normalizedRole = role ? role.toLowerCase() : '';
        
        switch (normalizedRole) {
            case 'admin':
                return 'Adminisztrátor';
            case 'user':
            case 'felhasznalo':
                return 'Felhasználó';
            default:
                return role || '';
        }
    };

    if (loading) {
        return <div className="loading">Felhasználók betöltése...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="user-list-container">
            <h2>Felhasználók kezelése</h2>
            
            {deleteConfirm && (
                <div className="delete-confirm-modal">
                    <div className="delete-confirm-content">
                        <h3>Felhasználó törlése</h3>
                        <p>Biztosan törölni szeretné ezt a felhasználót?</p>
                        <p><strong>{deleteConfirm.vezeteknev} {deleteConfirm.keresztnev}</strong> ({deleteConfirm.email})</p>
                        <div className="delete-confirm-buttons">
                            <button onClick={confirmDelete} className="delete-confirm-btn">Törlés</button>
                            <button onClick={cancelDelete} className="delete-cancel-btn">Mégse</button>
                        </div>
                    </div>
                </div>
            )}
            
            {editingUser && (
                <div className="edit-form-container">
                    <h3>Felhasználó szerkesztése</h3>
                    <form onSubmit={handleSubmit} className="edit-form">
                        <div className="form-group">
                            <label htmlFor="vezeteknev">Vezetéknév:</label>
                            <input
                                type="text"
                                id="vezeteknev"
                                name="vezeteknev"
                                value={editForm.vezeteknev}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="keresztnev">Keresztnév:</label>
                            <input
                                type="text"
                                id="keresztnev"
                                name="keresztnev"
                                value={editForm.keresztnev}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={editForm.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="telefon">Telefon:</label>
                            <input
                                type="text"
                                id="telefon"
                                name="telefon"
                                value={editForm.telefon}
                                onChange={handleInputChange}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="szerepkor">Szerepkör:</label>
                            <select
                                id="szerepkor"
                                name="szerepkor"
                                value={editForm.szerepkor}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="user">Felhasználó</option>
                                <option value="admin">Adminisztrátor</option>
                            </select>
                        </div>
                        
                        <div className="form-buttons">
                            <button type="submit" className="save-button">Mentés</button>
                            <button type="button" className="cancel-button" onClick={handleCancelEdit}>Mégse</button>
                        </div>
                    </form>
                </div>
            )}
            
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Név</th>
                        <th>Email</th>
                        <th>Telefon</th>
                        <th>Szerepkör</th>
                        <th>Regisztráció dátuma</th>
                        <th>Utolsó belépés</th>
                        <th>Műveletek</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.vezeteknev} {user.keresztnev}</td>
                            <td>{user.email}</td>
                            <td>{user.telefon || '-'}</td>
                            <td>
                                <span className={`role-badge ${(user.szerepkor || '').toLowerCase()}`}>
                                    {getRoleDisplayName(user.szerepkor)}
                                </span>
                            </td>
                            <td>{formatDate(user.letrehozva)}</td>
                            <td>{formatDate(user.utolso_belepes)}</td>
                            <td className="action-buttons">
                                <button 
                                    className="edit-button"
                                    onClick={() => handleEditClick(user)}
                                >
                                    Szerkesztés
                                </button>
                                <button 
                                    className="delete-button"
                                    onClick={() => handleDeleteClick(user)}
                                >
                                    Törlés
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
