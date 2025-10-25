import '../DashBoard/DahsBoard.css'

/* PASO 1: Importa tus propios íconos.
  Asegúrate de poner tus archivos de íconos (ej. .svg o .png) 
  en la carpeta 'src/assets/' y de que los nombres coincidan.
*/
import iconoFinanzas from '../../../assets/finanzas.png' // <-- CAMBIA ESTE NOMBRE
import iconoRiesgos from '../../../assets/alerta.png'  // <-- CAMBIA ESTE NOMBRE
import iconoPlan from '../../../assets/estadisticas.png'      // <-- CAMBIA ESTE NOMBRE

function App() {
  /* No necesitamos 'useState' porque el contador se fue */

  return (
    /* Usamos un Fragment (<>) para agrupar todo */
    <>
      {/* El título principal */}
      <h1>¡Bienvenido a tu copiloto!</h1>

      {/* El contenedor para las 3 tarjetas */}
      <div className="cards-container">
        
        {/* Tarjeta 1 */}
        <div className="card">
          <img src={iconoFinanzas} alt="Icono de finanzas" />
          <p>Proyecta tus finanzas</p>
        </div>

        {/* Tarjeta 2 */}
        <div className="card">
          <img src={iconoRiesgos} alt="Icono de riesgos" />
          <p>Anticipa riesgos</p>
        </div>

        {/* Tarjeta 3 */}
        <div className="card">
          <img src={iconoPlan} alt="Icono de plan" />
          <p>Entiende tu presente y planea tu futuro</p>
        </div>
      </div>

      {/* El botón de acción principal */}
      <button className="cta-button">
        Realizar tu análisis con IA
      </button>
    </>
  )
}

export default App
