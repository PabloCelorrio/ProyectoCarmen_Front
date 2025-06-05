import { StrictMode } from "react";
import React from 'react';
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PassChange from './components/PassChange';
import {GameMenu} from "./components/Menu";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/juego" element={<GameMenu/>} />
      <Route path="/ajustes" element={<PassChange />} />
    </Routes>
  </BrowserRouter>
);
