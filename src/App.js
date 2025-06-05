import "./styles.css";
import React, { useState, useEffect } from 'react';
import LoginForm from "./components/LoginForm";
import PassChange from "./components/PassChange";
import { usuario } from "./components/User";
import Background from "./components/Background";
import Menu from "./components/Menu";

const App = () => {

  const [passOk, setPassOk] = useState(false);

  useEffect(() => {
  const checkSession = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/check-session", {
        credentials: "include", // 👈 MUY IMPORTANTE para enviar la cookie
      });

      if (res.ok) {
        setPassOk(true); // sesión válida
      } else {
        setPassOk(false); // sesión caducada o inexistente
      }
    } catch (err) {
      console.error("Error al verificar sesión:", err);
      setPassOk(false);
    }
  };

  checkSession();
}, []);
  
  const handleSubmit = async (formData) => {

    try{

      if(!passOk){

        if(localStorage.getItem('token')){

          localStorage.removeItem('token');

        }

        const response = await fetch('http://localhost:8000/api/login', {method: 'POST', 
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

        const passwordChange = await fetch('http://localhost:8000/api/pass-change', {method: 'POST', 
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