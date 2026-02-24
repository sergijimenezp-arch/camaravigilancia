const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, { maxHttpBufferSize: 1e7 }); // Soporte HD
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

    socket.on('streaming', (data) => {
        socket.broadcast.emit('play-stream', data);
    });

    socket.on('learn-subject', (name) => {
        console.log(`[GrowXpertIT] Sujeto autorizado: ${name}`);
        io.emit('register-subject', name);
    });

    socket.on('trigger-alarm', () => {
        console.log("[GrowXpertIT] ⚠️ ALARMA ACTIVADA DESDE INTERFAZ");
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
