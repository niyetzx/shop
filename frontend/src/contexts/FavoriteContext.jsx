import React, { createContext, useContext, useState, useEffect } from 'react';

const FavoriteContext = createContext();

export const useFavorite = () => useContext(FavoriteContext);

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const updateFavorites = (items) => {
        setFavorites(items);
        localStorage.setItem('favorites', JSON.stringify(items));
    };

    const addToFavorites = (product) => {
        const exists = favorites.some(item => item._id === product._id);
        if (!exists) {
            updateFavorites([...favorites, product]);
        }
    };

    const removeFromFavorites = (productId) => {
        updateFavorites(favorites.filter(item => item._id !== productId));
    };

    const isFavorite = (productId) => {
        return favorites.some(item => item._id === productId);
    };

    return (
        <FavoriteContext.Provider value={{
            favorites,
            addToFavorites,
            removeFromFavorites,
            isFavorite
        }}>
            {children}
        </FavoriteContext.Provider>
    );
};
