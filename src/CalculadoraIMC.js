import React, { useState } from 'react';
import axios from 'axios';
import './CalculadoraIMC.css';

const CalculadoraIMC = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  const getStatusClass = () => {
    switch (status) {
      case 'Bajo peso':
        return 'status-low';
      case 'Peso normal':
        return 'status-normal';
      case 'Sobre peso':
        return 'status-high';
      case 'Obesidad':
        return 'status-obese';
      default:
        return '';
    }
  };
  

  const calculateBMI = () => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (isNaN(weightNum) || isNaN(heightNum) || heightNum <= 0 || weightNum <= 0) {
      alert('Por favor, ingresa valores válidos para peso y altura');
      return;
    }

    const calculatedBMI = weightNum / (heightNum * heightNum);
    const resultIMC = calculatedBMI * 10000;
    const numeroRedondeadoIMC = resultIMC.toFixed(2);
    setBMI(numeroRedondeadoIMC);

    if (numeroRedondeadoIMC < 18.5) {
      setStatus('Bajo peso');
    } else if (numeroRedondeadoIMC >= 18.5 && numeroRedondeadoIMC < 25) {
      setStatus('Peso normal');
    } else if (numeroRedondeadoIMC >= 25 && numeroRedondeadoIMC < 30) {
      setStatus('Sobre peso');
    } else {
      setStatus('Obesidad');
    }
  };

  const handleSubmit = async () => {
    calculateBMI();

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No estás autenticado');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/api/update-health-metrics',
        {
          weight: parseFloat(weight),
          height: parseFloat(height),
          bmi: parseFloat(bmi),
          bmi_status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage(response.data.message || 'Datos actualizados correctamente');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al actualizar los datos');
    }
  };

  return (
    <div className="calculadora-imc-container">
      <h2 className="calculadora-imc-title">Conoce tu estado de nutrición</h2>

      <input
        type="number"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        placeholder="Peso (kg)"
        className="calculadora-imc-input"
      />

      <input
        type="number"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        placeholder="Altura (m)"
        className="calculadora-imc-input"
        step="0.01"
      />

      <button onClick={handleSubmit} className="calculadora-imc-button">
        Actualizar Métricas
      </button>

      {bmi && status && (
        <div className="calculadora-imc-result">
          <p>Tu IMC es: {bmi} kg/m²</p>
          {bmi && status && (
        <div className={`calculadora-imc-status ${getStatusClass()}`}>
          <p> <strong>Estado: {status}</strong> </p>
        </div>
      )}
        </div>
      )}
      {message && <div className="calculadora-imc-message">{message}</div>}
    </div>
  );
};

export default CalculadoraIMC;
