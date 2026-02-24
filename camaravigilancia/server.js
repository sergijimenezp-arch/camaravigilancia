const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');

// 1. CONFIGURACIÓN DE RUTAS Y ARCHIVOS ESTÁTICOS
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// Ruta de comodín (Fallback para evitar errores "Cannot GET /")
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

// 2. BASE DE DATOS TEMPORAL Y MÉTRICAS
let connectedUsers = 0;

// 3. NÚCLEO DE COMUNICACIONES (SOCKET.IO)
io.on('connection', (socket) => {
    
    // --- NUEVO USUARIO CONECTADO ---
    connectedUsers++;
    io.emit('user-count', connectedUsers);
    console.log(`[GrowXpertIT - SISTEMA ONLINE] Visores actuales: ${connectedUsers}`);

    // --- REPETIDOR DE INTELIGENCIA ARTIFICIAL DUAL ---
    socket.on('streaming', (data) => {
        // El servidor recibe el paquete 'data' que ahora contiene:
        // data.image  -> El fotograma en base64
        // data.faces  -> Coordenadas de las caras y biometría
        // data.bodies -> Coordenadas de los cuerpos (Siluetas)
        
        // Reenviamos todo este paquete al móvil en tiempo real
        socket.broadcast.emit('play-stream', data);
    });

    // --- PUENTE DE MEMORIA BIOMÉTRICA ---
    // Recibe el nombre desde el móvil y se lo inyecta al PC emisor
    socket.on('learn-subject', (name) => {
        console.log(`[GrowXpertIT - BIOMETRÍA] Autorizando nuevo sujeto: ${name}`);
        io.emit('register-subject', name);
    });

    // --- SISTEMA DE ALARMA CRÍTICA ---
    // Puede ser disparado manualmente por el móvil o por el temporizador de 30s
    socket.on('trigger-alarm', () => {
        console.log("[GrowXpertIT - SEGURIDAD] ⚠️ PROTOCOLO DE INTRUSO ACTIVADO ⚠️");
        io.emit('action-alarm');
    });

    // --- DESCONEXIÓN DE USUARIO ---
    socket.on('disconnect', () => {
        connectedUsers--;
        // Evitamos que el contador baje de 0 por errores de red
        if(connectedUsers < 0) connectedUsers = 0; 
        
        io.emit('user-count', connectedUsers);
        console.log(`[GrowXpertIT - SISTEMA] Usuario desconectado. Visores: ${connectedUsers}`);
    });
});

// 4. ARRANQUE DEL SERVIDOR (ADAPTADO A RENDER)
const PORT = process.env.PORT || 3000;
http.listen(PORT, '0.0.0.0', () => {
    console.log(`=================================================`);
    console.log(`🛡️  Servidor GrowXpertIT Dual-AI Activo`);
    console.log(`📡 Escuchando en el puerto: ${PORT}`);
    console.log(`=================================================`);
});
