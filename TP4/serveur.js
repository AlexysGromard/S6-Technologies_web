'use strict';

const express = require('express');
const app = express();
// chargement de notre API REST
const api = require('./api/api');
let server;

// et on déclare qu'elle va s'applique sur le path '/api'
app.use('/api', api);

// Le contenu statique sera lu à partir du repertoire 'public'
// A déclarer à la fin pour qu'on aille chercher dans 'public' seulement si aucune auter règle n'est applicable
app.use('/', express.static('public'));

// Lancement du serveur web
server = app.listen(8080, function () {
    const port = server.address().port;
    console.log('My app is listening at http://127.0.0.1:%s', port);
});
