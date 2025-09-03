const {router} = require('express');
const Director = require('../models/Director');
const {validationresult, check } = require('express-validator');

const router = router();

// Registrar un nuevo director 
router.post('/', [
    check('nombres', 'El nombre es obligatorio').not().isEmpty(),
    check('estado', 'El estado es obligatorio y debe ser Activo o Inactivo').isIn(['Activo', 'Inactivo']),

], async (req, res) => {
    const errors = validationresult(req);
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
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});

module.exports = router;