import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertUserManagementDelete from './AlertUserManagementDelete';
import IconButton from '../../components/@extended/IconButton';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';

import { openSnackbar } from '../../api/snackbar';
import { insertUserCedhi, updateUserCedhi } from '../../api/users';

// assets
import { Trash } from 'iconsax-react';

const allCategorys = [
  { value: 'AlumnosCEDHI', label: 'Alumno' },
  { value: 'Docente', label: 'Docente' },
  { value: 'Administrativo', label: 'Administrativo' }
];

const allGender = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' }
];

// ==============================|| CUSTOMER ADD / EDIT - FORM ||============================== //

export default function FormUserManagementAdd({ userManagement, closeModal }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const UserManagementSchema = Yup.object().shape({
    codigo: Yup.number().required('El DNI es obligatorio'),
    nombres: Yup.string().max(255).required('El nombre completo es obligatorio'),
    email: Yup.string().max(255).required('El correo es obligatorio').email('Debe ser un correo electrónico válido'),
    categoria: Yup.string().required('La categoría es obligatorio'),
    sexo: Yup.string().required('El género es es obligatorio')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: {
      codigo: userManagement?.codigo || '',
      nombres: userManagement?.nombres || '',
      email: userManagement?.email || '',
      categoria: userManagement?.categoria || '',
      sexo: userManagement?.sexo || ''
    },
    validationSchema: UserManagementSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newUserManagement = values;
        if (userManagement) {
          updateUserCedhi(newUserManagement).then(() => {
            openSnackbar({
              open: true,
              message: 'El usuario fue actualizado exitosamente.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            closeModal();
          });
        } else {
          await insertUserCedhi(newUserManagement).then(() => {
            openSnackbar({
              open: true,
              message: 'El usuario fue agregado exitosamente.',
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
        console.error(error);
        openSnackbar({
          open: true,
          message: 'Ocurrió un error inesperado. Por favor, inténtelo nuevamente.',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

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
            <DialogTitle>{userManagement ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-codigo">DNI</InputLabel>
                        <TextField
                          type="number"
                          fullWidth
                          id="customer-codigo"
                          placeholder="Ingrese el DNI"
                          {...getFieldProps('codigo')}
                          error={Boolean(touched.codigo && errors.codigo)}
                          helperText={touched.codigo && errors.codigo}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-nombres">Nombres Completo</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-nombres"
                          placeholder="Ingrese el nombre completo"
                          {...getFieldProps('nombres')}
                          onChange={(e) => {
                            // Convertimos el valor a mayúsculas y lo actualizamos en Formik
                            const uppercaseValue = e.target.value.toUpperCase();
                            setFieldValue('nombres', uppercaseValue); // Esta función de Formik actualiza el valor internamente
                          }}
                          error={Boolean(touched.nombres && errors.nombres)}
                          helperText={touched.nombres && errors.nombres}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-email">Email</InputLabel>
                        <TextField
                          fullWidth
                          id="customer-email"
                          placeholder="Introduzca el correo electrónico"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-categoria">Categoría</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('categoria')}
                            onChange={(event) => setFieldValue('categoria', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Select categoria</Typography>;
                              }

                              const selectedcategoria = allCategorys.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedcategoria.length > 0 ? selectedcategoria[0].label : 'Pending'}
                                </Typography>
                              );
                            }}
                          >
                            {allCategorys.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.categoria && errors.categoria && (
                          <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                            {errors.categoria}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="gender-signup">Género</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="gender-signup"
                            name="gender"
                            displayEmpty
                            {...getFieldProps('sexo')}
                            onChange={(event) => setFieldValue('sexo', event.target.value)}
                            input={<OutlinedInput id="select-column-gender-signup" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Selecciona Género</Typography>;
                              }

                              const selectedStatus = allGender.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}
                                </Typography>
                              );
                            }}
                          >
                            {allGender.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.gender && errors.gender && (
                          <FormHelperText error id="standard-weight-helper-text-gender-signup-login" sx={{ pl: 1.75 }}>
                            {errors.gender}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {userManagement && (
                    <Tooltip title="Eliminar usuario" placement="top">
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
                      {userManagement ? 'Editar' : 'Agregar'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {userManagement && (
        <AlertUserManagementDelete id={userManagement.id} title={userManagement.name} open={openAlert} handleClose={handleAlertClose} />
      )}
    </>
  );
}

FormUserManagementAdd.propTypes = { userManagement: PropTypes.any, closeModal: PropTypes.func };
