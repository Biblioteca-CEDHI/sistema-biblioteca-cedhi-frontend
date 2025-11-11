import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';

// project-imports
import DrawerHeaderStyled from './DrawerHeaderStyled';

import { DRAWER_WIDTH, HEADER_HEIGHT, MenuOrientation } from '../../../../config';
import useConfig from '../../../../hooks/useConfig';

//assets
import Logo from '../../../../assets/images/logo/logotipoCEDHI.png';

// ==============================|| DRAWER HEADER ||============================== //

export default function DrawerHeader({ open }) {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  return (
    <DrawerHeaderStyled
      theme={theme}
      open={open}
      sx={{
        minHeight: isHorizontal ? 'unset' : HEADER_HEIGHT,
        width: isHorizontal ? { xs: '100%', lg: DRAWER_WIDTH + 50 } : 'inherit',
        paddingTop: isHorizontal ? { xs: '10px', lg: '0' } : '8px',
        paddingBottom: isHorizontal ? { xs: '18px', lg: '0' } : '8px',
        paddingLeft: isHorizontal ? { xs: '24px', lg: '0' } : open ? '24px' : 0
      }}
    >
      {open ? (
        <Stack direction="row" spacing={0.9} alignItems="center">
          <img
            src={Logo}
            alt="CEDHI Logo"
            style={{
              width: 32,
              height: 'auto',
              filter:
                theme.palette.mode === 'dark'
                  ? 'invert(0) brightness(1.2) contrast(1.1)'
                  : 'invert(1)'
            }}
          />
          <Stack direction="column" spacing={0} alignItems="flex-start">
            <h1 style={{ margin: 5 }}>CEDHI</h1>
          </Stack>
        </Stack>
      ) : (
        <Stack direction="row" spacing={0.9} alignItems="center">
          <img
            src={Logo}
            alt="CEDHI Logo"
            style={{
              width: 32,
              height: 'auto',
              filter:
                theme.palette.mode === 'dark'
                  ? 'invert(0) brightness(1.2) contrast(1.1)'
                  : 'invert(1)'
            }}
          />
        </Stack>
      )}
    </DrawerHeaderStyled>
  );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
