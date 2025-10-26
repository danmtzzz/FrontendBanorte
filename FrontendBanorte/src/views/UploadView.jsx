// src/views/UploadView.jsx

// 1. IMPORTACIONES COMPLETAS (incluyendo axios)
import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'; // Para el gráfico
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Para los íconos
import { faChartSimple, faFileLines } from '@fortawesome/free-solid-svg-icons'; // Íconos (restauramos faFileLines por si acaso)
import styles from './UploadView.module.css'; // Tus estilos
import axios from 'axios'; // Para la llamada real a la API

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

// --- FUNCIÓN PARA TRANSFORMAR DATOS DE LA API (Sin cambios) ---
const transformarDatosApi = (apiData) => {
  if (!apiData || !apiData.initial_data || !apiData.initial_data.datos_historicos) {
    console.error("Estructura de datos inesperada:", apiData);
    return [];
  }
  const historico = apiData.initial_data.datos_historicos;
  if (!historico.fechas || !historico.ahorro_acumulado || historico.fechas.length !== historico.ahorro_acumulado.length) {
     console.error("Arrays de fechas y ahorro no coinciden:", historico);
     return [];
  }
  return historico.fechas.map((fecha, index) => ({
    fecha: new Date(fecha).toLocaleDateString('es-MX', { month: 'short', year: '2-digit' }),
    "Ahorro Acumulado": historico.ahorro_acumulado[index]
  }));
};
// -----------------------------------------------------------

// === EL COMPONENTE PRINCIPAL ===
function UploadView({ setView }) {

  // --- ESTADOS (Sin cambios) ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [userType, setUserType] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null); // <-- Aquí se guarda el JSON de la API
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


  // --- (Handlers de archivo, drag/drop, etc.) ---
  const handleFile = (file) => {
    if (analysisResult) setAnalysisResult(null);
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
  const handleTypeChange = (event) => {
    setUserType(event.target.value);
   };

  // Botón Volver / Cargar otro (Sin cambios)
  const handleReturn = () => {
    if (!loading) {
      if (showDashboardContent) {
        // Si está mostrando el dashboard, resetea todo para volver a cargar
        setShowDashboardContent(false);
        setSelectedFile(null);
        setAnalysisResult(null);
        setError(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = null; // Resetea input
        }
      } else {
        // Si está en la vista de carga, vuelve al menú principal
        setView('main'); // Llama a la función del App.jsx
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


  // --- LÓGICA DE SUBIDA Y ANÁLISIS (CON LLAMADA A API RESTAURADA) ---
  const handleAccept = async () => {
    if (!selectedFile) {
        setError('Por favor, selecciona un archivo primero.');
        return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null); // Limpia resultado anterior
    setUploadProgress(0);
    isStillLoadingRef.current = true;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Simulación de progreso (sin cambios)
    const simulateProgress = () => {
      if (!isStillLoadingRef.current) return;
      const randomIncrement = Math.random() * 10 + 5;
      const randomDelay = Math.random() * 800 + 200;
      setUploadProgress(prev => {
        let newProgress = prev + randomIncrement;
        if (newProgress >= 98) { // Se detiene cerca del final
          return 98;
        } else {
          timeoutRef.current = setTimeout(simulateProgress, randomDelay);
          return newProgress;
        }
      });
    };
    setUploadProgress(1); 
    timeoutRef.current = setTimeout(simulateProgress, 500 + Math.random() * 1000); 
    
    // --- Petición REAL a la API ---
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    // --- ¡URL ACTUALIZADA! ---
    // Ya no se envía el parámetro 'tipo_usuario'
    const backendUrl = `http://129.213.136.1/api/v1/analisis/financiero`; 
    
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    try {
        const response = await axios.post(backendUrl, formData, config);
        
        // --- ¡ÉXITO! ---
        isStillLoadingRef.current = false; 
        clearTimeout(timeoutRef.current);  
        setUploadProgress(100); 

        setTimeout(() => { 
          console.log('Respuesta del backend:', response.data);
          setAnalysisResult(response.data); 
          setLoading(false); 
          setSelectedFile(null); 
        }, 300);

    } catch (err) {
        // --- ¡ERROR! ---
        isStillLoadingRef.current = false; 
        clearTimeout(timeoutRef.current);  
        console.error('Error al subir el archivo:', err);
        setError('Hubo un error al subir el archivo. Revisa la consola.');
        setLoading(false); 
        setUploadProgress(0); 

    }
  };
  // --- FIN LÓGICA DE SUBIDA ---

  // Función para el botón "Generar Reporte" (si decides re-añadirlo)
  // const handleGenerarReporte = () => { console.log("Generando reporte...")};


  // --- RENDERIZADO CONDICIONAL ---

  // 1. VISTA DE RESULTADO (JSON)
  // (Esta parte se queda exactamente igual)
  if (analysisResult) {
    return (
      <div className={styles.uploadViewContainer}>
        <button className={styles.backButton} onClick={handleReturnToMain}>
          &larr; Volver al Dashboard
        </button>
        
        <h2>Análisis Completado</h2>
        <p>Este es el JSON que regresó tu API. ¡Listo para las gráficas!</p>

        <div className={styles.jsonViewer}>
          <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
        </div>

        <div className={styles.buttonGroup}>
          <button 
              className={styles.btnAccept}
              onClick={handleResetUploader}
          >
              Analizar otro archivo
          </button>
        </div>
      </div>
    );
  }

  // 2. VISTA DE CARGA (Normal)
  return (
    // Contenedor blanco principal
    <div className={styles.uploadViewContainer}>
      {/* Botón Volver / Cargar Otro Archivo */}
      <button
        className={styles.backButton}
        onClick={handleReturn}
        disabled={loading}
      >
        {showDashboardContent ? '← Cargar otro archivo' : '← Volver al Menú'}
      </button>
      <h2>Cargar archivo de Excel</h2>
      <p>Arrastra tu archivo .xls o .xlsx aquí para analizarlo.</p>
      
      {/* --- ELIMINADO ---
        Ya no existe el <div className={styles.optionGroup}>
        con el <select> de tipo de cuenta.
      */}

      {/* Zona de "Drag and Drop" */}
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
      {/* --- FIN de la Zona --- */}

      {/* Mensajes de Estado (Error) */}
      {error && (
        <p className={styles.errorInfo}>{error}</p>
      )}

      {/* Nombre del archivo */}
      {selectedFile && !error && (
        <p className={styles.fileNameDisplay}>
          Archivo seleccionado: <strong>{selectedFile.name}</strong>
        </p>
      )}

      {/* Botón de Aceptar (No hay que cambiar nada aquí) */}
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

    </div>
  );
}

export default UploadView;