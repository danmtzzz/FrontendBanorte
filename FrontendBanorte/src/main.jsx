// main.jsx (Corregido y Limpio)

import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'; // Solo necesitas importar ReactDOM
import './index.css';
import App from './App.jsx';

// Ya no necesitas BrowserRouter si no vas a usar rutas
// import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);