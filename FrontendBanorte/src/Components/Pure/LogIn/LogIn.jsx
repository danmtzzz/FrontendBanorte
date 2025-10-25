import React from 'react';
import logo from '../../../assets/Logo.png';
import '../../Pure/LogIn/LogIn.css';
import {Link} from 'react-router-dom';

const LogIn = () => {
    return (
        <div className='logIn-screen'>
            <div className='logIn-Box'>
                <img src={logo} alt='logoBanorte' className='logo'/>
                <h2>Inicio de sesión</h2>
                <form className='login-form'>
                    <input type='text' placeholder='Usuario' className='logIn-input'/>
                    <input type='text' placeholder='Contraseña' className='logIn-input'/>
                    <Link to='/Dashboard'><button type='button' className='logIn-button'>Ingresar</button></Link>
                </form>
            </div>
        </div>
    );
}

export default LogIn;
