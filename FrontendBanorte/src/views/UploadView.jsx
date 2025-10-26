// src/views/UploadView.jsx
import React, { useState } from 'react';
import styles from './UploadView.module.css'; // Importa el CSS Módulo

// --- ¡AQUÍ ESTÁ EL ÍCONO CHINGÓN! ---
// Lo ponemos aquí para que sea fácil de usar
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
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false); // Estado para el drag-and-drop

  // Función para manejar la selección de archivos (botón o drop)
  const handleFile = (file) => {
    if (file && (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      setFileName(file.name);
      // Aquí iría tu lógica de subida de archivo
    } else {
      setFileName('');
      if (file) {
        alert("Por favor, selecciona solo archivos .xls o .xlsx");
      }
    }
  };

  // --- Lógica de Drag and Drop ---
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      handleFile(event.target.files[0]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Necesario para permitir el 'drop'
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files.length > 0) {
      handleFile(event.dataTransfer.files[0]);
      // Limpia la transferencia de datos
      event.dataTransfer.clearData();
    }
  };
  // --- FIN de la lógica ---

  return (
    <div className={styles.uploadViewContainer}>
      <button className={styles.backButton} onClick={() => setView('main')}>
        &larr; Volver al Dashboard
      </button>
      
      <h2>Cargar archivo de Excel</h2>
      <p>Arrastra tu archivo .xls o .xlsx aquí para analizarlo.</p>
      
      {/* --- Zona de "Drag and Drop" --- */}
      <div 
        className={`${styles.dropZone} ${isDragging ? styles.dragOver : ''}`}
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
        />
        
        {/* ¡AQUÍ SE USA EL ÍCONO! */}
        <UploadIcon /> 
        
        <p className={styles.uploadText}>
          Arrastra y suelta tu archivo aquí
        </p>
        <p className={styles.uploadSubtext}>o</p>

        <label htmlFor="file-upload" className={styles.selectButton}>
          Seleccionar Archivo
        </label>
      </div>
      {/* --- FIN de la Zona --- */}

      {fileName && (
        <p className={styles.fileNameDisplay}>
          Archivo seleccionado: <strong>{fileName}</strong>
        </p>
      )}
    </div>
  )
}

export default UploadView;