import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import JWTContext from '../contexts/JWTContext';

export default function TokenHandler() {
  const { loginFromToken } = useContext(JWTContext);
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      const loginUser = async () => {
        try {
          const response = await axios.post('/api/auth/token-login', { token });
          if (response.data.success) {
            const userData = {
              ...response.data.user,
              token
            };
            loginFromToken(userData);
            navigate('/dashboard');
          } else {
            alert('Token inválido');
            window.location.href = 'http://localhost/BibliotecaCEDHI';
          }
        } catch (err) {
          console.error('Error validando token:', err);
          window.location.href = 'http://localhost/BibliotecaCEDHI';
        }
      };

      loginUser();
    } else {
      console.warn('No se recibió token, redirigiendo a login');
      window.location.href = 'http://localhost/BibliotecaCEDHI';
    }
  }, []);

  return null;
}
