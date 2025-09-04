const { Router } = require('express');
const Genero = require('../models/Genero');
const { validationResult, check } = require('express-validator');

const router = Router();

// Obtener todos los géneros
router.get('/', async (req, res) => {
	try {
		const generos = await Genero.find();
		res.json(generos);
	} catch (error) {
		res.status(500).send("Ocurrio un error");
	}
});

// Registrar un nuevo género
router.post('/', [
	check('nombre', 'El nombre es obligatorio').not().isEmpty(),
	check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']),
	check('descripcion', 'La descripcion es obligatoria').not().isEmpty()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		let genero = new Genero();
		genero.nombre = req.body.nombre;
		genero.estado = req.body.estado;
		genero.descripcion = req.body.descripcion;
		genero.fechaCreacion = new Date();
		genero.fechaActualizacion = new Date();
		await genero.save();
		res.status(201).json(genero);
	} catch (error) {
		res.status(400).send("Ocurrio un error");
	}
});

// Editar un género existente
router.put('/:generoid', [
	check('nombre', 'El nombre es obligatorio').not().isEmpty(),
	check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo'])
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const { id } = req.params;
		// Obtener el género actual
		const generoActual = await Genero.findById(id);
		if (!generoActual) {
			return res.status(404).json({ error: 'Género no encontrado' });
		}
		// Si no se envía descripción, conservar la anterior
		const nuevaDescripcion = req.body.descripcion !== undefined ? req.body.descripcion : generoActual.descripcion;
		const genero = await Genero.findByIdAndUpdate(
			id,
			{
				nombre: req.body.nombre,
				estado: req.body.estado,
				descripcion: nuevaDescripcion,
				fechaActualizacion: new Date()
			},
			{ new: true, runValidators: true }
		);
		if (!genero) {
			return res.status(404).json({ error: 'Género no encontrado' });
		}
		res.json(genero);
	} catch (error) {
		res.status(400).send("Ocurrio un error");
	}
});

module.exports = router;
