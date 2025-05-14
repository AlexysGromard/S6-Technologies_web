'use strict';
/**
 * @author Lancelot JOUAULT
 * @author Alexys GROMARD
 * @date 2025-07-05
 * @doc
 * @link https://nodejs.org/api/buffer.html#static-method-bufferbytelengthstring-encoding
 * @link https://node-js.fr/server/
 * @description Serveur web simple - exo 1
 */

// Étape 1: Importer le module HTTP
// Importer le module http
const http = require('http');


// Étape 2: Créer le serveur

const server = http.createServer((req, res) => {
    console.log('Requête reçue:', req.method, req.url);

    if (req.method !== 'GET') {
        res.writeHead(405, {'Content-Type': 'text/plain; charset=utf-8'});
        res.end('Requête HTTP non autorisée');
        return;
    }

    const [path, queryString] = req.url.split('?');

    if (path === '/un/repertoire/index.html') {
        const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Bonjour</title>
</head>
<body>
    <h1>Analyse de votre requête:</h1>
    <p>Vous accédez à l'url: un/repertoire/index.html</p>
    <p>La chaine de requête est: ${queryString || ''}</p>
</body>
</html>`;

        const length = Buffer.byteLength(html, 'utf-8');

        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': length,
        });

        res.end(html);
        return;
    }

    // Autres chemins
    const message = 'Salut, bienvenue sur mon serveur !';
    const length = Buffer.byteLength(message, 'utf-8');

    res.writeHead(200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Length': length,
    });
    res.end(message);
});
// Étape 3: Démarrer le serveur
server.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});


