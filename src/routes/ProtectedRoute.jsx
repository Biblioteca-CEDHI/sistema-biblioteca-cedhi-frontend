import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user } = useAuth();

  if (!user || (roleRequired && user.categoria !== roleRequired)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;