import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import particlesOptions from "../particles.json";

function Background() {
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine); // Asegura que se cargue correctamente
  }, []);

  return <Particles options={particlesOptions} init={particlesInit} />;
}

export default Background;