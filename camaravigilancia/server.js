const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let knownFaces = {}; // Guardaremos los nombres aquí

io.on('connection', (socket) => {
    // Retransmitir video y datos
    socket.on('streaming', (data) => {
        socket.broadcast.emit('play-stream', data);
    });

    // Aprender un nuevo nombre desde el móvil
    socket.on('learn-face', (name) => {
        console.log("Nuevo sujeto identificado:", name);
        io.emit('face-learned', name);
    });

    // Disparar alarma (manual o automática)
    socket.on('trigger-alarm', () => {
        io.emit('action-alarm');
    });

    socket.on('disconnect', () => { });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor GrowXpertIT Pro activo`);
});
