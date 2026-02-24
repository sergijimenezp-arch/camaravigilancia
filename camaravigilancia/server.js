const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    // Cuando alguien empieza a transmitir
    socket.on('streaming', (image) => {
        socket.broadcast.emit('play-stream', image);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Servidor de GrowXpertIT corriendo en http://localhost:${PORT}`);
});