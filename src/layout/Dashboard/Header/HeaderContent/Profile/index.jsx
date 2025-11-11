import PropTypes from 'prop-types';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project-imports
import Avatar from '../../../../../components/@extended/Avatar';
import IconButton from '../../../../../components/@extended/IconButton';

import useAuth from '../../../../../hooks/useAuth';

// assets
//import avatarFemale from '../../../../../assets/images/users/default-female-avatar.svg';
import { Logout } from 'iconsax-react';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
      sx={{ p: 1 }}
    >
      {value === index && children}
    </Box>
  );
}



// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function ProfilePage() {
  const { returnDasboard, user } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      returnDasboard();
    } catch (err) {
      console.error(err);
    }
  };

  const roles = {
    1: 'Administrador',
    2: 'Bibliotecario',
    3: 'Tutor'
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        <Grid item xs="auto">
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar alt="Avatar">
              {user.nombre?.charAt(0) || ''}
            </Avatar>
            <Stack>
              <Typography variant="subtitle1" color="secondary">{user?.nombre}</Typography>
              {roles[user?.categoria] && <Typography variant="body2" color="secondary">{roles[user.categoria]}</Typography>}
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs="auto">
          <Tooltip title="Regresar">
            <IconButton size="large" sx={{ p: 1 }} onClick={handleLogout}>
              <Logout variant="Bulk" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}

TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.number, index: PropTypes.number, other: PropTypes.any };
