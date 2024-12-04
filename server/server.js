const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Configuración de servidor
const app = express();
const PORT = process.env.PORT || 5000;
// const SECRET_KEY = 'your_secret_key_here';

// Configuración de base de datos
const pool = mysql.createPool({
    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'authentication_db'
    host: 'beurshhoyf3ndcuuvm8a-mysql.services.clever-cloud.com',
    user: 'uxisjxrqb8np0es8',
    password: 'QhwuE0CxanRJJh9pKWEC',
    database: 'beurshhoyf3ndcuuvm8a'
});

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Middleware de autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);

    // jwt.verify(token,  process.env.SECRET_KEY, (err, user) => {
    //     if (err) return res.status(403).json({ message: 'Token inválido o expirado' });
    //     req.user = user;
    //     next();
    // });

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.log('Token inválido:', err.message);
            return res.sendStatus(403);
        }
        req.user = user;
        // console.log('Token válido:', user);
        // console.log('Token válido:', req.user); 
        next();
    });
};

// Ruta de Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE username = ?', 
            [username]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.user_id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' }
        );

        res.json({ 
            token, 
            user: { 
                id: user.user_id, 
                username: user.username 
            } 
        });
        // console.log('Token generado:', token);
        // console.log('Usuario autenticado:', users[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Ruta de Registro
app.post('/api/register', async (req, res) => {
    const {  fullName, username, email, birthDate, sexo, password } = req.body;

    try {
        // Hash de contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insertar usuario
        await pool.execute(
            `INSERT INTO users (full_name, username, email, password, birth_date, body_weight, height, imc, imc_categoria, sex, date_create) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [ fullName, username, email, hashedPassword, birthDate, null, null, null, null, sexo, new Date()]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro' });
    }
});

// Ruta protegida de ejemplo
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
    const [usersProfile] = await pool.execute(
    'SELECT * FROM users WHERE user_id = ?',[req.user.id]
    );

        res.json(usersProfile[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener perfil' });
    }
});


// Calculadora
app.put('/api/update-health-metrics', authenticateToken, async (req, res) => {
    const { weight, height, bmi, bmi_status } = req.body;
    const userId = req.user.id; // Obtenido del token de autenticación
  
    try {

    await pool.execute(
        'UPDATE users SET body_weight = ?, height = ?, imc = ?, imc_categoria = ? WHERE user_id = ?', 
        [weight, height, bmi, bmi_status, userId]
    );

      res.json({ 
        message: 'Calculo de IMC exitoso',
        data: { weight, height, bmi, bmi_status }
      });
  
    } catch (error) {
      console.error('Error al actualizar métricas:', error);
      res.status(500).json({ message: 'Error al actualizar métricas de salud' });
    }
  });



// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});