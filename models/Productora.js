const { Schema, model } = require('mongoose');

const ProductoraSchema = new Schema({
	nombre: { type: String, required: true, unique: true, trim: true },
	estado: { type: String, enum: ['Activo', 'Inactivo'], default: 'Activo' },
	slogan: { type: String, required: true },
	descripcion: { type: String, required: true }
}, {
	timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

module.exports = model('Productora', ProductoraSchema);
