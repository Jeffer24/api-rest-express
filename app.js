const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
//const usuarios = require('./usuarios');
const express = require('express');
const app = express();
const Joi = require('joi');
//const logger = require('./logger');
const morgan = require('morgan');
const config = require('config');


const usuarios = [
    {
        id: 1,
        nombre: 'Jeffer'
    },
    {
        id: 2,
        nombre: 'Juan'
    },
    {
        id: 3,
        nombre: 'Pedro'
    }
]

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

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

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
    //res.send(req.query);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }
    res.send(usuario);
});

//app.post();   // envio datos
app.post('/api/usuarios', (req, res) => {

    const { error, value } = validarUsuario(req.body.nombre);

    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        }
        usuarios.push(usuario);
        res.send(usuarios)
    } else {
        const mensaje = error.details[0].message
        res.status(400).send(mensaje)
    }

})

//app.put();    // actualizacion
app.put('/api/usuarios/:id', (req, res) => {

    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const { error, value } = validarUsuario(req.body.nombre);

    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);
})

//app.delete(); // eliminacion
app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuario)
})

// configuracion de inicio
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
});


// funciones de validacion
function existeUsuario(id) {
    return usuarios.find(u => u.id === parseInt(id));
}

function validarUsuario(nombre) {
    const schema = Joi.object({
        nombre: Joi.string()
            .alphanum()
            .min(3)
            .max(30)
            .required()
    })
    return schema.validate({ nombre: nombre });
}