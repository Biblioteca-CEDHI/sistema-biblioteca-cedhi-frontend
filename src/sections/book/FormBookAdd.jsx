import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import RadioGroup from '@mui/material/RadioGroup';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
//import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertCustomerDelete from './AlertBookDelete';
//import Avatar from '../../components/@extended/Avatar';
import IconButton from '../../components/@extended/IconButton';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';

//import { ThemeMode, Gender } from '../../config';
import { openSnackbar } from '../../api/snackbar';
import { insertBook, updateBook } from '../../api/books';

// assets
import { Trash } from 'iconsax-react';

// ==============================|| BOOK ADD / EDIT - FORM ||============================== //

export default function FormBookAdd({ book, closeModal }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const BookSchema = Yup.object().shape({
    ubicacion_estanteria: Yup.string().max(255).required('La ubicación es obligatorio'),
    titulo: Yup.string().max(255).required('El título es obligatorio'),
    autor: Yup.string().max(255).required('El autor es obligatorio'),
    codigo_dewey: Yup.number(),
    notacion_interna: Yup.string().max(255).required('La notación interna es obligatorio'),
    codigo: Yup.string().max(255).required('El código es obligatorio'),
    isbn: Yup.string().max(255),
    editorial: Yup.string().max(255).required('El editorial es obligatorio'),
    tema: Yup.string().max(255).required('El tema es obligatorio'),
    idioma: Yup.string().max(255).required('El idioma es obligatorio'),
    tipo_material: Yup.string().max(255).required('El tipo de material es obligatorio'),
    num_paginas: Yup.number().required('El núm. de páginas es obligatorio').min(1, 'Debe ser mayor o igual a 1 página'),
    num_edicion: Yup.string().max(255).required('El núm de edición es obligatorio'),
    ciudad: Yup.string().max(255).required('La ciudad es obligatorio'),
    ano: Yup.number().required('El año de publicación es obligatorio'),
    tabla_contenido: Yup.string(),
    disponibilidad: Yup.boolean().required('La disponibilidad es obligatorio'),
    url_cover: Yup.string().max(255)
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: {
      registro: book?.registro || '',
      ubicacion_estanteria: book?.ubicacion_estanteria || '',
      titulo: book?.titulo || '',
      autor: book?.autor || '',
      codigo_dewey: book?.codigo_dewey || '',
      notacion_interna: book?.notacion_interna || '',
      codigo: book?.codigo || '',
      isbn: book?.isbn || '',
      editorial: book?.editorial || '',
      tema: book?.tema || '',
      idioma: book?.idioma || '',
      tipo_material: book?.tipo_material || '',
      num_paginas: book?.num_paginas || '',
      num_edicion: book?.num_edicion || '',
      ciudad: book?.ciudad || '',
      ano: book?.ano || '',
      tabla_contenido: book?.tabla_contenido || '',
      disponibilidad: book?.disponibilidad || false,
      url_cover: book?.url_cover || ''
    },
    validationSchema: BookSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newBook = values;
        // EDITAR UN LIBRO
        if (book) {
          updateBook(newBook).then(() => {
            openSnackbar({
              open: true,
              message: 'Actualización del libro exitosa.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            closeModal();
          });
        } else {
          // AGREGAR UN LIBRO
          await insertBook(newBook).then(() => {
            openSnackbar({
              open: true,
              message: 'Libro añadido con éxito.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            closeModal();
          });
        }
      } catch (error) {
        console.log(error);
        openSnackbar({
          open: true,
          message: 'Ocurrió un error inesperado. Por favor, inténtelo nuevamente.',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{book ? 'Editar Libro' : 'Nuevo Libro'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-title">Título</InputLabel>
                        <TextField
                          fullWidth
                          id="book-title"
                          placeholder="Introduzca el título"
                          {...getFieldProps('titulo')}
                          error={Boolean(touched.titulo && errors.titulo)}
                          helperText={touched.titulo && errors.titulo}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-author">Autor</InputLabel>
                        <TextField
                          fullWidth
                          id="book-author"
                          placeholder="Introduzca el autor"
                          {...getFieldProps('autor')}
                          error={Boolean(touched.autor && errors.autor)}
                          helperText={touched.autor && errors.autor}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-table-contents">Tabla de Contenido</InputLabel>
                        <TextField
                          fullWidth
                          id="book-table-contents"
                          name="tabla_contenido"
                          multiline
                          rows={2}
                          placeholder="Introduzca la tabla de contenido"
                          {...getFieldProps('tabla_contenido')}
                          error={Boolean(touched.tabla_contenido && errors.tabla_contenido)}
                          helperText={touched.tabla_contenido && errors.tabla_contenido}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-ISBN">ISBN</InputLabel>
                        <TextField
                          fullWidth
                          id="book-ISBN"
                          placeholder="Introduzca el ISBN"
                          {...getFieldProps('isbn')}
                          error={Boolean(touched.isbn && errors.isbn)}
                          helperText={touched.isbn && errors.isbn}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-deweyCode">Código Dewey</InputLabel>
                        <TextField
                          fullWidth
                          type="number"
                          id="book-deweyCode"
                          placeholder="Introduzca el código Dewey"
                          {...getFieldProps('codigo_dewey')}
                          error={Boolean(touched.codigo_dewey && errors.codigo_dewey)}
                          helperText={touched.codigo_dewey && errors.codigo_dewey}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-code">Código</InputLabel>
                        <TextField
                          fullWidth
                          id="book-code"
                          placeholder="Introduzca el código"
                          {...getFieldProps('codigo')}
                          error={Boolean(touched.codigo && errors.codigo)}
                          helperText={touched.codigo && errors.codigo}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-internalCode">Notación interno</InputLabel>
                        <TextField
                          fullWidth
                          id="book-internalCode"
                          placeholder="Introduzca el código interno"
                          {...getFieldProps('notacion_interna')}
                          error={Boolean(touched.notacion_interna && errors.notacion_interna)}
                          helperText={touched.notacion_interna && errors.notacion_interna}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-publisher">Editorial</InputLabel>
                        <TextField
                          fullWidth
                          id="book-publisher"
                          placeholder="Introduzca la editorial"
                          {...getFieldProps('editorial')}
                          error={Boolean(touched.editorial && errors.editorial)}
                          helperText={touched.editorial && errors.editorial}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-editionNumber">Edición</InputLabel>
                        <TextField
                          fullWidth
                          id="book-editionNumber"
                          placeholder="Introduzca la edición"
                          {...getFieldProps('num_edicion')}
                          error={Boolean(touched.num_edicion && errors.num_edicion)}
                          helperText={touched.num_edicion && errors.num_edicion}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-subject">Tema</InputLabel>
                        <TextField
                          fullWidth
                          id="book-subject"
                          placeholder="Introduzca el tema"
                          {...getFieldProps('tema')}
                          error={Boolean(touched.tema && errors.tema)}
                          helperText={touched.tema && errors.tema}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-language">Idioma</InputLabel>
                        <TextField
                          fullWidth
                          id="book-language"
                          placeholder="Introduzca el idioma"
                          {...getFieldProps('idioma')}
                          error={Boolean(touched.idioma && errors.idioma)}
                          helperText={touched.idioma && errors.idioma}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-materialType">Material</InputLabel>
                        <TextField
                          fullWidth
                          id="book-materialType"
                          placeholder="Introduzca el material"
                          {...getFieldProps('tipo_material')}
                          error={Boolean(touched.tipo_material && errors.tipo_material)}
                          helperText={touched.tipo_material && errors.tipo_material}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-pageCount">Núm. Páginas</InputLabel>
                        <TextField
                          type="number"
                          fullWidth
                          id="book-pageCount"
                          placeholder="Introduzca el número de páginas"
                          {...getFieldProps('num_paginas')}
                          error={Boolean(touched.num_paginas && errors.num_paginas)}
                          helperText={touched.num_paginas && errors.num_paginas}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-city">Ciudad</InputLabel>
                        <TextField
                          fullWidth
                          id="book-city"
                          placeholder="Introduzca el país"
                          {...getFieldProps('ciudad')}
                          error={Boolean(touched.ciudad && errors.ciudad)}
                          helperText={touched.ciudad && errors.ciudad}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-publicationYear">Año de Publicación</InputLabel>
                        <TextField
                          type="number"
                          fullWidth
                          id="book-publicationYear"
                          placeholder="Introduzca el año de publicación"
                          {...getFieldProps('ano')}
                          error={Boolean(touched.ano && errors.ano)}
                          helperText={touched.ano && errors.ano}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-location">Ubicacion en Estanteria</InputLabel>
                        <TextField
                          fullWidth
                          id="book-location"
                          placeholder="Introduzca la ubicación en estanteria"
                          {...getFieldProps('ubicacion_estanteria')}
                          error={Boolean(touched.ubicacion_estanteria && errors.ubicacion_estanteria)}
                          helperText={touched.ubicacion_estanteria && errors.ubicacion_estanteria}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="book-url-cover">URL de Portada</InputLabel>
                        <TextField
                          fullWidth
                          id="book-urlCover"
                          placeholder="Introduzca el año de publicación"
                          {...getFieldProps('url_cover')}
                          error={Boolean(touched.url_cover && errors.url_cover)}
                          helperText={touched.url_cover && errors.url_cover}
                        />
                      </Stack>
                    </Grid>

                    {!book ? (
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="book-disponibilidad">Disponibilidad</InputLabel>
                          <RadioGroup
                            row
                            aria-label="payment-card"
                            {...getFieldProps('disponibilidad')}
                            onChange={(e) => {
                              if (!book) {
                                getFieldProps('disponibilidad').onChange(e); // Solo permite cambios si no es solo lectura en edit
                              }
                            }}
                          >
                            <FormControlLabel control={<Radio id="book-disponibilidad" value={true} />} label="Disponible" />
                            <FormControlLabel control={<Radio id="book-disponibilidad-false" value={false} />} label="No disponible" />
                          </RadioGroup>
                        </Stack>
                      </Grid>
                    ) : (
                      <></>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {book && (
                    <Tooltip title="Eliminar libro" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <Trash variant="Bold" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={closeModal}>
                      Cancelar
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {book ? 'Editar' : 'Agregar'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {book && <AlertCustomerDelete registro={book.registro} titulo={book.titulo} open={openAlert} handleClose={handleAlertClose} />}
    </>
  );
}

FormBookAdd.propTypes = { customer: PropTypes.any, closeModal: PropTypes.func };
