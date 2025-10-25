// src/views/UploadView.jsx

import React, { useState } from 'react';
// (Aquí importarías: import styles from './UploadView.module.css')

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
    <div className="upload-view-container">
      <button className="back-button" onClick={() => setView('main')}>
        &larr; Volver
      </button>
      
      <h2>Cargar archivo de Excel</h2>
      <p>Selecciona un archivo .xls o .xlsx para analizar.</p>
      
      <input 
        type="file" 
        id="file-upload" 
        className="file-input-hidden" 
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload" className="file-upload-label">
        Seleccionar Archivo
      </label>
      
      {fileName && (
        <p className="file-name-display">
          Archivo seleccionado: <strong>{fileName}</strong>
        </p>
      )}
    </div>
  )
}

export default UploadView;