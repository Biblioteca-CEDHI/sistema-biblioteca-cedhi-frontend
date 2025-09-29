import { useState, useEffect } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// project-imports
import EmptyUserCard from '../../components/cards/skeleton/EmptyUserCard';
import { DebouncedInput } from '../../components/third-party/react-table';
import BookCard from '../../sections/book/BookCard';
import BookModal from '../../sections/book/BookModal';

import usePagination from '../../hooks/usePagination';
import { useGetBooks } from '../../api/books';

// assets
import { Add, SearchNormal1 } from 'iconsax-react';

// constant
const allColumns = [
  {
    id: 1,
    header: 'Default'
  },
  {
    id: 2,
    header: 'Titulo'
  },
  {
    id: 3,
    header: 'Autor'
  },
  {
    id: 4,
    header: 'Editorial'
  },
  {
    id: 5,
    header: 'Páginas'
  },
  {
    id: 6,
    header: 'Tema'
  },
  {
    id: 7,
    header: 'Disponibilidad'
  }
];

function dataSort(data, sortBy) {
  return data.sort(function (a, b) {
    if (sortBy === 'Titulo') return b.titulo?.localeCompare(a.titulo);
    if (sortBy === 'Autor') return b.autor?.localeCompare(a.autor);
    if (sortBy === 'Editorial') return b.editorial?.localeCompare(a.editorial);
    if (sortBy === 'Páginas') return b.num_paginas < a.num_paginas ? 1 : -1;
    if (sortBy === 'Tema') return b.tema?.localeCompare(a.tema);
    if (sortBy === 'Disponibilidad') return b.disponibilidad < a.disponibilidad ? 1 : -1;
    return a;
  });
}

// ==============================|| BOOK - CARD ||============================== //

export default function Books() {
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const { books: lists } = useGetBooks(); 

  const [sortBy, setSortBy] = useState('Default');
  const [globalFilter, setGlobalFilter] = useState('');
  const [userCard, setUserCard] = useState([]);
  const [page, setPage] = useState(1);
  const [bookLoading, setBookLoading] = useState(true);
  const [bookModal, setBookModal] = useState(false);

  const handleChange = (event) => {
    setSortBy(event.target.value);
  };

  // search
  useEffect(() => {
    setBookLoading(true);
    if (lists && lists.length > 0) {
      const newData = lists.filter((value) => {
        if (globalFilter) {
          return (value.titulo?.toLowerCase().includes(globalFilter.toLowerCase()) || 
                  value.autor?.toLowerCase().includes(globalFilter.toLowerCase()) ||
                  value.tema?.toLowerCase().includes(globalFilter.toLowerCase())
                );
        } else {
          return value;
        }
      });
      setUserCard(dataSort(newData, sortBy).reverse());
      setBookLoading(false);
    }
    // eslint-disable-next-line
  }, [globalFilter, lists, sortBy]);

  const PER_PAGE = 6;

  const count = Math.ceil(userCard.length / PER_PAGE);
  const _DATA = usePagination(userCard, PER_PAGE);

  const handleChangePage = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <>
      <Box sx={{ position: 'relative', marginBottom: 3 }}>
        <Stack direction="row" alignItems="center">
          <Stack
            direction={matchDownSM ? 'column' : 'row'}
            sx={{ width: '100%' }}
            spacing={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <DebouncedInput
              id="book-search"
              value={globalFilter ?? ''}
              onFilterChange={(value) => setGlobalFilter(String(value))}
              placeholder={`Buscar en ${userCard.length} registros...`}
              startAdornment={<SearchNormal1 size={18} />}
            />
            <Stack direction={matchDownSM ? 'column' : 'row'} alignItems="center" spacing={1}>
              <FormControl sx={{ m: '8px !important', minWidth: 120 }}>
                <Select
                  id="book-sort" 
                  name="book-sort"
                  value={sortBy}
                  onChange={handleChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography variant="subtitle1">Ordenar por</Typography>;
                    }

                    return <Typography variant="subtitle2">Ordenar por ({sortBy})</Typography>;
                  }}
                >
                  {allColumns.map((column) => {
                    return (
                      <MenuItem key={column.id} value={column.header}>
                        {column.header}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={() => setBookModal(true)} size="large" startIcon={<Add />}>
              Agregar libro
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <Grid container spacing={3}>
        {!bookLoading && userCard.length > 0 ? (
          _DATA.currentData().map((book, index) => (
            <Slide key={index} direction="up" in={true} timeout={50}>
              <Grid item xs={12} sm={6} lg={4}>
                <BookCard book={book} />
              </Grid>
            </Slide>
          ))
        ) : (
          <EmptyUserCard title={bookLoading ? 'Cargando...' : 'Aún no has creado ningún libro.'} />
        )}
      </Grid>
      <Stack spacing={2} sx={{ p: 2.5 }} alignItems="flex-end">
        <Pagination
          sx={{ '& .MuiPaginationItem-root': { my: 0.5 } }}
          count={count}
          size="medium"
          page={page}
          showFirstButton
          showLastButton
          variant="combined"
          color="primary"
          onChange={handleChangePage}
        />
      </Stack>
      <BookModal open={bookModal} modalToggler={setBookModal} />
    </>
  );
}
