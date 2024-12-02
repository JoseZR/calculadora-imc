import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';


function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/login', {
                username,
                password,
            });

            // Guardar token en localStorage
            localStorage.setItem('token', response.data.token);

            // Notificar al componente padre que el inicio de sesión fue exitoso
            if (onLoginSuccess) onLoginSuccess();

        } catch (err) {
            setError(err.response?.data?.message || 'Error en el inicio de sesión');
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Iniciar Sesión</h2>
            {error && <p className="login-error">{error}</p>}
            <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Nombre de Usuario:</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="form-input"
                    />
                </div>
                <button type="submit" className="login-button">Entrar</button>
            </form>
        </div>
    );
}

export default Login;
