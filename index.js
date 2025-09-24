const express = require('express')
const { getConection } = require('./db/connect-mongo-ds');6
const cors = require('cors');
require('dotenv').config();

const app = express()
const port = process.env.PORT || 4000;

app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000'
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
