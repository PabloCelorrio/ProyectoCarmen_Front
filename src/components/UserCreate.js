import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const UserCreate = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.userName.trim()) return 'El nombre de usuario es requerido.';
    if (!emailRegex.test(formData.email)) return 'Email inválido.';
    if (formData.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
    if (formData.password !== formData.confirmPassword) return 'Las contraseñas no coinciden.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validate();
    if (error) return alert(error);

    const body = new FormData();
    body.append('userName', formData.userName);
    body.append('email', formData.email);
    body.append('password', formData.password);
    if (formData.image) {
      body.append('image', formData.image);
    }

    try {
      const response = await fetch('http://localhost:8000/api/user/create', {
        method: 'POST',
        body,
      });

      if (response.ok) {
        alert('Usuario creado exitosamente');
        setFormData({
          userName: '',
          email: '',
          password: '',
          confirmPassword: '',
          image: null,
        });
         navigate('/');
      } else {
        const errorText = await response.text();
        alert('Error al crear usuario: ' + errorText);
      }
    } catch (err) {
      console.error('Error en la petición:', err);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          id="userName"
          name="userName"
          className="text"
          placeholder="Nombre de usuario"
          value={formData.userName}
          onChange={handleChange}
        />
        <input
          id="userEmail"
          name="email"
          className="text"
          placeholder="Dirección de correo"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          id="password"
          name="password"
          className="text"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
        />
        <input
          id="confirmPassword"
          name="confirmPassword"
          className="text"
          type="password"
          placeholder="Confirmar contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <input
          id="profileImage"
          name="profileImage"
          className="text"
          type="file"
          accept="image/*"
          onChange={handleChange}
        />

        <button type="submit">Crear cuenta</button>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
          <span style={{ margin: '0 10px', color: '#999' }}>o</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
        </div>

        <button type="button" onClick={() => navigate('/')}>
          Iniciar sesión
        </button>
      </div>
    </form>
  );
};

export default UserCreate;