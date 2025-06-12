import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {usuario, profile, password} from './User';

const PassChange = ({onSubmit}) => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pfp, setPfp] = useState("");
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [newPassVeri, setNewPassVeri] = useState('');
    const [user, setUser] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
    userName: '',
    oldPass: '',
    newPass: '',
    newPassVeri: '',
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

        <form onSubmit={handleSubmit} className="container">
            <h2>Configuración de usuario</h2>
            <div className="row">
                <div className="col-8">
                    <div className="mb-3">
                        <label htmlFor="userName" className="form-label">Datos de usuario</label>
                        <input id="user" className="text" value={user} onChange={(e) => setUser(e.target.value)} placeholder="Nombre de usuario"/>
                    </div>
                    <div className="mb-3"> 
                        <input id="oldPass" className="text" type="password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} placeholder="Contraseña antigua"/>
                    </div>
                    <div className="mb-3">
                        <input id="newPass" className="text" type="password" placeholder="Contraseña nueva" value={newPass} onChange={(e) => setNewPass(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <input id="newPassVeri" className="text" type="password" placeholder="Vuelva a escribir la contraseña" value={newPassVeri} onChange={(e) => setNewPassVeri(e.target.value)}/>
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
            </div>     
            <button type="submit">Actualizar datos</button>
            <button type="button" onClick={() => navigate(-1)}>Cancelar</button>
        </form>

    );

};

export default PassChange;