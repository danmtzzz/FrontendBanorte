// src/App.jsx
import { useState } from 'react';
import './App.css'; // Asegúrate que App.css esté en la misma carpeta src

// Importas todas tus vistas (corrigiendo las rutas si es necesario)
// Asumiendo que App.jsx está en src/ y las vistas en src/views/ y LogIn en src/Components/Pure/LogIn/
import LogIn from './Components/Pure/LogIn/LogIn'; 
import MainView from './views/MainView';
import UploadView from './views/UploadView';
import DetailView from './views/DetailView'; 

function App() {
  // Estado para la vista actual: 'login', 'main', 'upload', 'detail'
  const [view, setView] = useState('login'); 
  // Estado para guardar el resultado del análisis del archivo subido
  const [uploadSnapshot, setUploadSnapshot] = useState(null); 

  // Esta función decide qué vista mostrar
  const renderView = () => {
    switch (view) {
      case 'main':
        return <MainView setView={setView} />;
      case 'upload':
        // Pasamos el snapshot y la función para actualizarlo
        return <UploadView 
                  setView={setView} 
                  uploadSnapshot={uploadSnapshot} 
                  setUploadSnapshot={setUploadSnapshot} 
                />;
      case 'detail':
          // Pasamos setView y el snapshot guardado (que contiene los análisis)
          // Verifica que uploadSnapshot no sea null antes de pasar a DetailView
          if (!uploadSnapshot) {
             console.error("Error: Intentando ir a DetailView sin datos de análisis.");
             // Opcional: Redirigir a 'upload' o mostrar un mensaje
             setView('upload'); // Vuelve a la vista de carga si no hay datos
             return <UploadView 
                      setView={setView} 
                      uploadSnapshot={null} 
                      setUploadSnapshot={setUploadSnapshot} 
                    />;
          }
          return <DetailView 
                    setView={setView} 
                    initialAnalysis={uploadSnapshot} // <-- Pasamos el análisis aquí
                  />; 
      case 'login':
      default:
        // Pasamos setView al Login para que pueda cambiar de vista
        return <LogIn setView={setView} />;
    }
  };

  // Clase para cambiar el fondo según la vista
  const layoutClass = view === 'login' ? 'login-layout' : 'app-layout';

  return (
    <div className={`app-container ${layoutClass}`}>
      {renderView()}
    </div>
  );
}

export default App;

