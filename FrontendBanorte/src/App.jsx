// App.jsx (Corregido)

import React from 'react';

// 1. ¡AQUÍ ESTÁ LA CORRECCIÓN! 
//    Necesitas importar los componentes que quieres usar.
// (Ajusta la ruta si tus archivos están en otro lugar)
import GraficoHistorico from './Grafica1.jsx';
import GraficoGastos from './Grafica2.jsx';

// (Quitamos las importaciones de Rutas y vistas que no se usan)
// import { Routes, Route } from 'react-router-dom'
// import Dashboard from './Components/Pure/DashBoard/Dashboard.jsx'
// import LogIn from './Components/Pure/LogIn/LogIn.jsx'

function App() {
  return (
    <div> 
      <h1>Datos Históricos</h1>
      <div className="chart-card">
        <GraficoHistorico />
      </div>

      <h1>Gastos Actuales</h1>
      <div className="chart-card">
        <GraficoGastos />
      </div>
    </div>
  );
}

export default App;