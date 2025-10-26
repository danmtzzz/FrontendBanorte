// 1. IMPORTACIONES COMPLETAS (¡Con BarChart!)
import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, Cell // <-- ¡NUEVO! Importa los componentes de Gráfica de Barras
} from 'recharts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faChartSimple } from '@fortawesome/free-solid-svg-icons';
import styles from './UploadView.module.css'; 
import axios from 'axios'; 

// --- Ícono SVG (Sin cambios) ---
const UploadIcon = () => (
  <svg
    className={styles.uploadIcon}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
// --- FIN del Ícono ---

// --- FUNCIÓN PARA FORMATEAR NÚMEROS GRANDES (K, M, B) (Sin cambios) ---
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

// --- *** FUNCIÓN DE TRANSFORMACIÓN (ACTUALIZADA) *** ---
// Esta función ahora procesa el 'analisis_descriptivo' para la gráfica de BARRAS
const transformarDatosParaBarras = (apiData) => {
  if (!apiData || !apiData.analisis_descriptivo || !apiData.analisis_descriptivo.principales_gastos_por_categoria) {
    console.error("Estructura de datos inesperada o sin gastos:", apiData);
    return [];
  }
  
  const gastos = apiData.analisis_descriptivo.principales_gastos_por_categoria;
  
  // Convertimos el objeto {"Ahorro": 100, "Comida": 50} en un array [{name: "Ahorro", monto: 100}, {name: "Comida", monto: 50}]
  return Object.keys(gastos).map(categoria => ({
    name: categoria,
    monto: gastos[categoria]
  }));
};
// -----------------------------------------------------------

// Colores para la gráfica de barras
const COLORS = ['#EB0019', '#004a99', '#ffc107', '#28a745', '#6c757d', '#17a2b8'];


// === EL COMPONENTE PRINCIPAL ===
function UploadView({ setView }) {

  // --- ESTADOS (Sin cambios) ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null); 
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDashboardContent, setShowDashboardContent] = useState(false);

  // --- REFS (Sin cambios) ---
  const timeoutRef = useRef(null);
  const isStillLoadingRef = useRef(false);
  const fileInputRef = useRef(null);

  // --- Limpieza de Timeouts (Sin cambios) ---
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      isStillLoadingRef.current = false;
    };
  }, []); 

  // --- Handlers (Sin cambios) ---
  const handleFile = (file) => {
    if (analysisResult) setAnalysisResult(null);
    if (showDashboardContent) setShowDashboardContent(false);

    if (file && (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      setSelectedFile(file);
      setError(null);
      setUploadProgress(0);
    } else {
      setSelectedFile(null);
      if (file) {
        setError("Por favor, selecciona solo archivos .xls o .xlsx");
      }
    }
   };
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      handleFile(event.target.files[0]);
    }
   };
  const handleDragOver = (event) => {
    event.preventDefault();
    if (!loading) setIsDragging(true);
   };
  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
   };
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (loading) return;

    if (event.dataTransfer.files.length > 0) {
      handleFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
   };
  
  // Botón Volver / Cargar otro (Sin cambios)
  const handleReturn = () => {
    if (!loading) {
      if (showDashboardContent) {
        setShowDashboardContent(false);
        setSelectedFile(null);
        setAnalysisResult(null);
        setError(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = null; 
        }
      } else {
        setView('main'); 
      }
    }
  };

  // Botón Cancelar archivo seleccionado (Sin cambios)
  const handleCancelFile = () => {
    if (loading) return;
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };


  // --- LÓGICA DE SUBIDA Y ANÁLISIS ---
  const handleAccept = async () => {
    if (!selectedFile) {
        setError('Por favor, selecciona un archivo primero.');
        return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null); 
    setUploadProgress(0);
    isStillLoadingRef.current = true;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Simulación de progreso (la ajusté un poco, puedes cambiarla)
    const simulateProgress = () => {
      if (!isStillLoadingRef.current) return;
      const randomIncrement = Math.random() * 14 + 1; 
      const randomDelay = Math.random() * 4000 + 1000; 
      setUploadProgress(prev => {
        let newProgress = prev + randomIncrement;
        if (newProgress >= 98) { 
          return 98;
        } else {
          timeoutRef.current = setTimeout(simulateProgress, randomDelay);
          return newProgress;
        }
      });
    };
    setUploadProgress(1); 
    timeoutRef.current = setTimeout(simulateProgress, 300 + Math.random() * 500);

    // Petición REAL a la API
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // --- URL DE LA API (Corregida a la que pusiste en tu código) ---
    const backendUrl = `http://129.213.136.1/api/v1/analisis/financiero`; 
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    try {
        const response = await axios.post(backendUrl, formData, config);
        
        isStillLoadingRef.current = false; 
        clearTimeout(timeoutRef.current); 
        setUploadProgress(100); 

        setTimeout(() => {
          console.log('Respuesta del backend:', response.data);
          setAnalysisResult(response.data);
          setShowDashboardContent(true);     
          setLoading(false);                 
        }, 300);

    } catch (err) {
        // --- MANEJO DE ERROR (Sin cambios) ---
        isStillLoadingRef.current = false; 
        clearTimeout(timeoutRef.current); 
        console.error('Error al subir el archivo:', err);
        if (err.response) {
            setError(`Error del servidor: ${err.response.data.detail || err.response.statusText}`);
        } else if (err.request) {
            setError('No se pudo conectar con el servidor. ¿Está encendido?');
        } else {
            setError('Ocurrió un error inesperado al preparar la solicitud.');
        }
        setLoading(false);           
        setUploadProgress(0);        
    }
  };
  // --- FIN LÓGICA DE SUBIDA ---


  // --- RENDERIZADO ---
  return (
    <div className={styles.uploadViewContainer}>

      {/* Botón Volver / Cargar Otro Archivo */}
      <button
        className={styles.backButton}
        onClick={handleReturn}
        disabled={loading}
      >
        {showDashboardContent ? '← Cargar otro archivo' : '← Volver al Menú'}
      </button>

      {/* --- RENDERIZADO CONDICIONAL: DASHBOARD O UPLOAD --- */}
      {showDashboardContent && analysisResult ? (
        /* --- A. CONTENIDO DEL DASHBOARD --- */
        <>
          {/* Título del Dashboard (Ahora usa el 'tipo_archivo' del JSON) */}
          <h2 className={styles.dashboardTitle}>
            Análisis de: {analysisResult.tipo_archivo || "Estadísticas Generales"}
          </h2>

          {/* --- *** GRÁFICA ACTUALIZADA A BARRAS *** --- */}
          <div className={styles.chartCardLarge}>
            <h3 className={styles.chartTitle}>Principales Gastos por Categoría</h3>
            {(() => {
                // Procesa los datos de la API con la nueva función de BARRAS
                const chartData = transformarDatosParaBarras(analysisResult); 
                
                if (chartData.length > 0) {
                  return (
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatYAxisTick} />
                        <Tooltip formatter={(value) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)} />
                        {/* <Legend /> - No se ve tan bien en gráficas de barras con colores */}
                        <Bar dataKey="monto">
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  );
                } else {
                  return <p className={styles.loadingText}>No se encontraron datos de gastos para graficar.</p>;
                }
            })()}
          </div>
          {/* --- FIN DEL GRÁFICO --- */}

          {/* Botón de Acción Único (Sin cambios) */}
          <div className={styles.actionsContainer}>
             <button className={styles.actionButton}>
              <FontAwesomeIcon icon={faChartSimple} />
              <span>Estadísticas Detalladas</span>
            </button>
          </div>
          
          {/* --- RECOMENDACIÓN DE LA IA --- */}
          {analysisResult.analisis_ia && analysisResult.analisis_ia.recomendacion && (
            <div className={styles.iaRecommendationCard}>
              <h3 className={styles.chartTitle}>Recomendación de la IA</h3>
              {/* Usamos 'dangerouslySetInnerHTML' para renderizar el HTML/Markdown que viene de la IA */}
              {/* Lo separamos en párrafos para mejor lectura */}
              <div 
                className={styles.iaText}
                dangerouslySetInnerHTML={{ 
                  __html: analysisResult.analisis_ia.recomendacion
                            .replace(/### (.*?)\n/g, '<h4>$1</h4>') // Convierte ### a h4
                            .replace(/1\. (.*?)\n/g, '<p><b>1. $1</b></p>') // Pone puntos principales en negrita
                            .replace(/2\. (.*?)\n/g, '<p><b>2. $1</b></p>')
                            .replace(/3\. (.*?)\n/g, '<p><b>3. $1</b></p>')
                            .replace(/4\. (.*?)\n/g, '<p><b>4. $1</b></p>')
                            .replace(/5\. (.*?)\n/g, '<p><b>5. $1</b></p>')
                            .replace(/- (.*?)\n/g, '<p style="padding-left: 1rem;">- $1</p>') // Indenta sub-puntos
                }} 
              />
            </div>
          )}

        </>
        /* --- FIN DEL DASHBOARD --- */

      ) : (
        /* --- B. CONTENIDO DE UPLOAD --- */
        <>
          <h2>Cargar archivo de Excel</h2>
          <p>Arrastra tu archivo .xls o .xlsx aquí para analizarlo.</p>

          {/* Zona Drag and Drop (Sin cambios) */}
          <div
            className={`
              ${styles.dropZone}
              ${isDragging ? styles.dragOver : ''}
              ${loading ? styles.disabledLabel : ''}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className={styles.fileInputHidden}
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              disabled={loading}
              ref={fileInputRef}
            />
            <UploadIcon />
            <p className={styles.uploadText}>Arrastra y suelta tu archivo aquí</p>
            <p className={styles.uploadSubtext}>o</p>
            <label
              htmlFor="file-upload"
              className={`
                ${styles.selectButton}
                ${loading ? styles.disabledLabel : ''}
              `}
            >
              Seleccionar Archivo
            </label>
          </div>

          {/* Mensajes de Estado (Sin cambios) */}
          {error && <p className={styles.errorInfo}>{error}</p>}
          
          {/* Contenedor del Archivo Seleccionado y Cancelar (Sin cambios) */}
          {selectedFile && !error && (
            <div className={styles.fileInfoContainer}>
              <p className={styles.fileNameDisplay}>
                Archivo seleccionado: <strong>{selectedFile.name}</strong>
              </p>
              {/*<button
                className={styles.btnCancel}
                onClick={handleCancelFile}
                disabled={loading}
              >
                Cancelar
              </button>*/}
            </div>
          )}

          {/* Botón Aceptar y Analizar (Sin cambios) */}
          <div className={styles.buttonGroup}>
            <button
              className={styles.btnAccept}
              onClick={handleAccept}
              disabled={!selectedFile || loading} 
            >
              {loading && (
                <div
                  className={styles.progressBar}
                  style={{ width: `${uploadProgress}%` }}
                />
              )}
              <span className={styles.progressText}>
                {loading
                  ? `Procesando... ${Math.round(uploadProgress)}%` 
                  : 'Aceptar y Analizar'}
              </span>
            </button>
          </div>
        </>
        /* --- FIN DEL UPLOAD --- */

      )} {/* --- FIN DEL CONDICIONAL --- */}
    </div>
  );
}

export default UploadView;

