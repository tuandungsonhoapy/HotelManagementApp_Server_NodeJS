import express from 'express';
import bodyParser from 'body-parser';
import configViewEngine from './config/viewEngine';
import initApiRoutes from './routes/api';
import connectDB from './config/connectDB';
import configCors from './config/cors';
const morgan = require('morgan'); //Hiện log request
require('dotenv').config();

const app = express();

app.use(morgan('combined'));

//config

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//CORS
configCors(app);

//ViewEngine
configViewEngine(app);

//Routes API
initApiRoutes(app);

connectDB();

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Backed nodejs is running on the port: ' + port);
});
