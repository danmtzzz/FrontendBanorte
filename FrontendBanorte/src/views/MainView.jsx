// src/views/MainView.jsx

import React from 'react';
// Importa los íconos que SÓLO esta vista usa
import iconoFinanzas from '../assets/finanzas.png'; 
import iconoRiesgos from '../assets/alerta.png';
import iconoPlan from '../assets/estadisticas.png';

// (Aquí también podrías importar un CSS Módulo: import styles from './MainView.module.css')

function MainView({ setView }) {
  return (
    <>
      <h1>¡Bienvenido a tu copiloto!</h1>

      <div className="cards-container">
        {/* Tarjeta 1 */}
        <div className="card">
          <img src={iconoFinanzas} alt="Icono de finanzas" />
          <p>Proyecta tus finanzas</p>
        </div>

        {/* Tarjeta 2 */}
        <div className="card">
          <img src={iconoRiesgos} alt="Icono de riesgos" />
          <p>Anticipa riesgos</p>
        </div>

        {/* Tarjeta 3 */}
        <div className="card">
          <img src={iconoPlan} alt="Icono de plan" />
          <p>Entiende tu presente y planea tu futuro</p>
        </div>
      </div>

      <button className="cta-button" onClick={() => setView('upload')}>
        Realizar tu análisis con IA
      </button>
    </>
  )
}

export default MainView;