import React, { createContext, useContext, useEffect, useState } from 'react';
import CartService from '../services/cart.service'; // подключаем API

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    // Получаем корзину при загрузке
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const cart = await CartService.getCart();
                const transformed = cart.items.map(item => ({
                    _id: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    images: item.product.images,
                    quantity: item.quantity
                }));
                setCartItems(transformed);
            } catch (err) {
                console.error('Ошибка при загрузке корзины:', err.message);
            }
        };
        fetchCart();
    }, []);

    const refreshCart = async () => {
        try {
            const cart = await CartService.getCart();
            const transformed = cart.items.map(item => ({
                _id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                images: item.product.images,
                quantity: item.quantity
            }));
            setCartItems(transformed);
        } catch (err) {
            console.error('Ошибка при обновлении корзины:', err.message);
        }
    };

    const addToCart = async (product) => {
        try {
            await CartService.addToCart(product._id, 1);
            await refreshCart();
        } catch (err) {
            console.error('Ошибка при добавлении в корзину:', err.message);
        }
    };

    const removeFromCart = async (productId) => {
        try {
            await CartService.removeFromCart(productId);
            await refreshCart();
        } catch (err) {
            console.error('Ошибка при удалении из корзины:', err.message);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        try {
            await CartService.updateQuantity(productId, quantity);
            await refreshCart();
        } catch (err) {
            console.error('Ошибка при обновлении количества:', err.message);
        }
    };

    const clearCart = async () => {
        try {
            await CartService.clearCart();
            setCartItems([]);
        } catch (err) {
            console.error('Ошибка при очистке корзины:', err.message);
        }
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            refreshCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
