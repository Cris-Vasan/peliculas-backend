const { Schema, model } = require('mongoose');

const TipoSchema = new Schema({
	nombre: { type: String, required: true, unique: true, trim: true },
	descripcion: { type: String, required: true }
}, {
	timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

module.exports = model('Tipo', TipoSchema);
