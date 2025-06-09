import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";
import {password, usuario} from './User'

const LoginForm = ({onSubmit}) => {

    const navigate = useNavigate();
    const [email, setUser] = useState('');
    const [password, setPass] = useState('');

    const handleSubmit = (e) => {

        e.preventDefault();
        onSubmit({email: email, password: password});
        usuario.email = email;
        usuario.password = password;
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