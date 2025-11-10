// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// project-imports
import useAuth from '../../hooks/useAuth';
import ReportCard from '../../components/cards/statistics/ReportCard';
import RankingUsers from '../../sections/widget/data/RankingUsers';
import RankingBooks from '../../sections/widget/data/RankingBooks';
import LoansUser from '../../sections/widget/data/LoansUser';
import FavoritesBooks from '../../sections/widget/data/FavoritesBooks';
import { useGetTotalBooksUsers } from '../../api/stadistic';

// assets
import { Book, Profile2User } from 'iconsax-react';
import WelcomeBanner from '../../sections/dashboard/WelcomeBanner';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const theme = useTheme();
  const { user } = useAuth();

  if (!user) return null;

  const { totalBooksUsersLoading, totalBooksUsers: list } = useGetTotalBooksUsers();

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>

      <Grid item xs={12} sm={12} md={9} lg={user.categoria === 4 ? 12 : 9}>
        <WelcomeBanner />
      </Grid>
      {[1, 2, 3].includes(user?.categoria) && (
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} lg={12}>
              <Stack spacing={3}>
                <ReportCard primary={totalBooksUsersLoading ? '0' : list[0].libros} secondary="Total de Libros" color={theme.palette.primary.main} iconPrimary={Book} />
                <ReportCard primary={totalBooksUsersLoading ? '0' : list[1].usuarios} secondary="Total de Usuarios" color={theme.palette.info.main} iconPrimary={Profile2User} />
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      )}
      {[1, 2, 3].includes(user?.categoria) && (
        <Grid item xs={12} md={6} lg={6}>
          <RankingUsers />
        </Grid>
      )}
      {[1, 2, 3].includes(user?.categoria) && (
        <Grid item xs={12} md={6} lg={6}>
          <RankingBooks />
        </Grid>
      )}
      {[4].includes(user?.categoria) && (
        <Grid item xs={12} md={6} lg={6}>
          <LoansUser />
        </Grid>
      )}
      {[4].includes(user?.categoria) && (
        <Grid item xs={12} md={6} lg={6}>
          <FavoritesBooks />
        </Grid>
      )}
    </Grid>
  );
}
