import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

function Register() {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [sexo, setSexo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // console.log('Datos a enviar:', {
        //     fullName,
        //     username,
        //     email,
        //     birthDate,
        //     sexo,
        //     password
        // });
        

        try {
            const response = await axios.post('https://calculadora-imc-prueba.netlify.app/api/register', {
                fullName, username, email, birthDate, sexo, password });

            setSuccess(response.data.message);
            
            // Limpiar campos
            setFullName('');
            setUsername('');
            setEmail('');
            setBirthDate('');
            setSexo('');
            setPassword('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error en el registro');
        }
    };

    return (
        <div className="register-container">
        <h2 className="register-title">Registrarse</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <form className="register-form" onSubmit={handleRegister}>
            <div className="form-group">
                <label>Nombre Completo</label>
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Nombre de Usuario:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Correo Electrónico:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Fecha de Nacimiento:</label>
                <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label>Sexo</label>
                <select
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    required
                >
                    <option value="">Seleccione</option>
                    <option value="m">Masculino</option>
                    <option value="f">Femenino</option>
                </select>
            </div>
            <div className="form-group">
                <label>Contraseña:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button className="submit-button" type="submit">Registrarse</button>
        </form>
    </div>
    );
}

export default Register;