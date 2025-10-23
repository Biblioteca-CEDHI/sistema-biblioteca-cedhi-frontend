import { useState } from 'react';
//import { useNavigate } from 'react-router';
//import { Link } from 'react-router-dom';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// project import
import Avatar from '../../../../components/@extended/Avatar';
import useAuth from '../../../../hooks/useAuth';
import { useGetMenuMaster } from '../../../../api/menu';

// assets
import { ArrowRight2 } from 'iconsax-react';

import avatarMale from '../../../../assets/images/users/default-male-avatar.svg';
//import avatarFemale from '../../../../assets/images/users/default-female-avatar.svg';

const ExpandMore = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'theme' && prop !== 'expand' && prop !== 'drawerOpen' })(
  ({ theme, expand, drawerOpen }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(-90deg)',
    marginLeft: 'auto',
    color: theme.palette.secondary.dark,
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    ...(!drawerOpen && {
      opacity: 0,
      width: 50,
      height: 50
    })
  })
);

// ==============================|| LIST - USER ||============================== //

export default function UserList() {
  const theme = useTheme();
  //const navigate = useNavigate();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { logout, user } = useAuth();
  const handleLogout = async () => {
    try {
      logout();
    } catch (err) {
      console.error(err);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const roles = {
    1: 'Administrador',
    2: 'Bibliotecario',
    3: 'Tutor'
  };

  return (
    <Box sx={{ p: 1.25, px: !drawerOpen ? 1.25 : 3, borderTop: '2px solid ', borderTopColor: 'divider' }}>
      <List disablePadding>
        <ListItem
          disablePadding
          sx={{
            ...(!drawerOpen && { display: 'flex', justifyContent: 'flex-end' }),
            '& .MuiListItemSecondaryAction-root': { right: !drawerOpen ? 16 : -16 }
          }}
        >
          <ListItemAvatar>
            <Avatar alt="Avatar" src={avatarMale} sx={{ ...(drawerOpen && { width: 46, height: 46 }) }} />
          </ListItemAvatar>
          <ListItemText
            primary={user?.nombre}
            sx={{ ...(!drawerOpen && { display: 'none' }) }}
            secondary={roles[user?.categoria] ?? null}
          />
        </ListItem>
      </List>
    </Box>
  );
}
