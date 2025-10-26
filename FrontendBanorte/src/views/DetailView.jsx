import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

// --- CORRECCIÓN AQUÍ ---
// Asegurándonos que la ruta relativa sea correcta.
import './DetailView.css';

// --- NUEVA FUNCIÓN ---
// Formateador de moneda simple
const formatCurrency = (value) => {
  if (value === undefined || value === null) return "$0.00";
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value);
};

// Función para formatear números en K, M, B
const formatYAxisTick = (value) => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};

// --- VISTA DE DETALLE ---
function DetailView({ setView, initialAnalysis }) {

  // Estados para layout y gráficas
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [activeGraphTab, setActiveGraphTab] = useState('simulation'); // Inicia en simulación
  const [loadingGraphs, setLoadingGraphs] = useState(false); // No carga datos iniciales ahora

  // Estados para Chat IA
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hola! ¿Qué meta financiera tienes en mente?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState(null);
  const messagesEndRef = useRef(null);

  // --- Estados NUEVOS para Simulación ---
  const [simulationMonths, setSimulationMonths] = useState(12); // Meses por defecto
  const [simulationChanges, setSimulationChanges] = useState([]); // Lista de cambios
  const [simulationResult, setSimulationResult] = useState(null); // { fechas: [], proyeccion: [] }
  const [isSimulationLoading, setIsSimulationLoading] = useState(false);
  const [simulationError, setSimulationError] = useState(null);
  // Estados para el formulario de añadir cambio
  const [newChangeType, setNewChangeType] = useState('gasto');
  const [newChangeCategory, setNewChangeCategory] = useState('');
  const [newChangeValueType, setNewChangeValueType] = useState('monto'); // 'monto' o 'porcentaje'
  const [newChangeValue, setNewChangeValue] = useState('');
  const [availableCategories, setAvailableCategories] = useState([]); // Para el dropdown

  // Extraer categorías disponibles del análisis inicial al cargar
  useEffect(() => {
    if (initialAnalysis?.analisis_descriptivo?.principales_gastos_por_categoria) {
      const categories = Object.keys(initialAnalysis.analisis_descriptivo.principales_gastos_por_categoria);
      setAvailableCategories(categories);
      // Opcional: Seleccionar la primera categoría por defecto si existen
      if (categories.length > 0 && !newChangeCategory) { // Solo si no hay una ya seleccionada
        setNewChangeCategory(categories[0]);
      }
    }
  }, [initialAnalysis, newChangeCategory]); // Añadido newChangeCategory para evitar resetear si ya hay algo


  // Efecto para scroll del chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Función para llamar al Chat IA (sin cambios) ---
  const handleSendMessage = async () => {
    const userMessageText = userInput.trim();
    if (!userMessageText || isChatLoading || !initialAnalysis || !initialAnalysis.analisis_descriptivo || !initialAnalysis.analisis_predictivo) {
       console.warn("Envío cancelado: Mensaje vacío, chat cargando, o falta initialAnalysis completo.");
       setChatError("No se pueden enviar mensajes. Faltan datos del análisis inicial.");
      return;
    }
    setMessages(prev => [...prev, { sender: 'user', text: userMessageText }]);
    setUserInput('');
    setIsChatLoading(true);
    setChatError(null);
    const payload = {
      meta_usuario: userMessageText,
      analisis_descriptivo: initialAnalysis.analisis_descriptivo,
      analisis_predictivo: initialAnalysis.analisis_predictivo
    };
    // Asegúrate que esta URL sea la correcta para tu entorno
    const backendUrl = `http://129.213.136.1/api/v1/metas/generar-plan`;
    try {
      const response = await axios.post(backendUrl, payload);
      const botResponseText = response.data.recomendacion || "No pude generar un plan.";
      setMessages(prev => [...prev, { sender: 'bot', text: botResponseText }]);
    } catch (err) {
      console.error('Error al llamar a /metas/generar-plan:', err);
      let errorMsg = 'Ocurrió un error al contactar al copiloto.';
      if (err.response) { errorMsg = `Error: ${err.response.data.detail || err.response.statusText || err.response.status}`; }
      else if (err.request) { errorMsg = 'No se pudo conectar con el servidor.'; }
      else { errorMsg = `Error: ${err.message}`; }
      setChatError(errorMsg);
      setMessages(prev => [...prev, { sender: 'bot', text: `Error: ${errorMsg}` }]);
    } finally {
      setIsChatLoading(false);
    }
  };


  // --- Función Añadir Cambio (sin cambios funcionales) ---
  const handleAddChange = (e) => {
    e.preventDefault();
    const value = parseFloat(newChangeValue);
    if (isNaN(value) || !newChangeType || (newChangeType === 'gasto' && !newChangeCategory)) {
        // Añadida validación para categoría de gasto seleccionada
        console.warn("Intento de añadir cambio inválido.");
        return;
    }


    let changeToAdd = {
      tipo: newChangeType,
      categoria: null, // Inicializa como null
      porcentaje_cambio: null,
      monto_fijo_cambio: null,
    };

    let categoryName = newChangeCategory; // Variable temporal

    // Manejo de "Nueva Categoría"
    if (newChangeType === 'gasto' && newChangeCategory === '_nuevo_') {
       const newCatName = prompt("Ingresa el nombre de la nueva categoría de gasto:");
       if (!newCatName || newCatName.trim() === '') {
           console.log("Creación de nueva categoría cancelada.");
           return; // Cancela si no hay nombre
       }
       categoryName = newCatName.trim();
       changeToAdd.categoria = categoryName; // Asigna el nombre nuevo
       // Añade la nueva categoría a la lista disponible si no existe
       if (!availableCategories.includes(categoryName)) {
          setAvailableCategories(prev => [...prev, categoryName].sort()); // Ordena alfabéticamente
       }
       // Selecciona la nueva categoría en el dropdown
       setNewChangeCategory(categoryName);

    } else if (newChangeType === 'gasto') {
        // Si es gasto y no es "_nuevo_", asigna la categoría seleccionada
        changeToAdd.categoria = categoryName;
    }
    // Si es 'ingreso', changeToAdd.categoria permanece null (ingreso general)


    if (newChangeValueType === 'porcentaje') {
      changeToAdd.porcentaje_cambio = value / 100;
    } else { // monto
      changeToAdd.monto_fijo_cambio = value;
    }

    setSimulationChanges(prev => [...prev, changeToAdd]);
    // Resetea solo el valor, mantiene tipo y categoría para facilitar añadir varios cambios similares
    setNewChangeValue('');
  };

  // --- Función Quitar Cambio (sin cambios) ---
  const handleRemoveChange = (indexToRemove) => {
    setSimulationChanges(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // --- Función Ejecutar Simulación (sin cambios funcionales) ---
  const handleRunSimulation = async () => {
    if (!initialAnalysis || !initialAnalysis.analisis_descriptivo) {
      setSimulationError("No hay datos de análisis base para ejecutar la simulación.");
      return;
    }

    setIsSimulationLoading(true);
    setSimulationError(null);
    setSimulationResult(null);

    const payload = {
      analisis_descriptivo: initialAnalysis.analisis_descriptivo,
      meses_a_proyectar: parseInt(simulationMonths, 10) || 1,
      cambios: simulationChanges
    };

    // Asegúrate que esta URL sea la correcta para tu entorno
    const backendUrl = `http://129.213.136.1/api/v1/simulacion/proyectar`;
    try {
      console.log("Enviando a /simulacion/proyectar:", payload);
      const response = await axios.post(backendUrl, payload);
      console.log("Respuesta de /simulacion/proyectar:", response.data);

      if (response.data && response.data.fechas && response.data.proyeccion) {
        const formattedData = response.data.fechas.map((fecha, index) => ({
          name: fecha.substring(0, 7),
          proyeccion: response.data.proyeccion[index]
        }));
        setSimulationResult(formattedData);
        setActiveGraphTab('simulation');
      } else {
        throw new Error("La respuesta de la API no tiene el formato esperado.");
      }

    } catch (err) {
      console.error('Error al llamar a /simulacion/proyectar:', err);
      let errorMsg = 'Ocurrió un error al ejecutar la simulación.';
      if (err.response) { errorMsg = `Error del servidor: ${err.response.data.detail || err.response.statusText || err.response.status}`; }
      else if (err.request) { errorMsg = 'No se pudo conectar con el servidor.'; }
      else { errorMsg = `Error: ${err.message}`; }
      setSimulationError(errorMsg);
    } finally {
      setIsSimulationLoading(false);
    }
  };

   // --- Función Formatear Texto Cambio (sin cambios) ---
  const formatChangeText = (change) => {
    let text = `${change.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}`;
    if (change.categoria) {
      text += ` (${change.categoria})`;
    } else if (change.tipo === 'ingreso') {
        text += ' (General)';
    } else {
        text += ' (General)';
    }

    if (change.porcentaje_cambio !== null) {
      const percentage = (change.porcentaje_cambio * 100).toFixed(1);
      text += `: ${percentage >= 0 ? '+' : ''}${percentage}%`; // Corrección para mostrar '+'
    } else if (change.monto_fijo_cambio !== null) {
      text += `: ${change.monto_fijo_cambio >= 0 ? '+' : ''}${formatCurrency(change.monto_fijo_cambio)}`; // Corrección para mostrar '+'
       text += " / mes";
    }
    return text;
  };


  return (
    <div className="detail-view-container vertical-layout">

      {/* 1. Encabezado */}
      <header className="detail-header">
        <button className="back-button dark-text" onClick={() => setView('upload')}>
          &larr; Volver al Resumen
        </button>
        <h2>Simulador "What-If" y Copiloto IA</h2>
      </header>

      {/* --- Controles de Simulación --- */}
      <div className="simulation-controls">
        <h3>Configurar Simulación</h3>
        <div className="controls-row">
          {/* Input para Meses */}
          <div className="control-group">
            <label htmlFor="simMonths">Meses a proyectar:</label>
            <input
              type="number"
              id="simMonths"
              min="1"
              max="60"
              value={simulationMonths}
              onChange={(e) => setSimulationMonths(e.target.value)}
              disabled={isSimulationLoading}
              aria-label="Meses a proyectar"
            />
          </div>

          {/* Botón Ejecutar Simulación */}
          <button
            className="run-simulation-btn"
            onClick={handleRunSimulation}
            disabled={isSimulationLoading || !initialAnalysis?.analisis_descriptivo}
          >
            {isSimulationLoading ? 'Calculando...' : 'Ejecutar Simulación'}
          </button>
        </div>

        {/* Formulario para añadir cambios */}
        <form className="add-change-form" onSubmit={handleAddChange}>
          <h4>Añadir Cambio al Escenario:</h4>
          <div className="form-row">
            {/* Tipo: Ingreso/Gasto */}
            <select value={newChangeType} onChange={(e) => setNewChangeType(e.target.value)} aria-label="Tipo de cambio">
              <option value="ingreso">Ingreso</option>
              <option value="gasto">Gasto</option>
            </select>

            {/* Categoría (solo si es Gasto) */}
            {newChangeType === 'gasto' && (
              <select value={newChangeCategory} onChange={(e) => setNewChangeCategory(e.target.value)} aria-label="Categoría del gasto" required={newChangeType === 'gasto'}>
                 <option value="" disabled>-- Selecciona Categoría --</option>
                 {/* Ordena las categorías alfabéticamente */}
                 {availableCategories.sort().map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
                 <option value="_nuevo_">-- Nueva Categoría --</option>
              </select>
            )}

            {/* Tipo de Valor: Monto/Porcentaje */}
            <select value={newChangeValueType} onChange={(e) => setNewChangeValueType(e.target.value)} aria-label="Tipo de valor del cambio">
              <option value="monto">Monto Fijo ($)</option>
              <option value="porcentaje">Porcentaje (%)</option>
            </select>

            {/* Valor */}
            <input
              type="number"
              step="any"
              placeholder={newChangeValueType === 'porcentaje' ? 'Ej: 10 ó -5' : 'Ej: 500 ó -100'}
              value={newChangeValue}
              onChange={(e) => setNewChangeValue(e.target.value)}
              required
              aria-label="Valor del cambio"
            />

            <button type="submit" className="add-change-btn" aria-label="Añadir cambio">+</button>
          </div>
        </form>

        {/* Lista de Cambios Añadidos */}
        <div className="changes-list">
          <h4>Escenario Actual ({simulationChanges.length} {simulationChanges.length === 1 ? 'cambio' : 'cambios'}):</h4>
          {simulationChanges.length === 0 ? (
            <p className="no-changes-text">No has añadido cambios. La simulación mostrará la proyección sin modificaciones.</p>
          ) : (
            <ul>
              {simulationChanges.map((change, index) => (
                <li key={index}>
                  <span>{formatChangeText(change)}</span>
                  <button onClick={() => handleRemoveChange(index)} className="remove-change-btn" aria-label={`Quitar cambio ${index + 1}`}>×</button>
                </li>
              ))}
            </ul>
          )}
        </div>
         {/* Mostrar error de simulación si existe */}
        {simulationError && <p className="simulation-error-text">{simulationError}</p>}

      </div>
      {/* --- FIN Controles de Simulación --- */}


      {/* Pestañas para Gráficas */}
      <div className="graph-menu">
        <button
          className={activeGraphTab === 'simulation' ? 'active' : ''}
          onClick={() => setActiveGraphTab('simulation')}
        >
          Proyección Simulada
        </button>
        {/* Deshabilitamos la pestaña de Gastos ejemplo si no hay datos */}
        {/* O podrías cargar los gastos base del initialAnalysis aquí */}
        {/* <button
          className={activeGraphTab === 'expenses' ? 'active' : ''}
          onClick={() => setActiveGraphTab('expenses')}
          // disabled={!gastosData || gastosData.length === 0} // Ejemplo de deshabilitar
        >
          Gastos Base
        </button> */}
      </div>

      {/* Área de Gráficas */}
      <div className="graph-content-area-middle">
         {/* Mostramos carga general si la simulación está corriendo */}
        {isSimulationLoading ? (
             <p>Calculando simulación...</p>
        ) : (
          <ResponsiveContainer width="90%" height="90%">
            {activeGraphTab === 'simulation' ? (
              // Gráfica de Simulación
              simulationResult && simulationResult.length > 0 ? (
                <LineChart data={simulationResult} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatYAxisTick} domain={['auto', 'auto']} /> {/* Dominio automático */}
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Line type="monotone" dataKey="proyeccion" name="Balance Proyectado" stroke="#004a99" strokeWidth={2} activeDot={{ r: 6 }} dot={simulationResult.length < 50} /> {/* Oculta puntos si hay muchos datos */}
                </LineChart>
              ) : (
                 <p className="no-simulation-text">
                   {simulationError ? 'Error al calcular.' : 'Define tu escenario.'}
                 </p>
              )
            ) : (
                // Aquí podrías mostrar la gráfica de barras con los gastos *base* del initialAnalysis
                // Por ahora, lo dejamos como placeholder
                 <p>Gráfica de Gastos Base (pendiente)</p>
            )}
          </ResponsiveContainer>
        )}
      </div>

       {/* Chat IA */}
      <div className={`chat-panel-bottom ${isChatMinimized ? 'minimized' : ''}`}>
         {/* ... (resto del chat sin cambios) ... */}
         <div
            className="chat-header-bottom"
            onClick={() => setIsChatMinimized(!isChatMinimized)}
            role="button" tabIndex={0}
             onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && setIsChatMinimized(!isChatMinimized)}
          >
            <h3>Copiloto IA</h3>
            <button className="toggle-chat-btn" aria-expanded={!isChatMinimized}>
              {isChatMinimized ? '▲' : '▼'}
            </button>
          </div>
         <div className="chat-content-bottom">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.sender}`}>
                  <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              ))}
              {isChatLoading && <div className="message bot typing-indicator">Pensando...</div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input-area">
              <input
                type="text"
                placeholder={isChatLoading ? "Esperando respuesta..." : "Escribe tu meta aquí..."}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isChatLoading || !initialAnalysis?.analisis_descriptivo}
                aria-label="Escribe tu meta financiera"
              />
              <button
                onClick={handleSendMessage}
                disabled={isChatLoading || !userInput.trim() || !initialAnalysis?.analisis_descriptivo}
              >
                Enviar
              </button>
            </div>
             {(!initialAnalysis || !initialAnalysis.analisis_descriptivo) && (
              <p className="chat-warning">Carga un archivo para usar el copiloto.</p>
             )}
             {chatError && !isChatLoading && <p className="chat-error">{chatError}</p>}
          </div>
      </div>
    </div>
  );
}

export default DetailView;

