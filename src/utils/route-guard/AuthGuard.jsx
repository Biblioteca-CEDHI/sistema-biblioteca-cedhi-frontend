import PropTypes from 'prop-types';
import useAuth from '../../hooks/useAuth';

export default function AuthGuard({ children }) {
  const { isLoggedIn, isInitialized, user } = useAuth();

  console.log("✅ AUTHGUARD DEBUG:");
  console.log("isInitialized:", isInitialized);
  console.log("isLoggedIn:", isLoggedIn);
  console.log("user:", user);

  // ✅ NO redirigir hasta que termine la validación
  if (!isInitialized) {
    console.log("⏳ Esperando inicialización…");
    return null;
  }

  // ✅ Después de inicializado, si NO está logueado → redirigir
  if (!isLoggedIn) {
    console.log("❌ No logueado → redirigiendo a PHP dashboard");
    window.location.href = 'https://bibliotecacedhi.infinityfreeapp.com';
    return null;
  }

  console.log("✅ Logueado, mostrando contenido.");
  return children;
}

AuthGuard.propTypes = { children: PropTypes.any };
