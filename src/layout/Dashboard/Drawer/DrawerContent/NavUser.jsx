// material-ui
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

// project import
import Avatar from '../../../../components/@extended/Avatar';
import useAuth from '../../../../hooks/useAuth';
import { useGetMenuMaster } from '../../../../api/menu';

// assets

import avatarMale from '../../../../assets/images/users/default-male-avatar.svg';
//import avatarFemale from '../../../../assets/images/users/default-female-avatar.svg';


// ==============================|| LIST - USER ||============================== //

export default function UserList() {
  //const navigate = useNavigate();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { user } = useAuth();


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
