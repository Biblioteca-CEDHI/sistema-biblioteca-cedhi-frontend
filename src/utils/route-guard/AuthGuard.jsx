import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

export default function AuthGuard({ children }) {
  const { isLoggedIn, isInitialized, user } = useAuth();

  if (!isInitialized) {
    return null;
  }

  if (!isLoggedIn) {
    window.location.href = 'https://biblioteca.cedhinuevaarequipa.edu.pe';
    return null;
  }

  return children;
}

AuthGuard.propTypes = { children: PropTypes.any };
