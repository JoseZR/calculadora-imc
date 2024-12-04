import './App.css';
import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';

function App() {
    const [view, setView] = useState(
        localStorage.getItem('token') ? 'profile' : 'login' // Vista inicial basada en el token
    );

    const handleLoginSuccess = () => {
        setView('profile'); // Cambiar a la vista de perfil después de iniciar sesión
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Eliminar el token
        setView('login'); // Cambiar a la vista de inicio de sesión
    };

    return (
        <div className="app-container">
            {view === 'profile' ? (
                <div className="profile-container">
                    <Profile />
                    <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            ) : (
                <div className="auth-container">
                    <div className="auth-buttons">
                        <button 
                            className="auth-button login-button" 
                            onClick={() => setView('login')}
                        >
                            Iniciar Sesión
                        </button>
                        <button 
                            className="auth-button register-button" 
                            onClick={() => setView('register')}
                        >
                            Registrarse
                        </button>
                    </div>
                    {view === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}
                    {view === 'register' && <Register />}
                </div>
            )}
        </div>
    );
}

export default App;
