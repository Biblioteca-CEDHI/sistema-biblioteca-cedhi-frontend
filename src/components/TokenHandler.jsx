import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import JWTContext from '../contexts/JWTContext';

export default function TokenHandler() {
    console.log('TokenHandler ejecutándose');
    console.log('Params:', window.location.search);
    const { loginFromToken } = useContext(JWTContext);
    const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      // Guarda el token en localStorage y en axios
      const loginUser = async () => {
        try {
          const response = await axios.post('/api/auth/token-login', { token });
          if (response.data.success) {
            const userData = {
              ...response.data.user,
              token
            };
            console.log('Token decodificado:', userData);
            // Actualiza el contexto con los datos del usuario
            loginFromToken(userData);
            // Redirige al dashboard
            navigate('/');
          } else {
            alert('Token inválido');
            navigate('/auth/login');
          }
        } catch (err) {
          console.error('Error validando token:', err);
          navigate('/auth/login');
        }
      };

      loginUser();
    } else {
        console.warn('No se recibió token, redirigiendo a login');
        navigate('/auth/login');
    }
  }, []);

  return null; // No renderiza nada
}
