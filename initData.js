const mongoose = require('mongoose');
const Genero = require('./models/Genero');
const Director = require('./models/Director');
const Productora = require('./models/Productora');
const Tipo = require('./models/Tipo');
const { getConection } = require('./db/connect-mongo-ds');

const generos = [
  { nombre: 'Acción', estado: 'Activo', descripcion: 'Películas de acción' },
  { nombre: 'Aventura', estado: 'Activo', descripcion: 'Películas de aventura' },
  { nombre: 'Ciencia ficción', estado: 'Activo', descripcion: 'Películas de ciencia ficción' },
  { nombre: 'Drama', estado: 'Activo', descripcion: 'Películas de drama' },
  { nombre: 'Terror', estado: 'Activo', descripcion: 'Películas de terror' }
];

const directores = [
  { nombres: 'Sin director', estado: 'Activo' }
];

const productoras = [
  { nombre: 'Disney', estado: 'Activo', slogan: 'El lugar más feliz del mundo', descripcion: 'Productora de películas familiares' },
  { nombre: 'Warner', estado: 'Activo', slogan: 'Historias que trascienden', descripcion: 'Productora de películas y series' },
  { nombre: 'Paramount', estado: 'Activo', slogan: 'Entretenimiento sin límites', descripcion: 'Productora de cine y televisión' },
  { nombre: 'MGM', estado: 'Activo', slogan: 'Más allá del león', descripcion: 'Productora clásica de Hollywood' }
];

const tipos = [
  { nombre: 'Serie', descripcion: 'Producción de varios episodios' },
  { nombre: 'Película', descripcion: 'Producción cinematográfica' }
];

async function initData() {
  try {
    await getConection();
    await Genero.insertMany(generos);
    await Director.insertMany(directores);
    await Productora.insertMany(productoras);
    await Tipo.insertMany(tipos);
    console.log('Datos iniciales agregados correctamente');
  } catch (err) {
    console.error('Error al agregar datos iniciales:', err);
  } finally {
    mongoose.disconnect();
  }
}

initData();
