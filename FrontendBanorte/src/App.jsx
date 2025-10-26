// src/App.jsx
import { useState } from 'react';
import './App.css'; // <-- Este CSS ahora sí lo usaremos

// 1. Importas todas tus vistas
import LogIn from './Components/Pure/LogIn/LogIn';
import MainView from './views/MainView';
import UploadView from './views/UploadView';

function App() {
  // Estado: 'login', 'main', o 'upload'
  const [view, setView] = useState('login'); 

  // Esta función decide qué vista mostrar
  const renderView = () => {
    switch (view) {
      case 'main':
        return <MainView setView={setView} />;
      case 'upload':
        return <UploadView setView={setView} />;
      case 'login':
      default:
        // Pasamos setView al Login para que pueda cambiar de vista
        return <LogIn setView={setView} />;
    }
  };

  // Esta clase en el 'div' principal nos permite
  // cambiar el fondo si es el login o la app principal
  const layoutClass = view === 'login' ? 'login-layout' : 'app-layout';

  return (
    <div className={`app-container ${layoutClass}`}>
      {renderView()}
    </div>
  );
}

export default App;