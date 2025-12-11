const { Router } = require('express');
const Director = require('../models/Director');
const { validationResult, check } = require('express-validator');
const { auth, requireAdmin, requireDocenteOrAdmin } = require('../middleware/auth');

const router = Router();

// Obtener todos los directores (Admin y Docente)
router.get('/', auth, requireDocenteOrAdmin, async (req, res) => {
    try {
        const directores = await Director.find();
        res.json(directores);
    } catch (error) {
        res.status(500).send( "Ocurrio un error" );
    }
});

// Registrar un nuevo director (solo Admin)
router.post('/', [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']),
    auth,
    requireAdmin
], 
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

        let director = new Director();
        director.nombres = req.body.nombres;
        director.estado = req.body.estado;
        director.fechaCreacion = new Date();
        director.fechaActualizacion = new Date();

        await director.save();
        res.status(201).json(director);

    } catch (error) {
        res.status(400).send("Ocurrio un error");
    }
});

// Editar un director existente (solo Admin)
router.put('/:directorId', [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('estado', 'El estado es obligatorio').isIn(['Activo', 'Inactivo']),
    auth,
    requireAdmin
], 
async (req, res) => {
    try {
        let director = await Director.findById(req.params.directorId);
        if (!director) {
            return res.status(404).json({ msg: 'Director no encontrado' });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        director.nombres = req.body.nombres;
        director.estado = req.body.estado;
        director.fechaActualizacion = new Date();

        await director.save();

        res.json(director);
        
    } catch (error) {
        res.status(400).send("Ocurrio un error");
    }
});

module.exports = router;
