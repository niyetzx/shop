import React, { useState, useEffect } from 'react';
import UserService from '../services/user.service';
import CategoryManagement from './CategoryManagement';
import {
    Container, Paper, Typography, Button, TextField, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent,
    DialogActions, MenuItem, Alert, IconButton, Select, Box, Tabs, Tab
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        username: '', email: '', password: '', role: 'user'
    });
    const [editUser, setEditUser] = useState({
        _id: '', username: '', email: '', password: ''
    });
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await UserService.getAllUsers();
            setUsers(response.data);
        } catch (err) {
            setError('Ошибка при загрузке пользователей');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditUser(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateUser = async () => {
        try {
            await UserService.createUser(newUser);
            setSuccess('Пользователь успешно создан');
            setOpenDialog(false);
            loadUsers();
            setNewUser({ username: '', email: '', password: '', role: 'user' });
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при создании');
        }
    };

    const handleUpdateUser = async () => {
        try {
            const updatedData = {
                username: editUser.username,
                email: editUser.email
            };

            if (editUser.password && editUser.password.trim() !== '') {
                updatedData.password = editUser.password;
            }

            await UserService.updateUser(editUser._id, updatedData);
            setSuccess('Пользователь обновлён');
            setEditDialogOpen(false);
            loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при обновлении');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Удалить пользователя?')) return;
        try {
            await UserService.deleteUser(userId);
            setSuccess('Удалено');
            loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при удалении');
        }
    };

    const handleEditClick = (user) => {
        setEditUser({
            _id: user._id,
            username: user.username,
            email: user.email,
            password: ''
        });
        setEditDialogOpen(true);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await UserService.updateUserRole(userId, newRole);
            setSuccess('Роль обновлена');
            loadUsers();
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка при обновлении роли');
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setDetailDialogOpen(true);
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        setError('');
        setSuccess('');
    };

    return (
        <Container component="main" maxWidth="lg">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography variant="h5" gutterBottom align="center">Админ панель</Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Пользователи" />
                        <Tab label="Категории" />
                    </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                    <Button variant="contained" onClick={() => setOpenDialog(true)} sx={{ mb: 2 }}>
                        Добавить пользователя
                    </Button>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Имя</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Роль</TableCell>
                                    <TableCell>Действия</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell>{user._id}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                                size="small"
                                            >
                                                <MenuItem value="user">Пользователь</MenuItem>
                                                <MenuItem value="admin">Администратор</MenuItem>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleEditClick(user)}><EditIcon /></IconButton>
                                            <Button onClick={() => handleUserClick(user)} size="small">Подробнее</Button>
                                            <IconButton color="error" onClick={() => handleDeleteUser(user._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Диалог создания */}
                    <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                        <DialogTitle>Создание пользователя</DialogTitle>
                        <DialogContent>
                            <TextField fullWidth margin="normal" label="Имя" name="username" value={newUser.username} onChange={handleInputChange} />
                            <TextField fullWidth margin="normal" label="Email" name="email" value={newUser.email} onChange={handleInputChange} />
                            <TextField fullWidth margin="normal" label="Пароль" name="password" type="password" value={newUser.password} onChange={handleInputChange} />
                            <TextField select fullWidth margin="normal" label="Роль" name="role" value={newUser.role} onChange={handleInputChange}>
                                <MenuItem value="user">Пользователь</MenuItem>
                                <MenuItem value="admin">Администратор</MenuItem>
                            </TextField>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
                            <Button onClick={handleCreateUser} variant="contained">Создать</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Диалог редактирования */}
                    <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
                        <DialogTitle>Редактировать пользователя</DialogTitle>
                        <DialogContent>
                            <TextField fullWidth margin="normal" label="Имя" name="username" value={editUser.username} onChange={handleEditInputChange} />
                            <TextField fullWidth margin="normal" label="Email" name="email" value={editUser.email} onChange={handleEditInputChange} />
                            <TextField fullWidth margin="normal" label="Пароль (оставьте пустым если без изменений)" name="password" type="password" value={editUser.password} onChange={handleEditInputChange} />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditDialogOpen(false)}>Отмена</Button>
                            <Button onClick={handleUpdateUser} variant="contained">Сохранить</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Диалог деталей */}
                    <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)}>
                        <DialogTitle>Информация о пользователе</DialogTitle>
                        <DialogContent>
                            {selectedUser && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography><strong>ID:</strong> {selectedUser._id}</Typography>
                                    <Typography><strong>Имя:</strong> {selectedUser.username}</Typography>
                                    <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                                    <Typography><strong>Роль:</strong> {selectedUser.role}</Typography>
                                    <Typography><strong>Дата регистрации:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</Typography>
                                </Box>
                            )}
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setDetailDialogOpen(false)}>Закрыть</Button>
                        </DialogActions>
                    </Dialog>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                    <CategoryManagement />
                </TabPanel>
            </Paper>
        </Container>
    );
};

export default AdminPanel;