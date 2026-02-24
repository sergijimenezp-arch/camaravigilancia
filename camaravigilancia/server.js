const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// 1. Configurar la carpeta pública (donde está tu index.html)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Plan B por si la ruta falla en Render
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// 2. Variables del sistema
let connectedUsers = 0;

// 3. Lógica de comunicación en tiempo real (Socket.io)
io.on('connection', (socket) => {
    // Aumentar contador de usuarios
    connectedUsers++;
    io.emit('user-count', connectedUsers);
    console.log(`[GrowXpertIT] Dispositivo conectado. Total: ${connectedUsers}`);

    // A. REEMISIÓN DE VIDEO E INTELIGENCIA ARTIFICIAL
    // Recibe el frame del PC (imagen + caras + ropa) y lo envía al móvil
    socket.on('streaming', (data) => {
        socket.broadcast.emit('play-stream', data);
    });

    // B. MEMORIA BIOMÉTRICA
    // El móvil envía el nombre de un sujeto nuevo, el servidor le dice al PC que lo aprenda
    socket.on('learn-subject', (name) => {
        console.log(`[GrowXpertIT] Orden de aprendizaje biométrico recibida: ${name}`);
        io.emit('register-subject', name);
    });

    // C. SISTEMA DE ALARMA GLOBAL
    // El móvil (o el temporizador) dispara la alarma, el servidor hace sonar todos los equipos
    socket.on('trigger-alarm', () => {
        console.log("[GrowXpertIT] ⚠️ ALARMA INTRUSO ACTIVADA ⚠️");
        io.emit('action-alarm');
    });

    // D. DESCONEXIÓN
    socket.on('disconnect', () => {
        connectedUsers--;
        io.emit('user-count', connectedUsers);
        console.log(`[GrowXpertIT] Dispositivo desconectado. Total: ${connectedUsers}`);
    });
});

// 4. Iniciar el servidor en el puerto que asigne Render
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor Central GrowXpertIT activo en el puerto ${PORT}`);
});
