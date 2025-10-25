import { Box, Stack, Typography } from '@mui/material';
import { Star1 } from 'iconsax-react';
import { useFavoriteBooks } from '../../../api/books';
import MainCard from '../../../components/MainCard';
import SimpleBar from '../../../components/third-party/SimpleBar';

export default function FavoritesBooksList() {
    const { favoriteBooksLoading, favoriteBooks: books } = useFavoriteBooks();

    return (
        <MainCard sx={{ p: 2, minHeight: 200 }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                Mis Libros Favoritos
            </Typography>

            {favoriteBooksLoading && (
                <Typography variant="body2" color="textSecondary">
                    Cargando libros favoritos...
                </Typography>
            )}

            {!favoriteBooksLoading && (!books || books.length === 0) && (
                <Stack
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    sx={{ py: 6 }}
                >
                    <Star1 size={48} variant="Bulk" color="#FFC107" />
                    <Typography variant="h6" color="textSecondary">
                        No tienes libros favoritos
                    </Typography>
                </Stack>
            )}

            {!favoriteBooksLoading && books && books.length > 0 && (
                <SimpleBar sx={{ maxHeight: 270 }}>
                    {books.map((book) => (
                        <Box
                            key={book.registro}
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: 'action.selected', cursor: 'pointer' }
                            }}
                        >
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ flexShrink: 0 }}>
                                <Star1 size={24} variant="Bold" color="#FFC107" style={{ flexShrink: 0 }} />
                                <Stack spacing={0.3}>
                                    <Typography variant="subtitle1">{book.titulo}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {book.autor} &middot; {book.tema}
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    ))}
                </SimpleBar>
            )}
        </MainCard>
    );
}
