import { lazy } from "react";

// project-imports
import Loadable from "../components/Loadable";
import DashboardLayout from '../layout/Dashboard';
import PagesLayout from '../layout/Pages';
import ProtectedRoute from './ProtectedRoute';
import TokenHandler from '../components/TokenHandler';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('../pages/dashboard/default')));

// render - books
const Books = Loadable(lazy(() => import('../pages/library/books')));

// render - loan
const LoanList = Loadable(lazy(() => import('../pages/loan/loan-list')));

// render - sanction
const SanctionList = Loadable(lazy(() => import('../pages/sanctions/sanction-list')));

// render - file Management
const FileManagement = Loadable(lazy(() => import('../pages/file-management/file-management')));

// render - user Management
const UserManagementList = Loadable(lazy(() => import('../pages/user-management/user-management')));


// render - profile personal
const UserProfile = Loadable(lazy(() => import('../pages/profile/user')));
const UserTabPersonal = Loadable(lazy(() => import('../sections/profile/TabPersonal')));

// render - error
const MaintenanceError = Loadable(lazy(() => import('../pages/maintenance/error/404')));
const MaintenanceError500 = Loadable(lazy(() => import('../pages/maintenance/error/500')));
const MaintenanceErrorUnauthorized = Loadable(lazy(() => import('../pages/maintenance/error/Unauthorized')))

// ==============================|| MAIN ROUTES ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: '/',
          element: <DashboardDefault />
        },
        {
          path: 'dashboard',
          element: <DashboardDefault />
        },
        {
          path: 'library',
          children: [
            {
              path: 'books',
              element: <Books />
            }
          ]
        },
        {
          path: 'loans',
          children: [
            {
              path: 'list',
              element: <LoanList />
            }
          ]
        },
        {
          path: 'sanctions',
          children: [
            {
              path: 'list',
              element: <SanctionList />
            }
          ]
        },
        {
          path: 'user-management',
          children: [
            {
              path: 'list',
              element: (
                <ProtectedRoute roleRequired={[1, 2, 3]}>
                  <UserManagementList />
                </ProtectedRoute >
              )
            }
          ]
        },
        {
          path: 'file-management',
          element: (
            <ProtectedRoute roleRequired={1}>
              <FileManagement />
            </ProtectedRoute>
          )
        },

        {
          path: 'profile',
          children: [
            {
              path: 'user',
              element: <UserProfile />,
              children: [
                {
                  path: 'personal',
                  element: <UserTabPersonal />
                }
              ]
            }
          ]
        },

      ]
    },
    {
      path: 'token-login',
      element: <TokenHandler />
    },
    {
      path: '/maintenance',
      element: <PagesLayout />,
      children: [
        {
          path: '500',
          element: <MaintenanceError500 />
        }
      ]
    },
    {
      path: '/unauthorized',
      element: <MaintenanceErrorUnauthorized />
    },
    {
      path: '*',
      element: <MaintenanceError />
    }
  ]
};

export default MainRoutes;