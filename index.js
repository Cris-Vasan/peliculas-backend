const express = require('express')
const { getConection } = require('./db/connect-mongo-ds');6
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());

getConection();


app.use('/api/directores', require('./routes/Director'));
app.use('/api/generos', require('./routes/Genero'));
app.use('/api/tipos', require('./routes/Tipo'));
app.use('/api/productoras', require('./routes/Productora'));
app.use('/api/medias', require('./routes/Media'));




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
