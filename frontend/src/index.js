import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from './contexts/ThemeContext';
import {CartProvider} from "./contexts/CartContext";
import { FavoriteProvider } from './contexts/FavoriteContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <FavoriteProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </FavoriteProvider>
        </ThemeProvider>
    </React.StrictMode>
);

reportWebVitals();