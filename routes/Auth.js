const { Router } = require('express');
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const { validationResult, check } = require('express-validator');
const { auth, requireAdmin } = require('../middleware/auth');

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Registrar usuario (solo Admin puede crear usuarios)
router.post('/register', [
  check('email', 'Email válido es requerido').isEmail(),
  check('password', 'Password debe tener al menos 6 caracteres').isLength({ min: 6 }),
  check('role', 'Rol debe ser Admin o Docente').isIn(['Admin', 'Docente']),
  auth,
  requireAdmin
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Crear nuevo usuario
    const usuario = new Usuario({
      email,
      password,
      role
    });

    await usuario.save();

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario: {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role,
        estado: usuario.estado
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login
router.post('/login', [
  check('email', 'Email válido es requerido').isEmail(),
  check('password', 'Password es requerido').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Verificar estado
    if (usuario.estado !== 'Activo') {
      return res.status(400).json({ error: 'Usuario inactivo' });
    }

    // Verificar contraseña
    const isMatch = await usuario.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas' });
    }

    // Crear JWT
    const token = jwt.sign(
      { id: usuario._id, role: usuario.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      usuario: {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener perfil del usuario autenticado
router.get('/profile', auth, (req, res) => {
  res.json({
    usuario: {
      id: req.usuario._id,
      email: req.usuario.email,
      role: req.usuario.role,
      estado: req.usuario.estado
    }
  });
});

// Listar todos los usuarios (solo Admin)
router.get('/usuarios', auth, requireAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar usuario (solo Admin)
router.put('/usuarios/:id', [
  check('email', 'Email válido es requerido').optional().isEmail(),
  check('role', 'Rol debe ser Admin o Docente').optional().isIn(['Admin', 'Docente']),
  check('estado', 'Estado debe ser Activo o Inactivo').optional().isIn(['Activo', 'Inactivo']),
  auth,
  requireAdmin
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { email, role, estado, password } = req.body;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Actualizar campos
    if (email !== undefined) usuario.email = email;
    if (role !== undefined) usuario.role = role;
    if (estado !== undefined) usuario.estado = estado;
    if (password !== undefined) usuario.password = password;

    await usuario.save();

    res.json({
      message: 'Usuario actualizado exitosamente',
      usuario: {
        id: usuario._id,
        email: usuario.email,
        role: usuario.role,
        estado: usuario.estado
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;