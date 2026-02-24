const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

let connectedUsers = 0;

io.on('connection', (socket) => {
    connectedUsers++;
    // Informar a todos cuánta gente hay conectada
    io.emit('user-count', connectedUsers);

    socket.on('streaming', (image) => {
        socket.broadcast.emit('play-stream', image);
    });

    // Lógica de la alarma
    socket.on('trigger-alarm', () => {
        console.log("¡ALARMA ACTIVADA DESDE REMOTO!");
        socket.broadcast.emit('action-alarm');
    });

    socket.on('disconnect', () => {
        connectedUsers--;
        io.emit('user-count', connectedUsers);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`GrowXpertIT Security Pro en puerto ${PORT}`);
});
