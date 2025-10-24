import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user } = useAuth();

  if (!user || roleRequired) {
    const roles = Array.isArray(roleRequired) ? roleRequired : [roleRequired];
    if (!roles.includes(user.categoria)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  return children;
};

export default ProtectedRoute;