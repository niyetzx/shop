import React from 'react';
import {
    Container, Typography, Card, CardContent, IconButton,
    Button, Grid, Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();

    const handleIncrement = (id, quantity) => {
        updateQuantity(id, quantity + 1);
    };

    const handleDecrement = (id, quantity) => {
        if (quantity > 1) {
            updateQuantity(id, quantity - 1);
        } else {
            removeFromCart(id);
        }
    };


    const handleRemove = (id) => {
        removeFromCart(id);
    };

    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Корзина</Typography>
            {cartItems.length === 0 ? (
                <Typography>Корзина пуста</Typography>
            ) : (
                <>
                    <Grid container spacing={2}>
                        {cartItems.map(item => (
                            <Grid item xs={12} md={6} key={item._id}>
                                <Card>
                                    {item.images && item.images.length > 0 && (
                                        <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            style={{ width: '100%', height: 200, objectFit: 'cover' }}
                                        />
                                    )}
                                    <CardContent>
                                        <Typography variant="h6">{item.name}</Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                            <IconButton onClick={() => handleDecrement(item._id, item.quantity)}><RemoveIcon /></IconButton>
                                            <Typography>{item.quantity}</Typography>
                                            <IconButton onClick={() => handleIncrement(item._id, item.quantity)}><AddIcon /></IconButton>
                                            <Typography sx={{ ml: 2 }}>{item.price} ₸ / шт</Typography>
                                        </Box>
                                        <Typography sx={{ mt: 1 }}>
                                            Сумма: {item.price * item.quantity} ₸
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            sx={{ mt: 1 }}
                                            onClick={() => handleRemove(item._id)}
                                        >
                                            Удалить
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Button
                        variant="contained"
                        color="warning"
                        sx={{ mt: 3 }}
                        onClick={clearCart}
                    >
                        Очистить корзину
                    </Button>
                </>
            )}
            <Typography variant="h6" sx={{ mt: 4 }}>Итого: {total} ₸</Typography>
        </Container>
    );
};

export default Cart;
