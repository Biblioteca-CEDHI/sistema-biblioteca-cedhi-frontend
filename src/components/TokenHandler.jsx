import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TokenHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      window.location.href = 'https://bibliotecacedhi.infinityfreeapp.com/';
      return;
    }

    // Guardar token
    localStorage.setItem("serviceToken", token);

    // Redirigir y dejar que JWTProvider valide
    navigate('/dashboard');

  }, []);

  return null;
}
