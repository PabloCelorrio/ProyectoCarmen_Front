import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import {password, usuario} from './User'

const LoginForm = ({onSubmit}) => {

    const navigate = useNavigate();
    const [email, setUser] = useState('');
    const [password, setPass] = useState('');

    const ngrokUrl = localStorage.getItem("backend-link");

   const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${ngrokUrl}/api/login`, {
    //const res = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Credenciales incorrectas");

    const token = res.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) throw new Error("No se recibió el token");

    localStorage.setItem("token", token);

    // Decodificar el token para extraer datos
    /*const payload = JSON.parse(atob(token.split('.')[1]));
    const userData = JSON.parse(payload.userRequestData);*/
    navigate("/menu");

  } catch (err) {
    alert(err.message);
    console.error(err);
  }
};

    return (

        <form onSubmit={handleSubmit}>
            <div>
                <input id="userEmail" className="text" value={email} onChange={(e) => setUser(e.target.value)} placeholder="Dirección de correo"/>
                <input id="password" className="text" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPass(e.target.value)}/>

                <button type="submit">Entrar</button>

                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
                    <span style={{ margin: '0 10px', color: '#999' }}>o</span>
                    <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
                </div>

                <button type="button" onClick={() => navigate("/register")}>Crear una cuenta</button>
            </div>      
        </form>

    );

};

export default LoginForm;
