const validarMedia = (req) => {
    const validaciones = [];
    if (!req.body.serial) {
        validaciones.push("El serial es obligatorio");
    }
    if (!req.body.titulo) {
        validaciones.push("El título es obligatorio");
    }
    if (!req.body.sinopsis) {
        validaciones.push("La sinopsis es obligatoria");
    }
    if (!req.body.url) {
        validaciones.push("La URL es obligatoria");
    }
    if (!req.body.imagen) {
        validaciones.push("La imagen es obligatoria");
    }
    if (!req.body.fechaEstreno) {
        validaciones.push("La fecha de estreno es obligatoria");
    }
    if (!req.body.genero_id) {
        validaciones.push("El género es obligatorio");
    }
    if (!req.body.director_id) {
        validaciones.push("El director es obligatorio");
    }
    if (!req.body.productora_id) {
        validaciones.push("La productora es obligatoria");
    }
    if (!req.body.tipo_id) {
        validaciones.push("El tipo es obligatorio");
    }
    return validaciones;
};

module.exports = { validarMedia };
