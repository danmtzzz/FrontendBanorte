import React from 'react';
import logo from '../../../../src/assets/Banorte.png';
import '../../Pure/LogIn/LogIn.css';

const logIn = () => {
    return (
        <div className='logIn-screen'>
            <div className='logIn-Box'>
                <img src={logo} alt='logoBanorte' className='logo'/>
                <h2>Inicio de sesión</h2>
                <form className='login-form'>
                    <input type='text' placeholder='Usuario' className='logIn-input'/>
                    <input type='text' placeholder='Contraseña' className='logIn-input'/>
                    <button type='submit' className='logIn-button'>Ingresar</button>
                </form>
            </div>
        </div>
    );
}

export default logIn;
