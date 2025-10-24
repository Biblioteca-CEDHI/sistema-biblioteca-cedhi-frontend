import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project-imports
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';
import Avatar from '../../../../../components/@extended/Avatar';
import MainCard from '../../../../../components/MainCard';
import Transitions from '../../../../../components/@extended/Transitions';
import IconButton from '../../../../../components/@extended/IconButton';

import { ThemeMode } from '../../../../../config';
import useAuth from '../../../../../hooks/useAuth';

// assets
import avatarMale from '../../../../../assets/images/users/default-male-avatar.svg';
//import avatarFemale from '../../../../../assets/images/users/default-female-avatar.svg';
import { Setting2, Profile, Logout } from 'iconsax-react';

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

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function ProfilePage() {
  const theme = useTheme();

  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      logout();
    } catch (err) {
      console.error(err);
    }
  };

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const roles = {
    1: 'Admin',
    2: 'Bibliotecario',
    3: 'Tutor'
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Grid container spacing={2} justifyContent="space-between" alignItems="center">
        <Grid item xs="auto">
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Avatar alt="profile user" src={avatarMale} />
            <Stack>
              <Typography variant="subtitle1" color="secondary">{user?.nombre}</Typography>
              {roles[user?.categoria] && <Typography variant="body2" color="secondary">{roles[user.categoria]}</Typography>}
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs="auto">
          <Tooltip title="Logout">
            <IconButton size="large" color="error" sx={{ p: 1 }} onClick={handleLogout}>
              <Logout variant="Bulk" />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
}

TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.number, index: PropTypes.number, other: PropTypes.any };
