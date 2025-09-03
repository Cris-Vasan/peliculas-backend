const { Schema, model } = require('mongoose');

const MediaSchema = new Schema({
	serial: { type: String, required: true, unique: true, trim: true },
	titulo: { type: String, required: true, trim: true },
	sinopsis: { type: String, default: '' },
	url: { type: String, required: true, unique: true, trim: true },
	imagen: { type: String, required: true },
	fechaEstreno: { type: Date, required: true },
	genero: { type: Schema.Types.ObjectId, ref: 'Genero', required: true },
	director: { type: Schema.Types.ObjectId, ref: 'Director', required: true },
	productora: { type: Schema.Types.ObjectId, ref: 'Productora', required: true },
	tipo: { type: Schema.Types.ObjectId, ref: 'Tipo', required: true }
}, {
	timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }
});

module.exports = model('Media', MediaSchema);
