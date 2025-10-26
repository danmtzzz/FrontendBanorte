import React, { useState } from 'react';
import styles from './UploadView.module.css'; // Importa el CSS Módulo
import axios from 'axios'; // <-- ¡NUEVO! Importamos axios

// --- Ícono SVG (de tu código) ---
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
  // 1. Cambiamos 'fileName' por 'selectedFile' para guardar el objeto File
  const [selectedFile, setSelectedFile] = useState(null); 
  const [isDragging, setIsDragging] = useState(false); // (de tu código)
  
  // 2. ¡NUEVOS ESTADOS! (de la lógica anterior)
  const [userType, setUserType] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Para mensajes de éxito sin 'alert'


  // --- Lógica de Manejo de Archivos ---

  // 3. ¡LÓGICA ACTUALIZADA!
  // Esta función centraliza la validación y guardado del *archivo*
  const handleFile = (file) => {
    if (file && (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      setSelectedFile(file); // <-- Guarda el objeto File
      setError(null);      // Limpia errores
      setSuccess(null);    // Limpia éxito
    } else {
      setSelectedFile(null); // Limpia el archivo
      if (file) {
        // Usamos el estado de error, no un 'alert'
        setError("Por favor, selecciona solo archivos .xls o .xlsx");
      }
    }
  };

  // 4. (de tu código) Manejador para el <input type="file">
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      handleFile(event.target.files[0]);
    }
  };

  // 5. (de tu código) Manejadores de Drag-and-Drop
  const handleDragOver = (event) => {
    event.preventDefault(); 
    if (!loading) setIsDragging(true); // Solo si no está cargando
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (loading) return; // No hacer nada si está cargando

    if (event.dataTransfer.files.length > 0) {
      handleFile(event.dataTransfer.files[0]);
      event.dataTransfer.clearData();
    }
  };

  // 6. ¡NUEVO! Manejador para el selector de tipo
  const handleTypeChange = (event) => {
    setUserType(event.target.value);
  };

  // 7. ¡NUEVO! Manejador para el botón "Regresar"
  const handleReturn = () => {
    if (!loading) {
      setView('main');
    }
  };

  // 8. ¡NUEVA LÓGICA! Para el botón "Aceptar y Analizar"
  const handleAccept = async () => {
    if (!selectedFile) {
        setError('Por favor, selecciona un archivo primero.');
        return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData();
    formData.append('file', selectedFile);

    // Ajusta esta URL a tu endpoint de FastAPI
    const backendUrl = `http://127.0.0.1:8000/upload/?tipo_usuario=${userType}`;

    try {
        const response = await axios.post(backendUrl, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Respuesta del backend:', response.data);
        setSuccess('¡Archivo subido con éxito! Listo para analizar.');
        setSelectedFile(null); // Limpia el archivo después de subirlo
        
        // Futuro paso: setView('dashboard');

    } catch (err) {
        console.error('Error al subir el archivo:', err);
        setError('Hubo un error al subir el archivo. Revisa la consola.');
    } finally {
        setLoading(false);
    }
  };


  // --- RENDERIZADO ---
  return (
    <div className={styles.uploadViewContainer}>
      {/* Botón Volver (actualizado con el nuevo handler) */}
      <button 
        className={styles.backButton} 
        onClick={handleReturn} // <-- Usa el handler
        disabled={loading} // <-- Deshabilitado si carga
      >
        &larr; Volver al Dashboard
      </button>
      
      <h2>Cargar archivo de Excel</h2>
      <p>Arrastra tu archivo .xls o .xlsx aquí para analizarlo.</p>
      
      {/* --- ¡NUEVO! Selector de Tipo de Cuenta --- */}
      <div className={styles.optionGroup}>
          <label htmlFor="user-type-select">Tipo de Cuenta:</label>
          <select 
              id="user-type-select" 
              value={userType} 
              onChange={handleTypeChange}
              disabled={loading}
          >
              <option value="personal">Finanzas Personales</option>
              <option value="pyme">Finanzas PYME</option>
          </select>
      </div>

      {/* --- Zona de "Drag and Drop" (actualizada) --- */}
      <div 
        // Clases dinámicas: aplica 'dragOver' o 'disabledLabel' (si está cargando)
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
          disabled={loading} // <-- Deshabilitado si carga
        />
        
        <UploadIcon /> 
        
        <p className={styles.uploadText}>
          Arrastra y suelta tu archivo aquí
        </p>
        <p className={styles.uploadSubtext}>o</p>

        {/* El label también se deshabilita visualmente */}
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

      {/* --- ¡NUEVO! Mensajes de Estado --- */}
      {error && (
        <p className={styles.errorInfo}>{error}</p>
      )}
      {success && (
        <p className={styles.successInfo}>{success}</p>
      )}

      {/* Actualizado para usar 'selectedFile' */}
      {selectedFile && !error && (
        <p className={styles.fileNameDisplay}>
          Archivo seleccionado: <strong>{selectedFile.name}</strong>
        </p>
      )}

      {/* --- ¡NUEVO! Botón de Aceptar --- */}
      <div className={styles.buttonGroup}>
          <button 
              className={styles.btnAccept} 
              onClick={handleAccept}
              // Deshabilitado si no hay archivo O si está cargando
              disabled={!selectedFile || loading}
          >
              {loading ? 'Cargando...' : 'Aceptar y Analizar'}
          </button>
      </div>
    </div>
  )
}

export default UploadView;

