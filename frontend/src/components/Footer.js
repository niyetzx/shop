import React from 'react';
import { Box, Container, Typography, Link, useTheme } from '@mui/material';

const Footer = () => {
    const theme = useTheme();

    return (
        <Box
            component="footer"
            sx={{
                py: 3,
                px: 2,
                mt: 'auto',
                backgroundColor: theme.palette.mode === 'light'
                    ? theme.palette.grey[200]
                    : theme.palette.grey[800],
            }}
        >
            <Container maxWidth="lg">
                <Typography variant="body2" color="text.secondary" align="center">
                    © {new Date().getFullYear()}{' '}
                    <Link color="inherit" href="/">
                        Магазин
                    </Link>
                    {' • '}
                    <Link color="inherit" href="/about">
                        О нас
                    </Link>
                    {' • '}
                    <Link color="inherit" href="/contacts">
                        Контакты
                    </Link>
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 1 }}
                >
                    Все права защищены
                </Typography>
            </Container>
        </Box>
    );
};

export default Footer;