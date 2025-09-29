import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';

// project-imports
import MainCard from '../../components/MainCard';
import UploadMultiFile from '../../components/third-party/dropzone/MultiFile';
import { openSnackbar } from '../../api/snackbar';
import { uploadBook, uploadUsers } from '../../api/fileManagement';
import Breadcrumbs from '../../components/@extended/Breadcrumbs';
import { APP_DEFAULT_PATH } from '../../config';
import { useGetUserCedhi } from '../../api/users';
import { useGetBooks } from '../../api/books';

// third-party
import { Formik } from 'formik';
import IconButton from '../../components/@extended/IconButton';
import { exportToExcelTemplate, exportToExcelData } from '../../utils/exportXLSX';

// assets
import { Category, TableDocument, Document, DocumentText1 } from 'iconsax-react';

// ==============================|| PLUGIN - DROPZONE ||============================== //

export default function DropzonePage() {
  const { books: bookLists } = useGetBooks();
  const { users: userLists } = useGetUserCedhi();  

  const [listBook, setListBook] = useState(false);
  const [listUsers, setListUser] = useState(false);

  const headers_books = [
    'UBICACION_ESTANTERIA',
    'TITULO',
    'AUTOR',
    'CODIGO_DEWEY',
    'NOTACION_INTERNA',
    'CODIGO',
    'ISBN',
    'EDITORIAL',
    'TEMA',
    'IDIOMA',
    'TIPO_MATERIAL',
    'NUM_PAGINAS',
    'NUM_EDICION',
    'CIUDAD',
    'ANO',
    'TABLA_CONTENIDO',
    'DISPONIBILIDAD',
    'URL_COVER'
  ];
  //const header_users = ['CODIGO', 'APELLIDOS_Y_NOMBRES', 'CORREO_INSTITUCIONAL', 'CATEGORIA', 'SEXO'];
  const header_users = ['CODIGO', 'NOMBRES', 'EMAIL', 'CATEGORIA', 'SEXO'];

  let breadcrumbLinks = [{ title: 'Inicio', to: APP_DEFAULT_PATH }, { title: 'Gestión de Archivos', to: '/file-management' }];

  return (
    <>
    <Breadcrumbs custom heading="Gestión de Archivos" links={breadcrumbLinks} />
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard
          title="Actualización Masiva de Libros"
          secondary={
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <IconButton
                color="warning"
                size="big"
                title="Exportar Plantilla con Datos"
                onClick={() => exportToExcelData(headers_books, bookLists,'PlantillaLibros.xlsx')}
              >
                <DocumentText1 style={{ fontSize: '1.15rem' }} />
              </IconButton>
              <IconButton
                color="info"
                size="big"
                title="Exportar Plantilla Vacía"
                onClick={() => exportToExcelTemplate(headers_books, 'PlantillaLibros.xlsx')}
              >
                <Document style={{ fontSize: '1.15rem' }} />
              </IconButton>
              <IconButton color={listBook ? 'secondary' : 'primary'} size="small" onClick={() => setListBook(false)}>
                <TableDocument style={{ fontSize: '1.15rem' }} />
              </IconButton>
              <IconButton color={listBook ? 'primary' : 'secondary'} size="small" onClick={() => setListBook(true)}>
                <Category style={{ fontSize: '1.15rem' }} />
              </IconButton>
            </Stack>
          }
        >
          <Formik
            initialValues={{ files: null }}
            onSubmit={async (values, formikHelpers) => {
              const { setFieldValue } = formikHelpers;
              // submit form
              try {
                const formData = new FormData();
                formData.append('file', values.files[0]);
                await uploadBook(formData).then(() => {
                  openSnackbar({
                    open: true,
                    message: 'Se actualizaron los libros.',
                    variant: 'alert',

                    alert: {
                      color: 'success'
                    }
                  });
                  setFieldValue('files', null);
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
            }}
          >
            {({ values, handleSubmit, setFieldValue, touched, errors }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1.5} alignItems="center">
                      <UploadMultiFile
                        showList={listBook}
                        setFieldValue={setFieldValue}
                        files={values.files}
                        error={touched.files && !!errors.files}
                        onUpload={handleSubmit}
                      />
                    </Stack>
                    {touched.files && errors.files && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.files}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </MainCard>
      </Grid>
      <Grid item xs={12}>
        <MainCard
          title="Actualización Masiva de Usuarios"
          secondary={
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <IconButton
                color="warning"
                size="big"
                title="Exportar Plantilla con Datos"
                onClick={() => exportToExcelData(header_users, userLists, 'PlantillaUsuarios.xlsx')}
              >
                <DocumentText1 style={{ fontSize: '1.15rem' }} />
              </IconButton>
              <IconButton
                color="info"
                size="big"
                title="Exportar Plantilla Vacía"
                onClick={() => exportToExcelTemplate(header_users, 'PlantillaUsuarios.xlsx')}
              >
                <Document style={{ fontSize: '1.15rem' }} />
              </IconButton>
              <IconButton color={listUsers ? 'secondary' : 'primary'} size="small" onClick={() => setListUser(false)}>
                <TableDocument style={{ fontSize: '1.15rem' }} />
              </IconButton>
              <IconButton color={listUsers ? 'primary' : 'secondary'} size="small" onClick={() => setListUser(true)}>
                <Category style={{ fontSize: '1.15rem' }} />
              </IconButton>
            </Stack>
          }
        >
          <Formik
            initialValues={{ files: null }}
            onSubmit={async (values, formikHelpers) => {
              const { setFieldValue } = formikHelpers;
              // submit form
              try {
                const formData = new FormData();
                formData.append('file', values.files[0]);
                await uploadUsers(formData).then(() => {
                  openSnackbar({
                    open: true,
                    message: 'Se actualizaron los usuarios.',
                    variant: 'alert',

                    alert: {
                      color: 'success'
                    }
                  });
                  setFieldValue('files', null);
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
            }}
          >
            {({ values, handleSubmit, setFieldValue, touched, errors }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1.5} alignItems="center">
                      <UploadMultiFile
                        showList={listUsers}
                        setFieldValue={setFieldValue}
                        files={values.files}
                        error={touched.files && !!errors.files}
                        onUpload={handleSubmit}
                      />
                    </Stack>
                    {touched.files && errors.files && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.files}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </MainCard>
      </Grid>
    </Grid>
    </>

  );
}
