import PropTypes from 'prop-types';
import { useState } from 'react';
//import { useNavigate } from 'react-router';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
//import { Edit2, Logout } from 'iconsax-react';
import { Logout } from 'iconsax-react';

export default function ProfileTab({ handleLogout }) {
  //const navigate = useNavigate();
  //const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndex] = useState(0);
  // const handleListItemClick = (event, index, route = '') => {
  //   setSelectedIndex(index);

  //   if (route && route !== '') {
  //     navigate(route);
  //   }
  // };
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
