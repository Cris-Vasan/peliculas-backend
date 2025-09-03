const { Schema, model } = require('mongoose');

const GeneroSchema = new Schema({
	nombre: { type: String,	required: true,	unique: true, trim: true},
	estado: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },
	descripcion: { type: String, required: true}

}, {
	timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

module.exports = model('Genero', GeneroSchema);
