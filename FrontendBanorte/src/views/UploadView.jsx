import React, { useState, useRef, useEffect } from 'react';
import styles from './UploadView.module.css'; 
import axios from 'axios';

// --- (El ícono SVG se queda igual) ---
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


function UploadView({ setView }) {
  
  // --- ESTADOS ---
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // --- REFS ---
  const timeoutRef = useRef(null);
  const isStillLoadingRef = useRef(false);

  // --- Limpieza ---
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
  
  // const handleTypeChange = (event) => { ... }; // <-- ELIMINADO

  const handleReturnToMain = () => {
    if (loading) return; 
    setView('main');
  };
  const handleResetUploader = () => {
    setAnalysisResult(null);
    setSelectedFile(null);
    setError(null);
    setUploadProgress(0); 
  };


  // --- LÓGICA DE SUBIDA (SIMULACIÓN ALEATORIA) ---
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

    // --- (Función de simulación se queda igual) ---
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
    <div className={styles.uploadViewContainer}>
      <button 
        className={styles.backButton} 
        onClick={handleReturnToMain}
        disabled={loading} 
      >
        &larr; Volver al Dashboard
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
  )
}

export default UploadView;