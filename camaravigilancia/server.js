const express = require('express');
const app = express();
const http = require('http').Server(app);
// Aumentamos el límite a 10MB para que el vídeo en Alta Calidad no se corte
const io = require('socket.io')(http, { maxHttpBufferSize: 1e7 }); 
const path = require('path');

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

let connectedUsers = 0;

io.on('connection', (socket) => {
    connectedUsers++;
    io.emit('user-count', connectedUsers);
    console.log(`[GrowXpertIT] Visores online: ${connectedUsers}`);

    // Reenviar vídeo HD e Inteligencia Artificial
    socket.on('streaming', (data) => {
        socket.broadcast.emit('play-stream', data);
    });

    // Memoria Biométrica
    socket.on('learn-subject', (name) => {
        console.log(`[GrowXpertIT] Sujeto autorizado: ${name}`);
        io.emit('register-subject', name);
    });

    // Alarma Global
    socket.on('trigger-alarm', () => {
        console.log("[GrowXpertIT] ⚠️ ALARMA ACTIVADA");
        io.emit('action-alarm');
    });

    socket.on('disconnect', () => {
        connectedUsers--;
        if(connectedUsers < 0) connectedUsers = 0; 
        io.emit('user-count', connectedUsers);
        console.log(`[GrowXpertIT] Visor desconectado. Restantes: ${connectedUsers}`);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor GrowXpertIT HD Activo en puerto ${PORT}`);
});
