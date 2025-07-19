// services/cart.service.js
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5001/api/cart';

const getCart = async () => {
    const res = await axios.get(API_URL, { headers: authHeader() });
    return res.data;
};

const addToCart = async (productId, quantity = 1) => {
    const res = await axios.post(
        `${API_URL}/add`,
        { productId, quantity },
        { headers: authHeader() }
    );
    return res.data;
};

const removeFromCart = async (productId) => {
    const res = await axios.delete(`${API_URL}/remove/${productId}`, {
        headers: authHeader()
    });
    return res.data;
};

const updateQuantity = async (productId, quantity) => {
    const res = await axios.patch(
        `${API_URL}/update`,
        { productId, quantity },
        { headers: authHeader() }
    );
    return res.data;
};

const clearCart = async () => {
    const res = await axios.delete(`${API_URL}/clear`, {
        headers: authHeader()
    });
    return res.data;
};

const CartService = {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
};

export default CartService;
