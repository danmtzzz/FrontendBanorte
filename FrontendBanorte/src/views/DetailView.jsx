import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

// --- ¡CAMBIO AQUÍ! ---
import './DetailView.css'; // Importa sus propios estilos

// --- VISTA DE DETALLE ---
function DetailView({ setView }) {
  
  const [isChatMinimized, setIsChatMinimized] = useState(true);
  // Inicia en 'proyeccion' ya que 'ventas' no existe
  const [activeGraph, setActiveGraph] = useState('proyeccion');

  const [proyeccionData, setProyeccionData] = useState([]);
  const [gastosData, setGastosData] = useState([]); // Estado para gastos
  
  const [loading, setLoading] = useState(true);

  // useEffect ACTUALIZADO (solo carga 2 archivos)
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Cargar y TRANSFORMAR datos de proyección
        const proyeccionResponse = await fetch('/proyeccion.json');
        const proyeccionJson = await proyeccionResponse.json();
        const transformedProyeccion = proyeccionJson.fechas.map((fecha, index) => ({
          name: fecha.substring(0, 7), // Formato "YYYY-MM"
          proyeccion: proyeccionJson.proyeccion[index]
        }));
        setProyeccionData(transformedProyeccion);

        // Cargar y TRANSFORMAR datos de gastos
        const gastosResponse = await fetch('/gastos.json');
        const gastosJson = await gastosResponse.json();
        
        const transformedGastos = Object.entries(gastosJson.gastos_simulados).map(
          ([nombre, monto]) => ({
            name: nombre,
            monto: monto
          })
        );
        setGastosData(transformedGastos);

      } catch (error) {
        console.error("Error al cargar los datos JSON:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // El array vacío [] significa que solo se ejecuta una vez

  return (
    <div className="detail-view-container vertical-layout">
      
      {/* 1. Encabezado */}
      <header className="detail-header">
        <button className="back-button dark-text" onClick={() => setView('upload')}>
          &larr; Volver a Cargar
        </button>
        <h2>Estadísticas detalladas</h2>
      </header>
      
      {/* 3. MENÚ SIMPLIFICADO */}
      <div className="graph-menu">
        <button 
          className={activeGraph === 'proyeccion' ? 'active' : ''}
          onClick={() => setActiveGraph('proyeccion')}
        >
          Proyección
        </button>
        <button 
          className={activeGraph === 'gastos' ? 'active' : ''}
          onClick={() => setActiveGraph('gastos')}
        >
          Gastos
        </button>
      </div>

      {/* 4. Apartado de Gráficas */}
      <div className="graph-content-area-middle">
        
        {loading ? (
          <p>Cargando gráficas...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            
            {/* 5. LÓGICA DE GRÁFICAS SIMPLIFICADA */}
            
            {activeGraph === 'proyeccion' ? (
              // Gráfica de Proyección
              <LineChart data={proyeccionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="proyeccion" stroke="#8884d8" strokeWidth={2} />
              </LineChart>

            ) : ( // activeGraph === 'gastos'
              // Gráfica de Gastos (usa tus datos)
              <BarChart data={gastosData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="monto" fill="#ffc658" />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* 5. Chat (sin cambios) */}
      <div className={`chat-panel-bottom ${isChatMinimized ? 'minimized' : ''}`}>
        <div 
          className="chat-header-bottom" 
          onClick={() => setIsChatMinimized(!isChatMinimized)}
        >
          <h3>Copiloto IA</h3>
          <button className="toggle-chat-btn">
            {isChatMinimized ? '▲' : '▼'}
          </button>
        </div>
        
        <div className="chat-content-bottom">
          <div className="chat-messages">
            <div className="message bot">Hola, ¿Qué deseas?</div>
            <div className="message user">Dame un análisis a futuro</div>
          </div>
          <div className="chat-input-area">
            <input type="text" placeholder="Haz una pregunta..." />
            <button>Enviar</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailView;

