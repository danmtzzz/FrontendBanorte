import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// 1. Importa tu archivo JSON
import jsonData from '../data/miRespuesta.json';

// --- 2. TRANSFORMACIÓN DE DATOS ---
// Recharts no puede leer un objeto.
// Necesitamos convertirlo en un array de objetos.
const gastos = jsonData.initial_data.reporte_gastos_actual;

const datosParaGrafico = Object.keys(gastos).map(categoria => ({
  categoria: categoria,
  monto: gastos[categoria]
}));
// Resultado: [{categoria: "Ahorro", monto: 201643.52}, ...]

// ---------------------------------

function GraficoGastos() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={datosParaGrafico} // 3. Usa los datos transformados
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="categoria" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar 
          dataKey="monto" // 4. El 'dataKey' debe coincidir
          fill="#82ca9d" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default GraficoGastos;