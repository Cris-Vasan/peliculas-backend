const express = require('express')
const { getConection } = require('./db/connect-mongo-ds');
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 4000;

// Configuración CORS para producción
const allowedOrigins = process.env.FRONTEND_URL 
    ? [process.env.FRONTEND_URL, 'http://localhost:3000']
    : ['https://cineiudcol.netlify.app', 'http://localhost:3000']; 

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

getConection();

app.use('/api/directores', require('./routes/director'));
app.use('/api/generos', require('./routes/genero'));
app.use('/api/tipos', require('./routes/tipo'));
app.use('/api/productoras', require('./routes/productora'));
app.use('/api/medias', require('./routes/media'));




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
