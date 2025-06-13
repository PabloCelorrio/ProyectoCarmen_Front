import "./styles.css";
import React, { useState, useEffect } from 'react';
import LoginForm from "./components/LoginForm";
import PassChange from "./components/PassChange";
import { usuario } from "./components/User";
import Background from "./components/Background";
import Menu from "./components/Menu";

const App = () => {

  localStorage.setItem("backend-link", "http://localhost:8000");

  const ngrokUrl = localStorage.getItem("backend-link");

  const [passOk, setPassOk] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token"); // o el nombre que uses
      if (!token) {
        setPassOk(false);
        return;
      }

      try {
        // Suponiendo que el token es un JWT
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const now = Math.floor(Date.now() / 1000); // tiempo actual en segundos

        if (decodedPayload.exp && decodedPayload.exp > now) {
          setPassOk(true);
        } else {
          setPassOk(false);
        }
      } catch (e) {
        // token mal formado o error al decodificar
        setPassOk(false);
      }
    };

    checkToken();
  }, []);
  
  const handleSubmit = async (formData) => {

    try{

      if(!passOk){

        if(localStorage.getItem('token')){

          localStorage.removeItem('token');

        }

        const response = await fetch(`${ngrokUrl}/api/login`, {method: 'POST', 
                                                  headers: {'Content-Type': 'application/json',
                                                            'Accept': 'application/json,text/plain',
                                                            Authorization: ""
                                                            }, 
                                                  body: JSON.stringify(formData),
                                                  });

        if(response.ok){

          localStorage.setItem('token', await response.headers.get("Authorization"));
          setPassOk(true);
        
        }

      }else {

        const passwordChange = await fetch(`${ngrokUrl}/api/pass-change`, {method: 'POST', 
                                                  headers: {'Content-Type': 'application/json',
                                                            'Accept': 'application/json,text/plain',
                                                            Authorization: localStorage.getItem('token')}, 
                                                  body: JSON.stringify(usuario),
                                                  });

        const passwordChangeOk = await passwordChange.text();
        console.log(passwordChangeOk);

        if(passwordChangeOk == "Contraseña cambiada"){

          setPassOk(false);

        }
      }

    } catch (error) {

      console.error('Error:'+ error);

    }

  };

  return (
    <div>
      {passOk ? (
        <div>
          <Menu onSubmit={handleSubmit}/>
        </div>
      ) : 
        <div>
          <LoginForm onSubmit={handleSubmit}/>
        </div>
      }
    </div>
  );
};

export default App


/**
 * PARA QUE FUNCIONE LA APP HAY QUE INICIARLA Y CAMBIAR EL CONTENIDO DEL ITEM DE LOCALSTORAGE EN LA LÍNEA 11 POR LA DIRECCIÓN QUE DEVUELVA NGROK:
 * 
 *  [0] t=2025-06-13T02:31:30+0200 lvl=info msg="started tunnel" obj=tunnels name=command_line addr=http://localhost:8000 -> url=https://60bb-84-126-134-7.ngrok-free.app <-
 */