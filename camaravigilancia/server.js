const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// 1. Configuración de rutas (Para que Render encuentre tu index.html sin errores)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Plan B por si hay problemas de rutas
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// 2. Variables del sistema
let connectedUsers = 0;

// 3. Lógica de comunicación (El "Cerebro" de GrowXpertIT)
io.on('connection', (socket) => {
    // Cuando alguien entra (PC o Móvil), sumamos 1 al contador
    connectedUsers++;
    io.emit('user-count', connectedUsers);
    console.log(`Nuevo dispositivo conectado. Total: ${connectedUsers}`);

    // RECIBIR Y REENVIAR VIDEO + DATOS DE IA
    socket.on('streaming', (data) => {
        // "data" ahora contiene { image: foto_base64, faces: [coordenadas] }
        // Lo reenviamos a todos los dispositivos excepto al que lo está enviando
        socket.broadcast.emit('play-stream', data);
    });

    // SISTEMA DE ALARMA
    socket.on('trigger-alarm', () => {
        console.log("⚠️ ALARMA ACTIVADA ⚠️");
        // Avisamos a todos los dispositivos para que suenen y se pongan en rojo
        io.emit('action-alarm');
    });

    // Cuando alguien cierra la pestaña
    socket.on('disconnect', () => {
        connectedUsers--;
        io.emit('user-count', connectedUsers);
        console.log(`Dispositivo desconectado. Total: ${connectedUsers}`);
    });
});

// 4. Encendido del servidor (Preparado para Render)
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de GrowXpertIT activo y seguro en el puerto ${PORT}`);
});
