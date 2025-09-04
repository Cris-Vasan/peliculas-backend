const { Router } = require('express');
const Productora = require('../models/Productora');
const { validationResult, check } = require('express-validator');

const router = Router();

// Obtener todas las productoras
router.get('/', async (req, res) => {
	try {
		const productoras = await Productora.find();
		res.json(productoras);
	} catch (error) {
		res.status(500).send("Ocurrio un error");
	}
});

// Registrar una nueva productora
router.post('/', [
	check('nombre', 'El nombre es obligatorio').not().isEmpty(),
	check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']),
	check('slogan', 'El slogan es obligatorio').not().isEmpty(),
	check('descripcion', 'La descripcion es obligatoria').not().isEmpty()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		let productora = new Productora();
		productora.nombre = req.body.nombre;
		productora.estado = req.body.estado;
		productora.slogan = req.body.slogan;
		productora.descripcion = req.body.descripcion;
		productora.fechaCreacion = new Date();
		productora.fechaActualizacion = new Date();
		await productora.save();
		res.status(201).json(productora);
	} catch (error) {
		res.status(400).send("Ocurrio un error");
	}
});

// Editar una productora existente
router.put('/:productoraid', [
	check('nombre', 'El nombre es obligatorio').not().isEmpty(),
	check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo'])
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	try {
		const { id } = req.params;
		// Obtener la productora actual
		const productoraActual = await Productora.findById(id);
		if (!productoraActual) {
			return res.status(404).json({ error: 'Productora no encontrada' });
		}
		// Si no se envía slogan o descripcion, conservar los anteriores
		const nuevoSlogan = req.body.slogan !== undefined ? req.body.slogan : productoraActual.slogan;
		const nuevaDescripcion = req.body.descripcion !== undefined ? req.body.descripcion : productoraActual.descripcion;
		const productora = await Productora.findByIdAndUpdate(
			id,
			{
				nombre: req.body.nombre,
				estado: req.body.estado,
				slogan: nuevoSlogan,
				descripcion: nuevaDescripcion,
				fechaActualizacion: new Date()
			},
			{ new: true, runValidators: true }
		);
		if (!productora) {
			return res.status(404).json({ error: 'Productora no encontrada' });
		}
		res.json(productora);
	} catch (error) {
		res.status(400).send("Ocurrio un error");
	}
});

module.exports = router;
