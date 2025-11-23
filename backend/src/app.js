// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { Server } = require("socket.io");
const connectDB = require('./config/db');
const setupPassport = require('./config/oauth');

const passport = setupPassport();
const authRoutes = require('./routes/auth.routes');
const http = require("http");


const app = express();

// Middlewares globales
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
const server = http.createServer(app);
// Rutas principales
app.use('/auth', authRoutes);

// Estado del servidor
app.get('/health', (_, res) => res.json({ ok: true }));

// Conectamos base de datos
connectDB();



module.exports = app;

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });

    socket.on("disconnect", () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

server.listen(process.env.PORT, () => {
    console.log('SERVER RUNNING');
});
