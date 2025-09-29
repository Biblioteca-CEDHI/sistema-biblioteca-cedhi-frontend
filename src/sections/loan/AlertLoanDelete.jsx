import PropTypes from 'prop-types';
// material-ui
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project import
import Avatar from '../../components/@extended/Avatar';
import { PopupTransition } from '../../components/@extended/Transitions';
import { deleteLoan } from '../../api/loans';

import { openSnackbar } from '../../api/snackbar';

// assets
import { Trash } from 'iconsax-react';

// ==============================|| INVOICE - PRODUCT DELETE ||============================== //

export default function AlertLoanDelete({ id, open, handleClose }) {
  const deletehandler = async () => {
    await deleteLoan(id).then(() => {
      openSnackbar({
        open: true,
        message: 'Prestamo eliminado exitosamente',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
      handleClose();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash variant="Bold" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              ¿Estás seguro de que quieres eliminar?
            </Typography>
            <Typography align="center">
              Al eliminar el prestamo
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;ID:{id}&quot;{' '}
              </Typography>
              también se eliminará todo el historial de prestamos.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deletehandler} autoFocus>
              Eliminar
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AlertLoanDelete.propTypes = { id: PropTypes.number, open: PropTypes.bool, handleClose: PropTypes.func };
