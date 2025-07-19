import React, { useState, useEffect } from 'react';
import ProductService from '../services/product.service';
import AuthService from '../services/auth.service';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    Box,
    Alert,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel, IconButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useFavorite } from '../contexts/FavoriteContext';
import { useCart } from '../contexts/CartContext';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Tooltip from '@mui/material/Tooltip';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [aggregateData, setAggregateData] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorite();
    const { addToCart } = useCart();

    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        category: '',
        images: []
    });

    const currentUser = AuthService.getCurrentUser();
    const isAdmin = currentUser?.user?.role === 'admin';

    useEffect(() => {
        loadProducts();
        loadCategories();
        if (isAdmin) {
            loadAggregateData();
        }
    }, [isAdmin]);

    const loadCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/categories/');
            setCategories(response.data);
        } catch (err) {
            setError('Ошибка при загрузке категорий');
        }
    };

    const loadProducts = async () => {
        try {
            const response = await ProductService.getAllProducts();
            setProducts(response.data);
            setError('');
        } catch (err) {
            setError('Ошибка при загрузке товаров');
        } finally {
            setLoading(false);
        }
    };

    const loadAggregateData = async () => {
        try {
            const response = await ProductService.getAggregateData();
            setAggregateData(response.data);
        } catch (err) {
            console.error('Ошибка при загрузке агрегированных данных:', err);
        }
    };

    const handleAddProduct = async () => {
        if (!newProduct.category) {
            setError('Пожалуйста, выберите категорию');
            return;
        }

        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('category', newProduct.category);
        for (let i = 0; i < newProduct.images.length; i++) {
            formData.append('images', newProduct.images[i]);
        }

        try {
            await ProductService.addProduct(formData);
            setSuccess('Товар успешно добавлен');
            setOpenDialog(false);
            setNewProduct({ name: '', price: '', category: '', images: [] });
            loadProducts();
            if (isAdmin) loadAggregateData();
        } catch (err) {
            setError('Ошибка при добавлении товара');
        }
    };

    const handleUpdateProduct = async () => {
        if (!editingProduct.category) {
            setError('Пожалуйста, выберите категорию');
            return;
        }

        const formData = new FormData();
        formData.append('name', editingProduct.name);
        formData.append('price', editingProduct.price);
        formData.append('category', editingProduct.category);
        for (let i = 0; i < editingProduct.images?.length; i++) {
            formData.append('images', editingProduct.images[i]);
        }

        try {
            await ProductService.updateProduct(editingProduct._id, formData);
            setSuccess('Товар успешно обновлен');
            setEditingProduct(null);
            loadProducts();
            if (isAdmin) loadAggregateData();
        } catch (err) {
            setError('Ошибка при обновлении товара');
        }
    };

    const handleDeleteProduct = async (productId) => {
        try {
            await ProductService.deleteProduct(productId);
            setSuccess('Товар успешно удален');
            loadProducts();
            if (isAdmin) {
                loadAggregateData();
            }
        } catch (err) {
            setError('Ошибка при удалении товара');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditingProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <Container>
                <Typography>Загрузка товаров...</Typography>
            </Container>
        );
    }


    return (
        <Container>
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" gutterBottom>
                        Товары
                    </Typography>
                    {isAdmin && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setOpenDialog(true)}
                        >
                            Добавить товар
                        </Button>
                    )}
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

                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <Card sx={{ boxShadow: 3 }}>
                                {product.images && product.images.length > 0 && (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        style={{ width: '100%', height: 350, objectFit: 'cover' }}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Категория: {product.category?.name || 'Не указана'}
                                    </Typography>
                                    <Typography variant="body1" color="primary" sx={{ mt: 1 }}>
                                        Цена: {product.price} ₸
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        {/* Избранное */}
                                        <Tooltip title={isFavorite(product._id) ? "Убрать из избранного" : "Добавить в избранное"}>
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    isFavorite(product._id)
                                                        ? removeFromFavorites(product._id)
                                                        : addToFavorites(product)
                                                }
                                            >
                                                {isFavorite(product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                            </IconButton>
                                        </Tooltip>

                                        {/* В корзину */}
                                        <Tooltip title="В корзину">
                                            <IconButton color="secondary" onClick={() => addToCart(product)}>
                                                <ShoppingCartIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>

                                    {isAdmin && (
                                        <>
                                            <Button
                                                size="small"
                                                color="primary"
                                                onClick={() => setEditingProduct(product)}
                                            >
                                                Редактировать
                                            </Button>
                                            <Button
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteProduct(product._id)}
                                            >
                                                Удалить
                                            </Button>
                                        </>
                                    )}
                                </CardActions>

                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {isAdmin && aggregateData.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Статистика по категориям
                        </Typography>
                        <Grid container spacing={2}>
                            {aggregateData.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item._id}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">
                                                Категория: {categories.find(c => c._id === item._id)?.name || 'Без категории'}
                                            </Typography>
                                            <Typography>
                                                Общая стоимость: {item.total} ₸
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Добавить новый товар</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            name="name"
                            label="Название товара"
                            fullWidth
                            value={newProduct.name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="dense"
                            name="price"
                            label="Цена"
                            type="number"
                            fullWidth
                            value={newProduct.price}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Категория</InputLabel>
                            <Select
                                name="category"
                                value={newProduct.category}
                                onChange={handleChange}
                                label="Категория"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category._id} value={category._id}>
                                        {category.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            type="file"
                            inputProps={{ multiple: true }}
                            onChange={(e) => setNewProduct({ ...newProduct, images: e.target.files })}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
                        <Button onClick={handleAddProduct}>Добавить</Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={!!editingProduct} onClose={() => setEditingProduct(null)}>
                    <DialogTitle>Редактировать товар</DialogTitle>
                    <DialogContent>
                        {editingProduct && (
                            <>
                                <TextField
                                    margin="dense"
                                    name="name"
                                    label="Название товара"
                                    fullWidth
                                    value={editingProduct.name}
                                    onChange={handleEditChange}
                                />
                                <TextField
                                    margin="dense"
                                    name="price"
                                    label="Цена"
                                    type="number"
                                    fullWidth
                                    value={editingProduct.price}
                                    onChange={handleEditChange}
                                />
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Категория</InputLabel>
                                    <Select
                                        name="category"
                                        value={editingProduct.category}
                                        onChange={handleEditChange}
                                        label="Категория"
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category._id} value={category._id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField
                                    margin="dense"
                                    type="file"
                                    inputProps={{ multiple: true }}
                                    onChange={(e) => setEditingProduct({ ...editingProduct, images: e.target.files })}
                                    fullWidth
                                />
                            </>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditingProduct(null)}>Отмена</Button>
                        <Button onClick={handleUpdateProduct}>Сохранить</Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Container>
    );
};

export default Products;