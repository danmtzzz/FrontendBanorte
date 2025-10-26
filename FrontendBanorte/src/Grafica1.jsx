import React from 'react';
import { 
  LineChart, 
  Line, 
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
// Recharts no puede leer dos arrays separados.
// Necesitamos combinarlos en un solo array de objetos.
const historico = jsonData.initial_data.datos_historicos;

const datosParaGrafico = historico.fechas.map((fecha, index) => ({
  // Formateamos la fecha para que se vea mejor en el eje X
  fecha: new Date(fecha).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' }),
  "Ahorro Acumulado": historico.ahorro_acumulado[index]
}));

// ---------------------------------

function GraficoHistorico() {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={datosParaGrafico} // 3. Usa los datos transformados
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="fecha" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="Ahorro Acumulado" // 4. El 'dataKey' debe coincidir
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default GraficoHistorico;