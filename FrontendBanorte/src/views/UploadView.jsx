// src/views/UploadView.jsx

// 1. IMPORTACIONES NECESARIAS (limpiadas)
import React, { useState, useRef } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'; // Para el gráfico
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Para los íconos
import { faChartSimple, faFileLines } from '@fortawesome/free-solid-svg-icons'; // Íconos
import styles from './UploadView.module.css'; // Tus estilos

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

// --- DATOS DE EJEMPLO PARA EL GRÁFICO ---
const datosDeEjemplo = [
  { fecha: "Ene 23", Ahorro: 933131 }, { fecha: "Feb 23", Ahorro: 1825004 },
  { fecha: "Mar 23", Ahorro: 2803839 }, { fecha: "Abr 23", Ahorro: 3609590 },
  { fecha: "May 23", Ahorro: 4258505 }, { fecha: "Jun 23", Ahorro: 4987381 }
];
// ----------------------------------------


function UploadView({ setView }) { // Mantenemos setView por si necesitas volver al menu principal

  // --- ESTADOS ---
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [userType, setUserType] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const fileInputRef = useRef(null);
  // --- NUEVO ESTADO PARA CONTROLAR LA VISTA INTERNA ---
  const [showDashboardContent, setShowDashboardContent] = useState(false);


  // --- Lógica de Manejo de Archivos (Sin cambios) ---
  const handleFile = (file) => {
    if (file && (file.type === "application/vnd.ms-excel" || file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
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

  // Botón Volver / Cargar otro
  const handleReturn = () => {
    if (!loading) {
      if (showDashboardContent) {
        setShowDashboardContent(false); // Vuelve a la vista de carga
        setSelectedFile(null);       // Limpia el archivo
        setSuccess(null);
        setError(null); // Limpia errores también
        if (fileInputRef.current) {
          fileInputRef.current.value = null; // Resetea input
        }
      } else {
        setView('main'); // Vuelve al menú principal (si vienes de ahí)
      }
    }
  };

  // Botón Cancelar archivo seleccionado
  const handleCancelFile = () => {
    if (loading) return;
    setSelectedFile(null);
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // Botón Aceptar y Analizar (AHORA MUESTRA EL DASHBOARD INTERNO)
  const handleAccept = () => {
    if (!selectedFile) {
      setError('Por favor, selecciona un archivo primero.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    // Simula el procesamiento del archivo
    setTimeout(() => {
      setLoading(false);
      // setSuccess('¡Archivo procesado!'); // Mensaje opcional
      setShowDashboardContent(true); // <-- MUESTRA EL DASHBOARD

    }, 1500); // Simula 1.5 segundos
  };

  // (Opcional) Función para el botón "Generar Reporte" del dashboard interno
  const handleGenerarReporte = () => {
      console.log("Generando reporte...");
      // Aquí iría la lógica
  };


  // --- RENDERIZADO ---
  return (
    // Contenedor blanco principal
    <div className={styles.uploadViewContainer}>

      {/* Botón Volver / Cargar Otro Archivo */}
      <button
        className={styles.backButton}
        onClick={handleReturn}
        disabled={loading}
      >
        {/* Usamos el símbolo de flecha unicode */}
        {showDashboardContent ? '← Cargar otro archivo' : '← Volver al Menú'}
      </button>

      {/* --- RENDERIZADO CONDICIONAL: DASHBOARD O UPLOAD --- */}
      {showDashboardContent ? (

        /* --- CONTENIDO DEL DASHBOARD --- */
        <>
          {/* Título del Dashboard */}
          <h2 className={styles.dashboardTitle}>Estadísticas Generales</h2>

          {/* Tarjeta del Gráfico */}
          <div className={styles.chartCard}>
            {loading ? ( // Mantenemos el loader por si acaso
              <p className={styles.loadingText}>Cargando gráfico...</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={datosDeEjemplo} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="Ahorro" stroke="#007bff" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Botones de Acción del Dashboard */}
          <div className={styles.actionsContainer}>
            <button className={styles.actionButton}>
              <FontAwesomeIcon icon={faChartSimple} />
              <span>Estadísticas Detalladas</span>
            </button>
            <button className={styles.actionButton} onClick={handleGenerarReporte}>
              <FontAwesomeIcon icon={faFileLines} />
              <span>Generar Nuevo Reporte</span>
            </button>
          </div>
        </>
        /* --- FIN DEL DASHBOARD --- */

      ) : (

        /* --- CONTENIDO DE UPLOAD (Tu código original) --- */
        <>
          <h2>Cargar archivo de Excel</h2>
          <p>Arrastra tu archivo .xls o .xlsx aquí para analizarlo.</p>

          {/* Selector de Tipo */}
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

          {/* Zona Drag and Drop */}
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
              ref={fileInputRef} // <-- La ref sigue aquí
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

          {/* Mensajes de Estado */}
          {error && <p className={styles.errorInfo}>{error}</p>}
          {success && <p className={styles.successInfo}>{success}</p>}

          {/* Contenedor del Archivo Seleccionado y Cancelar */}
          {selectedFile && !error && (
            <div className={styles.fileInfoContainer}>
              <p className={styles.fileNameDisplay}>
                Archivo seleccionado: <strong>{selectedFile.name}</strong>
              </p>
              <button
                className={styles.btnCancel}
                onClick={handleCancelFile}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Botón Aceptar y Analizar */}
          <div className={styles.buttonGroup}>
            <button
              className={styles.btnAccept}
              onClick={handleAccept}
              disabled={!selectedFile || loading}
            >
              {loading ? 'Cargando...' : 'Aceptar y Analizar'}
            </button>
          </div>
        </>
        /* --- FIN DEL UPLOAD --- */

      )} {/* --- FIN DEL CONDICIONAL --- */}
    </div>
  );
}

export default UploadView;