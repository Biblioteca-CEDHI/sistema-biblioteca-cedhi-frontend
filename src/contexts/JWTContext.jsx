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
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem('serviceToken');

      if (!token) {
        dispatch({
          type: LOGOUT,
          payload: { isInitialized: true }
        });
        return;
      }

      setSession(token);

      try {
        const response = await axios.post('/api/auth/token-login', { token });
        const { success, user } = response.data;

        if (success) {
          dispatch({
            type: LOGIN,
            payload: {
              user,
              isLoggedIn: true,
              isInitialized: true
            }
          });
        } else {
          dispatch({
            type: LOGOUT,
            payload: { isInitialized: true }
          });
        }

      } catch (err) {
        console.error('Error validando token:', err);
        dispatch({
          type: LOGOUT,
          payload: { isInitialized: true }
        });
      }
    };

    init();
  }, []);



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
          categoria: userData.categoria
        },
        isInitialized: true
      }
    });
  };

  const returnDasboard = () => {
    window.location.href = "https://bibliotecacedhi.infinityfreeapp.com";
    setSession(null);
    dispatch({ type: LOGOUT });
    localStorage.clear();
    sessionStorage.clear();
  };

  if (!state.isInitialized) return <Loader />;
  return (
    <JWTContext.Provider value={{ ...state, loginFromToken, returnDasboard }}>
      {children}
    </JWTContext.Provider>
  );
};

export default JWTContext;