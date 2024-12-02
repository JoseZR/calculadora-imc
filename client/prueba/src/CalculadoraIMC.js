import React, { useState } from 'react';
import axios from 'axios';


const CalculadoraIMC = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

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
    calculateBMI(); // Calcula el IMC primero

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('No estás autenticado');
      return;
    }

    try {
      const response = await axios.put('http://localhost:5000/api/update-health-metrics', 
        {
          weight: parseFloat(weight),
          height: parseFloat(height),
          bmi: parseFloat(bmi),
          bmi_status: status
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(response.data.message || 'Datos actualizados correctamente');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error al actualizar los datos');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Actualizar Métricas de Salud</h2>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Peso (kg)</label>
        <input 
          type="number" 
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Ingresa tu peso"
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Altura (m)</label>
        <input 
          type="number" 
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Ingresa tu altura en metros"
          step="0.01"
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button 
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Actualizar Métricas
      </button>
      
      {bmi && status && (
        <div className="mt-4 text-center">
          <p>Tu IMC es: {bmi}  kg/m2 </p>
          <p>Estado: {status}</p>
        </div>
      )}

      {message && (
        <div className="mt-4 p-3 text-center bg-gray-100 rounded">
          {message}
        </div>
      )}
    </div>
  );
};

export default CalculadoraIMC;