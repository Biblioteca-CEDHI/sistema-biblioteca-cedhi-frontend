import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return <div>Cargando usuario...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roleRequired) {
    const roles = Array.isArray(roleRequired) ? roleRequired : [roleRequired];
    if (!roles.includes(user.categoria)) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;