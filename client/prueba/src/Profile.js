import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CalculadoraIMC from './CalculadoraIMC';
import './Profile.css';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');

    // Function to calculate age
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDifference = today.getMonth() - birth.getMonth();

        if (monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    // Function to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const sexo = (sexoPersona) => {
        if (sexoPersona === 'm') {
            return 'Masculino';
        } else if (sexoPersona === 'f') {
            return 'Femenino';
        } else {
            return 'Otro';
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('No estás autenticado. Inicia sesión.');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/api/profile', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error al cargar el perfil');
            }
        };

        fetchProfile();
    }, []);

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    if (!userData) {
        return <p>Cargando perfil...</p>;
    }

    return (
        <>
            <section className="container-padre">
                <div className="user-profile-container">
                    <h2 className="user-profile-title">Perfil del Usuario</h2>
                    <div className="user-profile-details">
                        <p><strong>Usuario:</strong> {userData.username}</p>
                        <p><strong>Nombre:</strong> {userData.full_name}</p>
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Fecha de Nacimiento:</strong> {formatDate(userData.birth_date)}</p>
                        <p><strong>Edad:</strong> {calculateAge(userData.birth_date)} años</p>
                        <p><strong>Sexo:</strong> {sexo(userData.sex)}</p>
                    </div>
                </div>
                <CalculadoraIMC />
            </section>
        </>
    );
}

export default Profile;