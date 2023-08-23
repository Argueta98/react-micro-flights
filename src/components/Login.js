import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/LoginForm.css'; // Importar el archivo de estilos CSS

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const apiUrl = 'http://localhost:3000'; // Coloca la URL base de tu API aquí

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/v2/auth/signin`, {
        username,
        password
      });

      const accessToken = response.data.accessToken;
      console.log(accessToken);

      if (accessToken) {
        // Almacenar el token en el almacenamiento local (localStorage, cookies, etc.)
        localStorage.setItem('accessToken', accessToken);

        // Redirigir a la página de vuelos
        navigate('/flights');
      } else {
        alert('Credenciales incorrectas');
      }
    } catch (error) {
      alert('Error al iniciar sesión');
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-form">
      <h2>Iniciar Sesión</h2>
      <div className="form-group">
        <label>Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin} className="login-button">
        Iniciar Sesión
      </button>
    </div>
  );
};

export default Login;
