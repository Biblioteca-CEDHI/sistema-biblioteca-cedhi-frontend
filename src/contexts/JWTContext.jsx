import { createContext, useEffect, useReducer } from 'react';
import authReducer from './auth-reducer/auth';
import { LOGIN, LOGOUT } from './auth-reducer/actions';
import Loader from '../components/Loader';
import axios from '../utils/axios';

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const setSession = (token) => {
  if (token) {
    localStorage.setItem('serviceToken', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  // Inicialización: revisa si hay token en localStorage
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('serviceToken');
        if (token) {
          setSession(token);
          // Consulta al backend para validar y obtener los datos del usuario
          const response = await axios.post('/api/auth/token-login', { token });
          if (response.data.success) {
            const user = response.data.user;
            dispatch({
              type: LOGIN,
              payload: {
                isLoggedIn: true,
                user
              }
            });
          } else {
            dispatch({ type: LOGOUT });
          }
        } else {
          dispatch({ type: LOGOUT });
        }
      } catch (err) {
        console.error('Error validando token:', err);
        dispatch({ type: LOGOUT });
      }
    };

    init();
  }, []);


  // Login desde token (PHP)
  const loginFromToken = (userData) => {
    setSession(userData.token);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user: {
          userId: userData.userId,
          email: userData.email,
          nombre: userData.nombre || '',
          apellido: userData.apellido || '',
          categoria:  userData.categoria
        }
      }
    });
  };

  const logout = async () => {
    try {
      // Llamar al logout real de PHP
      await fetch("http://localhost/Biblioteca-CEDHI/logout.php", {
        method: "GET",
        credentials: "include" // muy importante para mandar cookies de sesión
      });
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    } finally {
      // Limpiar sesión en React
      setSession(null);
      dispatch({ type: LOGOUT });

      // Redirigir al login principal de PHP
      window.location.href = "http://localhost/Biblioteca-CEDHI/index.php";
    }
  };


  if (!state.isInitialized) return <Loader />;
  return (
    <JWTContext.Provider value={{ ...state, loginFromToken, logout }}>
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;