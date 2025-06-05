import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {usuario, profile, password} from './User';
import Game from './Game';

const PassChange = ({onSubmit}) => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pfp, setPfp] = useState("");
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [newPassVeri, setNewPassVeri] = useState('');
    const [user, setUser] = useState('');

    const handleSubmit = (e) => {

        e.preventDefault();

        if(user == usuario.user && oldPass == password.oldPass && oldPass != newPass && newPass == newPassVeri){

            usuario.pass = newPass;
            onSubmit({user, newPass});

        }else{

            if(oldPass == newPass){

                console.log('La contraseña nueva no puede ser igual a la antigua.');

            }else{

                console.log("La contraseña antigua no es correcta.");

            }
        }


    };

    return (

       <form onSubmit={handleSubmit}>
            <h2>Configuración de usuario</h2>
            <div>
                <input id="user" class="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="Nombre de usuario"/>
                <input id="oldPass" class="text" type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} placeholder="Contraseña antigua"/>
            </div>
            <div>
                <input id="newPass" class="text" type="password" placeholder="Contraseña nueva" value={newPass} onChange={(e) => setNewPass(e.target.value)}/>
                <input id="newPassVeri" class="text" type="password" placeholder="Vuelva a escribir la contraseña" value={newPassVeri} onChange={(e) => setNewPassVeri(e.target.value)}/>
            </div>
            <div>
                <input id="newPfp" type="file" value={pfp} onChange={(e) => setPfp(e.target.value)} />
            </div>     
            <button type="submit">Actualizar datos</button>
            <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
        </form>

    );

};

export default PassChange;