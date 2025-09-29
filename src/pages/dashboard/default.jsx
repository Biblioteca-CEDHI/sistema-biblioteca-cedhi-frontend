// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// project-imports
import ReportCard from '../../components/cards/statistics/ReportCard';
import RankingUsers from '../../sections/widget/data/RankingUsers';
import RankingBooks from '../../sections/widget/data/RankingBooks';
import { useGetTotalBooksUsers } from '../../api/stadistic';

// assets
import { Book, Profile2User} from 'iconsax-react';
import WelcomeBanner from '../../sections/dashboard/WelcomeBanner';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const theme = useTheme();

  const { totalBooksUsersLoading, totalBooksUsers: list } = useGetTotalBooksUsers();

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sm={12} md={9} lg={9}>
        <WelcomeBanner />
      </Grid>
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

      {/* row 2 */}
      {/* <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Total de préstamos"
          count="3000"
          iconPrimary={<Wallet3 />}
          percentage={
            <Typography color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.primary.main} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Prestamos activos"
          count="290"
          color="warning"
          iconPrimary={<Book color={theme.palette.warning.dark} />}
          percentage={
            <Typography color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowDown size={16} style={{ transform: 'rotate(-45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.warning.dark} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Disponibilidad de libros"
          count="1568"
          color="success"
          iconPrimary={<Calendar color={theme.palette.success.darker} />}
          percentage={
            <Typography color="success.darker" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowUp size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.success.darker} />
        </EcommerceDataCard>
      </Grid>
      <Grid item xs={12} sm={6} lg={3}>
        <EcommerceDataCard
          title="Sanciones por retrasos"
          count="200"
          color="error"
          iconPrimary={<CloudChange color={theme.palette.error.dark} />}
          percentage={
            <Typography color="error.dark" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <ArrowDown size={16} style={{ transform: 'rotate(45deg)' }} /> 30.6%
            </Typography>
          }
        >
          <EcommerceDataChart color={theme.palette.error.dark} />
        </EcommerceDataCard>
      </Grid> */}

      {/* row 3 */}
      <Grid item xs={12} md={6} lg={6}>
        <RankingUsers />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <RankingBooks />
      </Grid>
    </Grid>
  );
}
