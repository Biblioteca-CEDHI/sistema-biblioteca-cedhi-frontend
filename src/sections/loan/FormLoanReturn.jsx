import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { insertLoanReturn } from '../../api/loans';

// third party
import * as Yup from 'yup';
import { useFormik, FormikProvider } from 'formik';

// project imports
import MainCard from '../../components/MainCard';
import Avatar from '../../components/@extended/Avatar';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';
import { openSnackbar } from '../../api/snackbar';

// assets
import { Book } from 'iconsax-react';

const validationSchema = Yup.object().shape({
  id_prestamo: Yup.number().required('El ID del prestamo es obligatoria'),
  fecha_real: Yup.date().required('La fecha de devolución es obligatoria'),
  // codigo: Yup.number(),
  dias: Yup.number()
});

export default function FormLoanReturn({ loanReturn, closeModal }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const formik = useFormik({
    initialValues: {
      id_prestamo: loanReturn.id_prestamo,
      fecha_real: new Date(),
      codigo: loanReturn.codigo,
      dias: 0
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newLoanReturn = values;
        await insertLoanReturn(newLoanReturn).then(() => {
          openSnackbar({
            open: true,
            message: 'Se registró el préstamo.',
            variant: 'alert',

            alert: {
              color: 'success'
            }
          });
          setSubmitting(false);
          closeModal();
        });
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
      <Box id="PopupPrint" sx={{ px: { xs: 2, sm: 3, md: 5 }, py: 1 }}>
        <FormikProvider value={formik}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form onSubmit={formik.handleSubmit} id="google-map-formss">
              <DialogTitle sx={{ px: 0 }}>
                <List sx={{ width: 1, p: 0 }}>
                  <ListItem disablePadding>
                    <ListItemAvatar sx={{ mr: 0.75 }}>
                      <Avatar alt="c" size="lg" src="w">
                        <Book />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography variant="h5">{loanReturn?.book_loan}</Typography>}
                      secondary={<Typography color="secondary">{loanReturn?.registro_book}</Typography>}
                    />
                  </ListItem>
                </List>
              </DialogTitle>
              <Divider />
              <DialogContent sx={{ p: 2.5 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={8} xl={9}>
                    <Grid container spacing={2.25}>
                      <Grid item xs={12}>
                        <MainCard title="Devolución del Libro">
                          <Grid container spacing={3.5}>
                            <Grid item xs={12} sm={8}>
                              <Stack spacing={1}>
                                <InputLabel>DNI del Usuario</InputLabel>
                                <TextField
                                  fullWidth
                                  id="customer-firstName"
                                  placeholder="Nombre del Usuario"
                                  value={loanReturn?.codigo}
                                  InputProps={{
                                    readOnly: true
                                  }}
                                />
                              </Stack>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                              <Stack spacing={1}>
                                <Typography color="text.secondary">Estado</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 0.75, m: 0 }} component="ul">
                                  <ListItem disablePadding sx={{ width: 'auto' }}>
                                    {(() => {
                                      switch (loanReturn?.estado) {
                                        case 'Prestado':
                                          return <Chip color="info" label="Prestado" size="small" variant="light" />;
                                        case 'Atrasado':
                                          return (
                                            <Chip
                                              color="error"
                                              label={`Atrasado ${loanReturn.dias} días`}
                                              size="small"
                                              variant="light"
                                            />
                                          );
                                        case 'Saldado':
                                        default:
                                          return <Chip color="success" label="Saldado" size="small" variant="light" />;
                                      }
                                    })()}
                                  </ListItem>
                                </Box>
                              </Stack>
                            </Grid>
                            <Grid item xs={12}>
                              <Stack spacing={1}>
                                <InputLabel>Fecha de devolución</InputLabel>
                                <DesktopDatePicker
                                  id="loan-fecha_real"
                                  name="fecha_real"
                                  value={formik.values.fecha_real}
                                  format="dd/MM/yyyy"
                                  onChange={(date) => {
                                    formik.setFieldValue('fecha_real', date);
                                  }}
                                />
                              </Stack>
                            </Grid>
                          </Grid>
                        </MainCard>
                      </Grid>
                    </Grid>
                  </Grid>
                    <Grid item xs={12} sm={4} xl={3}>
                    <MainCard title="Asignar Sanción">
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="customer-age" color="error">Días de Sanción</InputLabel>
                          <TextField
                            type="number"
                            fullWidth
                            id="dias"
                            name="dias"
                            placeholder="Ingresa los días"
                            value={formik.values.dias}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (value > 0 || e.target.value === "") {
                                formik.handleChange(e);
                              }
                            }}
                            disabled={loanReturn?.estado !== 'Atrasado'}
                            error={formik.touched.dias && Boolean(formik.errors.dias)}
                            helperText={formik.touched.dias && formik.errors.dias}
                          />
                        </Stack>
                      </Grid>
                    </MainCard>
                  </Grid>

                </Grid>
              </DialogContent>
              <Divider />
              <DialogActions sx={{ p: 2.5 }}>
                <Grid container justifyContent="flex-end" alignItems="center">
                  <Grid item>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Button color="error" onClick={closeModal}>
                        Cancelar
                      </Button>
                      <Button type="submit" variant="contained">
                        Devolver Libro
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </DialogActions>
            </form>
          </LocalizationProvider>
        </FormikProvider>
      </Box>
    </>
  );
}

FormLoanReturn.propTypes = { customer: PropTypes.any, closeModal: PropTypes.func };
