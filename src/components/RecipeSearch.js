import React, { useState } from 'react';
import './RecipeSearch.css';

const RecipeSearch = () => {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [categories] = useState([
        'Zöldségek',
        'Gyümölcsök',
        'Húsok',
        'Tejtermékek',
        'Gabonafélék',
        'Fűszerek',
        'Egyéb'
    ]);
    const [activeCategory, setActiveCategory] = useState('Zöldségek');
    const [searchCount, setSearchCount] = useState(0);

    const categorizedIngredients = {
        'Zöldségek': ['paradicsom', 'paprika', 'hagyma', 'uborka', 'répa', 'káposzta', 'cukkini', 'padlizsán', 'brokkoli', 'karfiol'],
        'Gyümölcsök': ['alma', 'körte', 'banán', 'narancs', 'citrom', 'eper', 'málna', 'szilva', 'barack', 'szőlő'],
        'Húsok': ['csirkemell', 'sertéskaraj', 'darált hús', 'hal', 'pulykamell', 'marha hús', 'csirkecomb', 'bacon', 'kolbász'],
        'Tejtermékek': ['tej', 'sajt', 'tejföl', 'vaj', 'joghurt', 'túró', 'tejszín', 'mascarpone', 'krémsajt'],
        'Gabonafélék': ['liszt', 'rizs', 'tészta', 'zabpehely', 'kuszkusz', 'bulgur', 'quinoa', 'köles', 'hajdina'],
        'Fűszerek': ['só', 'bors', 'pirospaprika', 'oregánó', 'bazsalikom', 'kakukkfű', 'rozmaring', 'fahéj', 'szerecsendió'],
        'Egyéb': ['tojás', 'olaj', 'ecet', 'cukor', 'méz', 'mustár', 'majonéz', 'ketchup', 'szójaszósz']
    };

    const handleIngredientToggle = (ingredient) => {
        setSelectedIngredients(prevIngredients => {
            if (prevIngredients.includes(ingredient)) {
                return prevIngredients.filter(i => i !== ingredient);
            } else {
                return [...prevIngredients, ingredient];
            }
        });
    };

    const removeIngredient = (ingredient) => {
        setSelectedIngredients(prevIngredients => 
            prevIngredients.filter(i => i !== ingredient)
        );
    };

    const clearSelection = () => {
        setSelectedIngredients([]);
    };

    const searchRecipes = () => {
        if (selectedIngredients.length === 0) return;

        const searchQuery = `recept ${selectedIngredients.join(' ')}`;
        window.open(`https://www.nosalty.hu/kereses/recept/${encodeURIComponent(searchQuery)}`, '_blank');
        setSearchCount(prev => prev + 1);
    };

    return (
        <div className="recipe-search-container">
            <h1>Receptkereső</h1>
            <p className="search-description">
                Válassza ki a rendelkezésre álló alapanyagokat, és mi megkeressük a legjobb recepteket a Nosalty oldalon!
                {searchCount > 0 && ` Már ${searchCount} keresést végeztél.`}
            </p>

            <div className="search-panel">
                <div className="categories-panel">
                    <h2>Alapanyagok</h2>
                    <div className="category-tabs">
                        {categories.map(category => (
                            <button
                                key={category}
                                className={`category-tab ${activeCategory === category ? 'active' : ''}`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <div className="ingredients-grid">
                        {categorizedIngredients[activeCategory]?.map(ingredient => (
                            <label key={ingredient} className="ingredient-checkbox">
                                <input
                                    type="checkbox"
                                    checked={selectedIngredients.includes(ingredient)}
                                    onChange={() => handleIngredientToggle(ingredient)}
                                />
                                {ingredient}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="selected-ingredients">
                    <h3>Kiválasztott alapanyagok ({selectedIngredients.length}):</h3>
                    <div className="selected-ingredients-list">
                        {selectedIngredients.length === 0 ? (
                            <span style={{ color: '#666' }}>Még nem választottál alapanyagokat</span>
                        ) : (
                            <>
                                {selectedIngredients.map(ingredient => (
                                    <span key={ingredient} className="ingredient-tag">
                                        {ingredient}
                                        <button onClick={() => removeIngredient(ingredient)} title="Eltávolítás">&times;</button>
                                    </span>
                                ))}
                                <button 
                                    onClick={clearSelection}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#666',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        textDecoration: 'underline'
                                    }}
                                >
                                    Összes törlése
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <button
                    onClick={searchRecipes}
                    disabled={selectedIngredients.length === 0}
                    className="search-button"
                >
                    {selectedIngredients.length === 0 
                        ? 'Válassz ki alapanyagokat'
                        : `Receptek keresése (${selectedIngredients.length} alapanyaggal)`}
                </button>
            </div>
        </div>
    );
};

export default RecipeSearch;
