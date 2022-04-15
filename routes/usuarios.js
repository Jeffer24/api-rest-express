const express = require('express');
const ruta = express.Router();
const Joi = require('joi');

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

ruta.get('/', (req, res) => {
    res.send(usuarios);
    //res.send(req.query);
});

ruta.get('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }
    res.send(usuario);
});

//ruta.post();   // envio datos
ruta.post('/', (req, res) => {

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

//ruta.put();    // actualizacion
ruta.put('/:id', (req, res) => {

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

//ruta.delete(); // eliminacion
ruta.delete('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);
    res.send(usuario)
})

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

module.exports = ruta;