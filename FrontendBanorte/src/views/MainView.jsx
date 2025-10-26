// src/views/MainView.jsx
import React from 'react';
import iconoFinanzas from '../assets/finanzas.png'; 
import iconoRiesgos from '../assets/alerta.png';
import iconoPlan from '../assets/estadisticas.png';

// Importa el CSS Módulo
import styles from './MainView.module.css';

function MainView({ setView }) {
  return (
    // Usa los nombres de clase del módulo
    <div className={styles.mainContainer}>
      <h1 className={styles.title}>¡Bienvenido a tu copiloto!</h1>

      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <img src={iconoFinanzas} alt="Icono de finanzas" />
          <p>Proyecta tus finanzas</p>
        </div>

        <div className={styles.card}>
          <img src={iconoRiesgos} alt="Icono de riesgos" />
          <p>Anticipa riesgos</p>
        </div>

        <div className={styles.card}>
          <img src={iconoPlan} alt="Icono de plan" />
          <p>Entiende tu presente y planea tu futuro</p>
        </div>
      </div>

      <button className={styles.ctaButton} onClick={() => setView('upload')}>
        Realizar tu análisis con IA
      </button>
    </div>
  )
}

export default MainView;