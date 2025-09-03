const { Schema, model } = require('mongoose');

const DirectorSchema = new Schema({
	nombres: { type: String, required: true, trim: true },
	estado: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' }
}, {
	timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

module.exports = model('Director', DirectorSchema);
