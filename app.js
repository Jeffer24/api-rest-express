const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
//const usuarios = require('./usuarios');
const express = require('express');
const app = express();
//const logger = require('./logger');
const morgan = require('morgan');
const config = require('config');
const usuarios = require('./routes/usuarios')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/usuarios', usuarios);

// Configuracion de entornos
console.log('Aplicacion ' + config.get('nombre'));
console.log('BD Server ' + config.get('configDB.host'));

//app.use(logger);

//app.use(function (req, res, next) {
//    console.log('Autenticando');
//    next();
//});

// Uso de midleware de terceros - morgan
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    //console.log('Morgan Habilitado..');
    inicioDebug('Morgan Habilitado!');
}

// Trabajos con database
dbDebug('Conectando con la BD');

app.get('/', (req, res) => {
    res.send('Hola mundo desde Express');
});

// configuracion de inicio
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});


