
import { Routes, Route } from 'react-router-dom'
import Dashboard from './Components/Pure/DashBoard/Dashboard.jsx'
import LogIn from './Components/Pure/LogIn/LogIn.jsx'

function App() {
  

  return (
    <div>
      <div className="dash-background">
      <div className="dash-container">
        
        <h1>Datos Históricos</h1>
        <div className="chart-card">
          <GraficoHistorico />
        </div>

        <h1>Gastos Actuales</h1>
        <div className="chart-card">
          <GraficoGastos />
        </div>
    </div>
  )
}

export default App
