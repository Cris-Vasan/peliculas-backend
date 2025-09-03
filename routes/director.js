const express = require('express');
const router = express.Router();
const Director = require('../models/Director');

// Registrar un nuevo director
router.post('/', async (req, res) => {
	try {
		const { nombres, estado } = req.body;
		const director = new Director({ nombres, estado });
		await director.save();
		res.status(201).json(director);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

// Editar un director existente
router.put('/:id', async (req, res) => {
	try {
		const { id } = req.params;
		const { nombres, estado } = req.body;
		const director = await Director.findByIdAndUpdate(
			id,
			{ nombres, estado },
			{ new: true, runValidators: true }
		);
		if (!director) {
			return res.status(404).json({ error: 'Director no encontrado' });
		}
		res.json(director);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
});

module.exports = router;
