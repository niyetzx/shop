import React, { useState, useEffect } from 'react';
import AuthService from '../services/auth.service';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    Avatar,
    Divider,
} from '@mui/material';

const Profile = () => {
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        profile: {
            firstName: '',
            lastName: '',
            avatar: '',
        },
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await AuthService.getUserProfile();
            const userData = response.data;
            setProfile({
                username: userData.username || '',
                email: userData.email || '',
                profile: {
                    firstName: userData.profile?.firstName || '',
                    lastName: userData.profile?.lastName || '',
                    avatar: userData.profile?.avatar || '',
                },
            });
        } catch (err) {
            setError('Ошибка при загрузке профиля');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await AuthService.updateUserProfile({
                username: profile.username,
                email: profile.email,
                profile: {
                    firstName: profile.profile?.firstName || '',
                    lastName: profile.profile?.lastName || '',
                    avatar: profile.profile?.avatar || '',
                },
            });
            setSuccess('Профиль успешно обновлен');
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при обновлении профиля');
            setSuccess('');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            setPasswordError('Новые пароли не совпадают');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setPasswordError('Новый пароль должен быть не менее 6 символов');
            return;
        }

        try {
            await AuthService.changePassword(
                passwordData.currentPassword,
                passwordData.newPassword
            );
            setPasswordSuccess('Пароль успешно изменен');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        } catch (err) {
            setPasswordError(err.response?.data?.message || 'Ошибка при изменении пароля');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (['currentPassword', 'newPassword', 'confirmNewPassword'].includes(name)) {
            setPasswordData((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else if (name.includes('profile.')) {
            const profileField = name.split('.')[1];
            setProfile((prev) => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [profileField]: value,
                },
            }));
        } else {
            setProfile((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    if (loading) {
        return (
            <Container component="main" maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                    <Typography>Загрузка профиля...</Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                    <Avatar
                        src={profile.profile?.avatar || ''}
                        sx={{ width: 100, height: 100, mb: 2 }}
                    />
                    <Typography component="h1" variant="h5">
                        Профиль пользователя
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Имя пользователя"
                        name="username"
                        value={profile.username || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={profile.email || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Имя"
                        name="profile.firstName"
                        value={profile.profile?.firstName || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Фамилия"
                        name="profile.lastName"
                        value={profile.profile?.lastName || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="URL аватара"
                        name="profile.avatar"
                        value={profile.profile?.avatar || ''}
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3 }}
                    >
                        Сохранить изменения
                    </Button>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Форма изменения пароля */}
                <Typography component="h2" variant="h6" align="center" gutterBottom>
                    Изменение пароля
                </Typography>

                {passwordError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {passwordError}
                    </Alert>
                )}
                {passwordSuccess && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {passwordSuccess}
                    </Alert>
                )}

                <Box component="form" onSubmit={handlePasswordChange}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Текущий пароль"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handleChange}
                        autoComplete="current-password"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Новый пароль"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Подтвердите новый пароль"
                        name="confirmNewPassword"
                        type="password"
                        value={passwordData.confirmNewPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 3 }}
                    >
                        Изменить пароль
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Profile;