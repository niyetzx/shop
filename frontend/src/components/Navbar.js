import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Button,
    Box,
    IconButton,
    useTheme as useMuiTheme,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AuthService from '../services/auth.service';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
    const navigate = useNavigate();
    const currentUser = AuthService.getCurrentUser();
    const { currentTheme, toggleTheme } = useTheme();
    const muiTheme = useMuiTheme();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/login');
    };

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