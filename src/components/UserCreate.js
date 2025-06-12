import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const UserCreate = () => {

  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
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
        let file = files[0];
      setFormData({ ...formData, image: files[0] });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
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
      const response = await fetch('https://67ef-84-126-134-7.ngrok-free.app/api/user/create', {
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

  /*return (
    <form onSubmit={handleSubmit}>
      <div>
        <div style={{maxWidth: "70%"}}>
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
        </div>
        <div style={{ minWidth: '30%', textAlign: 'center' }}>
          <label htmlFor="imageUpload" style={{ cursor: 'pointer', fontSize: '24px', display: 'inline-block', padding: '10px', borderRadius: '50%', background: '#eee' }}>
            📷
          </label>
          <input
            id="imageUpload"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          </div>
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
  );*/

   return (
    <form onSubmit={handleSubmit} className="container">
      <div className="row">
        <div className="col-8">
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">Nombre de usuario</label>
            <input
              type="text"
              className="form-control"
              id="userName"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="col-4">
          <label htmlFor="image" className="btn btn-outline-secondary rounded-circle p-3 mb-2">
            📷
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleChange}
          />

          {imagePreview && (
            <div>
              <img
                src={imagePreview}
                alt="Preview"
                className="img-thumbnail mt-2"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            </div>
          )}
          </div>

          <button type="submit">Crear cuenta</button>

          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
            <span style={{ margin: '0 10px', color: '#fff' }}>o</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
          </div>

          <button type="button" onClick={() => navigate('/')}>
            Iniciar sesión
          </button>
        </div>

        {/* Columna derecha: imagen */}
    </form>
  );
};

export default UserCreate;