import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initApiRoutes from './routes/api';
import connectDB from './config/connectDB';
const cors = require('cors');

require('dotenv').config();

let app = express();

app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Hoặc thay '*' bằng origin cụ thể nếu bạn biết
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//config

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initApiRoutes(app);

connectDB();

let port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log('Backed nodejs is running on the port: ' + port);
});
