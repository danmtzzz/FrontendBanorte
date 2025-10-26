// src/Components/Pure/LogIn/LogIn.jsx
import React from 'react';
import logo from '../../../../src/assets/Logo.png'; // <- Usa el Logo.png que subiste
import styles from './LogIn.module.css'; // <-- ¡Importa el módulo!

// Recibe 'setView' como prop desde App.jsx
const LogIn = ({ setView }) => {

    // Manejador para el login
    const handleLogin = (e) => {
        e.preventDefault(); // Evita que la página se recargue
        // Aquí iría tu lógica de autenticación...
        
        // Si es exitoso, cambia la vista:
        setView('main');
    };

    return (
        <div className={styles.logInScreen}>
            <div className={styles.logInBox}>
                <img src={logo} alt='logoBanorte' className={styles.logo}/>
                <h2>Inicio de sesión</h2>
                
                {/* Usamos 'onSubmit' en el form */}
                <form className={styles.logInForm} onSubmit={handleLogin}>
                    <input type='text' placeholder='Usuario' className={styles.logInInput} required />
                    <input type-='password' placeholder='Contraseña' className={styles.logInInput} required />
                    <button type='submit' className={styles.logInButton}>Ingresar</button>
                </form>
            </div>
        </div>
    );
}

export default LogIn;