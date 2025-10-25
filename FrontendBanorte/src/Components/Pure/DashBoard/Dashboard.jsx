import '../DashBoard/DahsBoard.css'
import React, { useState } from 'react'; 
import axios from 'axios';
/* PASO 1: Importa tus propios íconos.
  Asegúrate de poner tus archivos de íconos (ej. .svg o .png) 
  en la carpeta 'src/assets/' y de que los nombres coincidan.
*/
import iconoFinanzas from '../../../assets/finanzas.png' // <-- CAMBIA ESTE NOMBRE
import iconoRiesgos from '../../../assets/alerta.png'  // <-- CAMBIA ESTE NOMBRE
import iconoPlan from '../../../assets/estadisticas.png'      // <-- CAMBIA ESTE NOMBRE

function Dashboard() {
  // --- 3. Estados de React: Para guardar los datos ---
  const [file, setFile] = useState(null);
  const [categoria, setCategoria] = useState('Ventas'); // Valor de prueba
  const [porcentaje, setPorcentaje] = useState(10.0);    // Valor de prueba
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [jsonResponse, setJsonResponse] = useState(null); // Para ver el JSON crudo

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setJsonResponse(null);
    setErrorMessage('');
  };

  // Llama a la API cuando se presiona el botón
  const handleUpload = async () => {
    // Validaciones
    if (!file) {
      setErrorMessage('Por favor, selecciona un archivo primero.');
      return;
    }
    if (!categoria) {
      setErrorMessage('Por favor, escribe una categoría.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setJsonResponse(null);

    try {
      // Preparamos los datos para enviar
      const formData = new FormData();
      formData.append('file', file);
      
      const simParams = {
        tipo: "ingreso", // Dejamos "ingreso" fijo para la prueba
        categoria: categoria,
        porcentaje: parseFloat(porcentaje)
      };
      // Tu API espera 'params', así que lo añadimos
      formData.append('params', JSON.stringify(simParams));

      // --- ¡LA LLAMADA A LA API! ---
      const response = await axios.post('http://127.0.0.1:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // ¡Éxito! Guardamos la respuesta cruda para verla
      setJsonResponse(JSON.stringify(response.data, null, 2));

    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Error en el servidor. Revisa ambas terminales.';
      setErrorMessage(errorMsg);
      setJsonResponse(JSON.stringify(error.response?.data, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Usamos un Fragment (<>) para agrupar todo */
    <>
      {/* El título principal */}
      <h1>¡Bienvenido a tu copiloto!</h1>

      {/* El contenedor para las 3 tarjetas */}
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

      {/* El botón de acción principal */}
      <button className="cta-button">
        Realizar tu análisis con IA
      </button>

      {/* --- 6. SECCIÓN DE INPUTS (AÑADIDA) --- */}
      {/* Añadimos un 'card' nuevo para agrupar los inputs.
        El botón no puede funcionar si no le damos un archivo y parámetros.
      */}
      <div className="card" style={{ backgroundColor: '#f9f9f9', textAlign: 'left' }}>
        <h3>Paso 1: Prepara tu simulación</h3>
        
        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Sube tu archivo (.xlsx):</label>
          <br/>
          <input type="file" onChange={handleFileChange} accept=".xlsx" />
        </div>

        <div className="form-group" style={{ marginBottom: '15px' }}>
          <label>Categoría a simular (ej. Ventas):</label>
          <br/>
          <input 
            type="text" 
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{ width: '90%' }}
          />
        </div>

        <div className="form-group">
          <label>Porcentaje (ej. 10):</label>
          <br/>
          <input 
            type="number" 
            value={porcentaje}
            onChange={(e) => setPorcentaje(e.target.value)}
          />
        </div>
      </div>

      {/* --- 7. TU BOTÓN ORIGINAL (CONECTADO) --- */}
      <button 
        className="cta-button" 
        onClick={handleUpload}  // <-- CONEXIÓN AÑADIDA
        disabled={loading}      // <-- AÑADIDO
      >
        {loading ? 'Analizando...' : 'Realizar tu análisis con IA'}
      </button>

      {/* --- 8. SECCIÓN DE RESULTADOS (AÑADIDA) --- */}
      {errorMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>}

      {/* Aquí mostramos el JSON crudo de la respuesta */}
      {jsonResponse && (
        <div className="card" style={{ marginTop: '20px', textAlign: 'left' }}>
          <h3>Respuesta CRUDA de la API (Prueba de Conexión):</h3>
          <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
            {jsonResponse}
          </pre>
        </div>
      )}
    </>
  )
}

export default Dashboard
