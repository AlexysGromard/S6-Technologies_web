'use strict';

// import du module Express
let express = require('express');
let app = express();
let globalagent = require('global-agent');

// Définition des variables HTTP_PROXY si elle ne le sont pas
// et que http_proxy l'est
if ( process.env.HTTP_PROXY === undefined && process.env.http_proxy !== undefined)
    process.env.HTTP_PROXY = process.env.http_proxy;
if ( process.env.HTTPS_PROXY === undefined && process.env.http_proxy !== undefined)
    process.env.HTTPS_PROXY = process.env.https_proxy;

// permet aux requêtes fetch de fonctionner même si un proxy est configuré (réseau de l'université)
globalagent.bootstrap({environmentVariableNamespace: ''});

// export de notre application vers le serveur principal
module.exports = app;
