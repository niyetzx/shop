import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    IconButton,
    useTheme as useMuiTheme,
    Badge
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AuthService from '../services/auth.service';
import { useTheme } from '../contexts/ThemeContext';
import { useCart } from '../contexts/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useFavorite } from '../contexts/FavoriteContext';


const Navbar = () => {
    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();
    const { currentTheme, toggleTheme } = useTheme();
    const muiTheme = useMuiTheme();
    const { cartItems } = useCart();
    const { favorites } = useFavorite();


    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <AppBar position="static">
            <Toolbar>
                {/* Левая часть: Магазин */}
                <Button
                    component={Link}
                    to="/"
                    color="inherit"
                    sx={{ textTransform: 'none', fontSize: '1.25rem' }}
                >
                    Магазин
                </Button>

                <Box sx={{ flexGrow: 1 }} />

                {/* Переключатель темы */}
                <IconButton
                    sx={{ mr: 2 }}
                    onClick={toggleTheme}
                    color="inherit"
                >
                    {currentTheme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>

                {/* Корзина с количеством */}
                <Button color="inherit" component={Link} to="/cart">
                    <Badge badgeContent={totalQuantity} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                </Button>
                <Button color="inherit" component={Link} to="/favorites">
                    <Badge badgeContent={favorites.length} color="error">
                        <FavoriteIcon />
                    </Badge>
                </Button>

                {currentUser ? (
                    <>
                        <Button color="inherit" component={Link} to="/">
                            Товары
                        </Button>
                        {currentUser.user.role === 'admin' && (
                            <Button color="inherit" component={Link} to="/admin">
                                Админ панель
                            </Button>
                        )}
                        <Button color="inherit" component={Link} to="/profile">
                            Профиль
                        </Button>
                        <Button color="inherit" onClick={handleLogout}>
                            Выйти
                        </Button>
                    </>
                ) : (
                    <>
                        <Button color="inherit" component={Link} to="/login">
                            Войти
                        </Button>
                        <Button color="inherit" component={Link} to="/register">
                            Регистрация
                        </Button>
                    </>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
