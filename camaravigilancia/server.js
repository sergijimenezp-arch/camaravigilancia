const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// 1. Configuración de rutas ABSOLUTAS (esto evita el "Cannot GET /")
const publicPath = path.join(__dirname, 'public');
console.log("Buscando archivos en:", publicPath);

// Servir archivos estáticos
app.use(express.static(publicPath));

// Ruta principal explícita
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// 2. Lógica de Socket.io
io.on('connection', (socket) => {
    console.log('Cliente conectado');
    socket.on('streaming', (image) => {
        socket.broadcast.emit('play-stream', image);
    });
});

// 3. Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor GrowXpertIT funcionando en puerto ${PORT}`);
});
