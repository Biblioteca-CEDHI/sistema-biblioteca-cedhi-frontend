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
// ==============================|| LIST - USER ||============================== //

export default function UserList() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { user } = useAuth();

  if (!user) return null;

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
            <Avatar alt="Avatar" sx={{ ...(drawerOpen && { width: 46, height: 46 }) }}>
              {user.nombre?.charAt(0) || ''}
            </Avatar>
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
