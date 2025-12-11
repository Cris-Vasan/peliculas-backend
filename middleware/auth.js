const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Middleware para verificar JWT
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token, acceso denegado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id).select('-password');
    
    if (!usuario) {
      return res.status(401).json({ error: 'Token no válido' });
    }

    if (usuario.estado !== 'Activo') {
      return res.status(401).json({ error: 'Usuario inactivo' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token no válido' });
  }
};

// Middleware para verificar rol de Admin
const requireAdmin = (req, res, next) => {
  if (req.usuario.role !== 'Admin') {
    return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de Admin' });
  }
  next();
};

// Middleware para verificar rol de Admin o Docente
const requireDocenteOrAdmin = (req, res, next) => {
  if (!['Admin', 'Docente'].includes(req.usuario.role)) {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};

module.exports = {
  auth,
  requireAdmin,
  requireDocenteOrAdmin
};