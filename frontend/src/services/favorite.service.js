import axios from 'axios';

const API_URL = 'http://localhost:5001/api/favorites';

const getFavorites = () => axios.get(API_URL);
const addFavorite = (productId) => axios.post(API_URL, { productId });
const removeFavorite = (productId) => axios.delete(`${API_URL}/${productId}`);

export default {
    getFavorites,
    addFavorite,
    removeFavorite,
};
