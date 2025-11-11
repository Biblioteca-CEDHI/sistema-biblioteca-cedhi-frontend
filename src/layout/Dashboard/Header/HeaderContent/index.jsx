import { useMemo } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

// project-imports
import Profile from './Profile';
import Localization from './Localization';
import MobileSection from './MobileSection';
import FullScreen from './FullScreen';

import { MenuOrientation } from '../../../../config';
import useConfig from '../../../../hooks/useConfig';
import DrawerHeader from '../../../../layout/Dashboard/Drawer/DrawerHeader';

// ==============================|| HEADER - CONTENT ||============================== //

export default function HeaderContent() {
  const { i18n, menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}

      <Box sx={{ width: '100%', ml: 1 }} />
      <FullScreen />
      <Localization />
      <Profile />
    </>
  );
}
