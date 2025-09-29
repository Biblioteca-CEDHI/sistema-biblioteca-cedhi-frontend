import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik } from 'formik';

// project imports
import MainCard from '../../components/MainCard';
import Avatar from '../../components/@extended/Avatar';
//import profiles from '../../data/profiles';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';
import { insertLoan } from '../../api/loans';
//import { useGetUserCedhi } from '../../api/users';

// assets
import avatarUser from '../../assets/images/users/default-male-avatar.svg';
import { Book } from 'iconsax-react';

import { openSnackbar } from '../../api/snackbar';

// validation schema
const validationSchema = Yup.object({
  codigo: Yup.number().required('El DNI del usuario es obligatoria'),
  fecha_retorno: Yup.date().required('La fecha de devolución es obligatoria')
});

export default function FormBookLoanAdd({ customer, closeModal, perfiles}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const formik = useFormik({
    initialValues: {
      codigo: '',
      fecha_retorno: new Date(),
      registro: customer.registro
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      // submit location
      try {
        let newLoan = values;
        await insertLoan(newLoan).then(() => {
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <form onSubmit={formik.handleSubmit} id="google-map-forms">
            <DialogTitle sx={{ px: 0 }}>
              <List sx={{ width: 1, p: 0 }}>
                <ListItem disablePadding>
                  <ListItemAvatar sx={{ mr: 0.75 }}>
                    <Avatar alt={customer.titulo} size="lg" src={customer.avatar}>
                      <Book />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="h5">{customer.titulo}</Typography>}
                    secondary={<Typography color="secondary">{customer.autor}</Typography>}
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
                      <MainCard title="Nuevo Préstamo">
                        <Grid container spacing={3.5}>
                          {/* <Grid item xs={12} sm={8}>
                                    <Stack spacing={1}>
                                      <InputLabel>DNI del Ususario</InputLabel>
                                      <TextField
                                        fullWidth
                                        id="usuarioDNI"
                                        name="usuarioDNI"
                                        placeholder="DNI"
                                        value={formik.values.usuarioDNI}
                                        onChange={formik.handleChange}
                                        error={formik.touched.usuarioDNI && Boolean(formik.errors.usuarioDNI)}
                                        helperText={formik.touched.usuarioDNI && formik.errors.usuarioDNI}
                                      />
                                    </Stack>
                                  </Grid> */}

                          <Grid item xs={12} sm={8}>
                            <Stack spacing={1}>
                              <InputLabel>Usuario</InputLabel>
                              <Autocomplete
                                id="loan-codigo"
                                value={perfiles.find((profile) => profile.codigo === formik.values.codigo) || null}
                                onChange={(event, value) => {
                                  formik.setFieldValue('codigo', value?.codigo);
                                }}
                                options={perfiles}
                                fullWidth
                                autoHighlight
                                getOptionLabel={(option) => option.codigo.toString()}
                                isOptionEqualToValue={(option) => option.codigo === formik.values.codigo}
                                renderOption={(props, option) => {
                                  const { key, ...rest } = props; // Desestructuramos key para no propagarlo
                                  return (
                                    <Box component="li" key={option.id + key} sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...rest}>
                                      <img loading="lazy" width="20" src={avatarUser} alt="" />
                                      {option.codigo}
                                    </Box>
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    placeholder="Elige un usuario"
                                    inputProps={{
                                      ...params.inputProps,
                                      autoComplete: 'new-password' // disable autocomplete and autofill
                                    }}
                                  />
                                )}
                              />
                            </Stack>
                          </Grid>

                          <Grid item xs={12} sm={4}>
                            <Stack spacing={1}>
                              <Typography color="text.secondary">Sanción</Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 0.75, m: 0 }} component="ul">
                                <ListItem disablePadding sx={{ width: 'auto' }}>
                                  {(() => {
                                    const selectedProfile = perfiles.find((profile) => profile.codigo === formik.values.codigo);
                                    if (!selectedProfile) {
                                      return <Chip label="Sin seleccionar" color="default" size="medium" />;
                                    }
                                    return selectedProfile.existe_sancion ? (
                                      <Chip label="Con Sanción" color="error" size="medium" />
                                    ) : (
                                      <Chip label="Sin Sanción" color="success" size="medium" />
                                    );
                                  })()}
                                </ListItem>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid item xs={12}>
                            <Stack spacing={1}>
                              <InputLabel>Fecha de devolución</InputLabel>
                              <DesktopDatePicker
                                id="loan-fecha_retorno"
                                name="fecha_retorno"
                                value={formik.values.fecha_retorno}
                                format="dd/MM/yyyy"
                                onChange={(date) => {
                                  formik.setFieldValue('fecha_retorno', date);
                                }}
                                disabled={
                                  !formik.values.codigo || perfiles.find((profile) => profile.codigo === formik.values.codigo)?.existe_sancion
                                }
                              />
                            </Stack>
                          </Grid>
                        </Grid>
                      </MainCard>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4} xl={3}>
                  <MainCard title="Datos del Libro">
                    <Stack spacing={2}>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Ubicación</Typography>
                        <Typography>{customer.ubicacion_estanteria}</Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Tema</Typography>
                        <Typography>{customer.tema}</Typography>
                      </Stack>
                      <Stack spacing={0.5}>
                        <Typography color="secondary">Material</Typography>
                        <Typography>{customer.tipo_material}</Typography>
                      </Stack>
                    </Stack>
                  </MainCard>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
                  <Button variant="outlined" color="secondary" type="reset" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={!formik.values.codigo || perfiles.find((profile) => profile.DNI === formik.values.codigo)?.sancion}
                  >
                    Registrar Prestamo
                  </Button>
                </Stack>
              </Grid>
            </DialogActions>
          </form>
        </LocalizationProvider>
      </Box>
    </>
  );
}

FormBookLoanAdd.propTypes = { customer: PropTypes.any, closeModal: PropTypes.func, perfiles: PropTypes.any };
