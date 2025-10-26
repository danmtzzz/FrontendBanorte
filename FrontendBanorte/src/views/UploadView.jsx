// src/views/UploadView.jsx
import React, { useState } from 'react';
// Importa el CSS Módulo
import styles from './UploadView.module.css';

function UploadView({ setView }) {
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName('');
    }
  };

  return (
    // Usa los nombres de clase del módulo
    <div className={styles.uploadViewContainer}>
      <button className={styles.backButton} onClick={() => setView('main')}>
        &larr; Volver al Dashboard
      </button>
      
      <h2>Cargar archivo de Excel</h2>
      <p>Selecciona un archivo .xls o .xlsx para analizar.</p>
      
      <input 
        type="file" 
        id="file-upload" 
        className={styles.fileInputHidden} 
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
      {/* El label ahora es el botón principal */}
      <label htmlFor="file-upload" className={styles.fileUploadLabel}>
        Seleccionar Archivo
      </label>
      
      {fileName && (
        <p className={styles.fileNameDisplay}>
          Archivo seleccionado: <strong>{fileName}</strong>
        </p>
      )}
    </div>
  )
}

export default UploadView;