'use strict';
/**
 * @doc
 * @link https://developer.mozilla.org/fr/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/Introduction
 */


const express = require('express');
const app = express();



// chargement de notre API REST
const api = require('./api/api');
let server;

// declaration de l'url de base de l'API
app.use('/api', api);

// Le contenu statique sera lu à partir du repertoire 'public'
app.use('/', express.static('public'));

// Lancement du serveur web
server = app.listen(8080, function () {
    const port = server.address().port;
    console.log('Lanceement de l app sur http://127.0.0.1:%s', port);
});