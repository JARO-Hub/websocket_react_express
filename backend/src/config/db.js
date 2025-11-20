// src/config/db.js
const mongoose = require('mongoose');

// Función asíncrona que se encargará de realizar la conexión a la base de datos
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI no está definido en .env')
    await mongoose.connect(uri);

    console.log('Conectado a MongoDB');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
