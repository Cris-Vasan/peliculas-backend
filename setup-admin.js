const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Usuario = require('./models/Usuario');
const { getConection } = require('./db/connect-mongo-ds');
require('dotenv').config();

async function createAdmin() {
    try {
        // Conectar a la base de datos
        await getConection();
        
        // Verificar si ya existe un admin
        const adminExists = await Usuario.findOne({ email: 'admin@admin.com' });
        if (adminExists) {
            console.log('El usuario admin ya existe');
            process.exit(0);
        }
        
        // Crear usuario administrador
        const admin = new Usuario({
            nombre: 'Administrador',
            email: 'admin@admin.com',
            password: 'admin123', // Se encriptará automáticamente con el middleware pre-save
            role: 'Admin',
            estado: 'Activo'
        });
        
        await admin.save();
        console.log('Usuario administrador creado exitosamente');
        console.log('Email: admin@admin.com');
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error al crear el usuario administrador:', error);
        process.exit(1);
    }
}

createAdmin();