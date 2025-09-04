const { Router } = require('express');
const Media = require('../models/Media');
const { validationResult, check } = require('express-validator');
const { validarMedia } = require('../Helpers/validar-media');

const router = Router();

// Obtener todas las producciones
router.get('/', async (req, res) => {
	try {
        const medias = await Media.find()
            .populate({ path: 'genero', select: 'nombre estado descripcion' })
            .populate({ path: 'director', select: 'nombres estado' })
            .populate({ path: 'productora', select: 'nombre estado slogan descripcion' })
            .populate({ path: 'tipo', select: 'nombre estado descripcion' });
        res.send(medias);
	} catch (error) {
        console.log(error);
		res.status(500).send("Ocurrio un error al consultar las producciones");
	}
});

// Registrar una nueva producción
router.post('/', async function (req, res) {
    try {
    const validaciones = validarMedia(req);

    if (validaciones.length > 0) {
        return res.status(400).send(validaciones);
    }

    const existeMediaPorSerial = await Media.findOne({ serial: req.body.serial });

    if (existeMediaPorSerial) {
        return res.status(400).send(`Ya existe una producción con el serial ${req.body.serial}`);
    }
    
    let media = new Media();
    media.serial = req.body.serial;
    media.titulo = req.body.titulo;
    media.sinopsis = req.body.sinopsis;
    media.url = req.body.url;
    media.imagen = req.body.imagen;
    media.fechaEstreno = req.body.fechaEstreno;
    media.genero = req.body.genero_id;
    media.director = req.body.director_id;
    media.productora = req.body.productora_id;
    media.tipo = req.body.tipo_id;
    media.fechaCreacion = new Date();
    media.fechaActualizacion = new Date();
        
    media = await media.save();

	res.send(media);

	} catch (error) {
		console.log(error);
		res.status(500).send("Ocurrio un error al crear la producción");
	}
});

// Editar una producción existente
router.put('/:mediaid', async function (req, res) {
    try {
        let inventario = await Media.findById(req.params.mediaid);
        if (!inventario) {
            return res.status(404).json({ msg: 'Producción no encontrada' });
        }

        const existeMediaPorSerial = await Media.findOne({ serial: req.body.serial, _id: { $ne: req.params.mediaid } });

        if (existeMediaPorSerial) {
            return res.status(400).send(`Ya existe una producción con el serial ${req.body.serial}`);
        }

        const validaciones = validarMedia(req);

        if (validaciones.length > 0) {
            return res.status(400).send(validaciones);
        }

        inventario.serial = req.body.serial;
        inventario.titulo = req.body.titulo;
        inventario.sinopsis = req.body.sinopsis;
        inventario.url = req.body.url;
        inventario.imagen = req.body.imagen;
        inventario.fechaEstreno = req.body.fechaEstreno;
        inventario.genero = req.body.genero_id;
        inventario.director = req.body.director_id;
        inventario.productora = req.body.productora_id;
        inventario.tipo = req.body.tipo_id;
        inventario.fechaActualizacion = new Date();

        await inventario.save();

        res.json(inventario);

    } catch (error) {
        console.log(error);
        res.status(500).send("Ocurrio un error al actualizar la producción");
    }
});


module.exports = router;