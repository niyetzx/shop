import React from 'react';
import {
    Container, Typography, Grid, Card, CardContent, IconButton, Box, Tooltip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useFavorite } from '../contexts/FavoriteContext';
import { useCart } from '../contexts/CartContext';

const Favorites = () => {
    const { favorites, removeFromFavorites } = useFavorite();
    const { addToCart } = useCart();


    return (
        <Container>
            <Typography variant="h4" gutterBottom>Избранные товары</Typography>
            {favorites.length === 0 ? (
                <Typography>У вас нет избранных товаров.</Typography>
            ) : (
                <Grid container spacing={3}>
                    {favorites.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <Card>
                                {product.images?.[0] && (
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        style={{ width: '100%', height: 200, objectFit: 'cover' }}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6">{product.name}</Typography>
                                    <Typography>Цена: {product.price} ₸</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                        <Tooltip title="Убрать из избранного">
                                            <IconButton
                                                color="error"
                                                onClick={() => removeFromFavorites(product._id)}
                                            >
                                                <FavoriteIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="В корзину">
                                            <IconButton color="secondary" onClick={() => addToCart(product)}>
                                                <ShoppingCartIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Favorites;
