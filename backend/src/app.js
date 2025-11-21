// src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');
const setupPassport = require('./config/oauth');

const passport = setupPassport();
const authRoutes = require('./routes/auth.routes');

const app = express();

// Middlewares globales
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

// Rutas principales
app.use('/auth', authRoutes);

// Estado del servidor
app.get('/health', (_, res) => res.json({ ok: true }));

// Conectamos base de datos
connectDB();

module.exports = app;
