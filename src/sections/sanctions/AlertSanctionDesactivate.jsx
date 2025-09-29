import PropTypes from 'prop-types';
// material-ui
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import Avatar from '../../components/@extended/Avatar';
import { PopupTransition } from '../../components/@extended/Transitions';

import { updateRemoveSancions } from '../../api/sanctions';
import { openSnackbar } from '../../api/snackbar';

// assets
import { NoteRemove } from 'iconsax-react';

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function AlertSanctionDesactivate({ id, title, open, handleClose }) {
  const deletehandler = async () => {
    await updateRemoveSancions(id).then(() => {
      openSnackbar({
        open: true,
        message: 'Customer deleted successfully',
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
          <Avatar sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <NoteRemove variant="Bold" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              ¿Estás seguro de que quieres remover la sanción?
            </Typography>
            <Typography align="center">
              Al remover la sancion
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{title}&quot;{' '}
              </Typography>
              , también se eliminarán los datos de la sanción asignadas a ese usuario.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button fullWidth variant="contained" onClick={deletehandler} autoFocus>
              Remover
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AlertSanctionDesactivate.propTypes = { id: PropTypes.number, title: PropTypes.string, open: PropTypes.bool, handleClose: PropTypes.func };
