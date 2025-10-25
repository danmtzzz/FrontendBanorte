
// src/App.jsx

import { useState } from 'react' 
import './App.css' // <-- Este CSS ahora solo tendría los layouts y estilos globales


// 1. Importas tus nuevas vistas
import MainView from './views/MainView';
import UploadView from './views/UploadView';

// 4. NUEVA FUNCIÓN 'App' (Controlador)
function App() {

  const [view, setView] = useState('main'); // Estado: 'main' o 'upload'

  return (
    // Esta clase aplica el layout correcto (de App.css)
    <div className={view === 'main' ? 'main-view-layout' : 'upload-view-layout'}>
      
      {/* Lógica para mostrar una vista o la otra */}
      {view === 'main' ? (
        <MainView setView={setView} />
      ) : (
        <UploadView setView={setView} />
      )}

    </div>
  )
}

export default App