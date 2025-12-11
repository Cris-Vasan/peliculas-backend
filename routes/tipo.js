const { Router } = require('express');
const Tipo = require('../models/Tipo');
const { validationResult, check } = require('express-validator');
const { auth, requireAdmin, requireDocenteOrAdmin } = require('../middleware/auth');

const router = Router();

// Obtener todos los tipos (Admin y Docente)
router.get('/', auth, requireDocenteOrAdmin, async (req, res) => {
	try {
		const tipos = await Tipo.find();
		res.json(tipos);
	} catch (error) {
		res.status(500).send("Ocurrio un error");
	}
});

// Registrar un nuevo tipo (Solo Admin)
router.post('/', auth, requireAdmin, [
	check('nombre', 'El nombre es obligatorio').not().isEmpty(),
	check('descripcion', 'La descripcion es obligatoria').not().isEmpty()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		let tipo = new Tipo();
		tipo.nombre = req.body.nombre;
		tipo.descripcion = req.body.descripcion;
		tipo.fechaCreacion = new Date();
		tipo.fechaActualizacion = new Date();
		await tipo.save();
		res.status(201).json(tipo);
	} catch (error) {
		res.status(400).send("Ocurrio un error");
	}
});

// Editar un tipo existente (Solo Admin)
router.put('/:tipoid', auth, requireAdmin, [
	check('nombre', 'El nombre es obligatorio').not().isEmpty()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const { tipoid } = req.params;
		// Obtener el tipo actual
		const tipoActual = await Tipo.findById(tipoid);
		if (!tipoActual) {
			return res.status(404).json({ error: 'Tipo no encontrado' });
		}
		// Si no se envía descripcion, conservar la anterior
		const nuevaDescripcion = req.body.descripcion !== undefined ? req.body.descripcion : tipoActual.descripcion;
		const tipo = await Tipo.findByIdAndUpdate(
			tipoid,
			{
				nombre: req.body.nombre,
				descripcion: nuevaDescripcion,
				fechaActualizacion: new Date()
			},
			{ new: true, runValidators: true }
		);
		if (!tipo) {
			return res.status(404).json({ error: 'Tipo no encontrado' });
		}
		res.json(tipo);
	} catch (error) {
		res.status(400).send("Ocurrio un error");
	}
});

module.exports = router;
