const { Router } = require('express');
const Usuario = require('../models/Usuario');
const { validationResult, check } = require('express-validator');
const { auth, requireAdmin, requireDocenteOrAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = Router();

// Obtener todos los usuarios (Solo Admin)
router.get('/', auth, requireAdmin, async (req, res) => {
	try {
		const usuarios = await Usuario.find().select('-password');
		res.json(usuarios);
	} catch (error) {
		res.status(500).send("Ocurrio un error");
	}
});

// Obtener usuario por ID (Admin y el propio usuario)
router.get('/:usuarioid', auth, async (req, res) => {
	try {
		const { usuarioid } = req.params;
		
		// Solo admin o el propio usuario pueden ver el perfil
		if (req.usuario.role !== 'Admin' && req.usuario.id !== usuarioid) {
			return res.status(403).json({ error: 'Acceso denegado' });
		}
		
		const usuario = await Usuario.findById(usuarioid).select('-password');
		if (!usuario) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		res.json(usuario);
	} catch (error) {
		res.status(500).send("Ocurrio un error");
	}
});

// Crear un nuevo usuario (Solo Admin)
router.post('/', auth, requireAdmin, [
	check('nombre', 'El nombre es obligatorio').not().isEmpty(),
	check('email', 'El email debe ser válido').isEmail(),
	check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
	check('role', 'El rol es obligatorio').isIn(['Admin', 'Docente']),
	check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo'])
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	
	try {
		const { nombre, email, password, role, estado } = req.body;
		
		// Verificar si el email ya existe
		let usuario = await Usuario.findOne({ email });
		if (usuario) {
			return res.status(400).json({ error: 'El email ya está registrado' });
		}
		
		// Crear nuevo usuario
		usuario = new Usuario({
			nombre,
			email,
			password, // Se encriptará automáticamente en el middleware pre-save
			role,
			estado,
			fechaCreacion: new Date(),
			fechaActualizacion: new Date()
		});
		
		await usuario.save();
		
		// Retornar usuario sin password
		const usuarioResponse = await Usuario.findById(usuario._id).select('-password');
		res.status(201).json(usuarioResponse);
	} catch (error) {
		res.status(500).send("Ocurrio un error");
	}
});

// Actualizar usuario (Admin o el propio usuario)
router.put('/:usuarioid', auth, [
	check('nombre', 'El nombre es obligatorio').not().isEmpty(),
	check('email', 'El email debe ser válido').isEmail(),
	check('role', 'El rol es obligatorio').optional().isIn(['Admin', 'Docente']),
	check('estado', 'El estado es obligatorio').optional().isIn(['Activo', 'Inactivo'])
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	
	try {
		const { usuarioid } = req.params;
		const { nombre, email, password, role, estado } = req.body;
		
		// Solo admin o el propio usuario pueden actualizar
		if (req.usuario.role !== 'Admin' && req.usuario.id !== usuarioid) {
			return res.status(403).json({ error: 'Acceso denegado' });
		}
		
		// Solo admin puede cambiar role y estado
		if (req.usuario.role !== 'Admin' && (role || estado)) {
			return res.status(403).json({ error: 'Solo admin puede cambiar rol y estado' });
		}
		
		// Verificar si el usuario existe
		let usuario = await Usuario.findById(usuarioid);
		if (!usuario) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		
		// Verificar si el email ya existe (excepto el usuario actual)
		if (email !== usuario.email) {
			const emailExists = await Usuario.findOne({ email });
			if (emailExists) {
				return res.status(400).json({ error: 'El email ya está registrado' });
			}
		}
		
		// Preparar datos para actualización
		const updateData = {
			nombre,
			email,
			fechaActualizacion: new Date()
		};
		
		// Solo admin puede actualizar role y estado
		if (req.usuario.role === 'Admin') {
			if (role) updateData.role = role;
			if (estado) updateData.estado = estado;
		}
		
		// Si se proporciona nueva contraseña, encriptarla
		if (password) {
			const salt = await bcrypt.genSalt(10);
			updateData.password = await bcrypt.hash(password, salt);
		}
		
		// Actualizar usuario
		const usuarioActualizado = await Usuario.findByIdAndUpdate(
			usuarioid,
			updateData,
			{ new: true, runValidators: true }
		).select('-password');
		
		res.json(usuarioActualizado);
	} catch (error) {
		res.status(500).send("Ocurrio un error");
	}
});

// Eliminar usuario (Solo Admin)
router.delete('/:usuarioid', auth, requireAdmin, async (req, res) => {
	try {
		const { usuarioid } = req.params;
		
		// No permitir que el admin se elimine a sí mismo
		if (req.usuario.id === usuarioid) {
			return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta' });
		}
		
		const usuario = await Usuario.findByIdAndDelete(usuarioid);
		if (!usuario) {
			return res.status(404).json({ error: 'Usuario no encontrado' });
		}
		
		res.json({ mensaje: 'Usuario eliminado correctamente' });
	} catch (error) {
		res.status(500).send("Ocurrio un error");
	}
});

module.exports = router;