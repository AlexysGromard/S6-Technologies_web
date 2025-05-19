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

// devrait etre mis dans un dao pour bien faire avec des dataclass et le dao pour faire les requete pour separer ou selectionne les donnees et un controleur pour les recuperer
const value = require('./data/db.json');



app.route('/genres')
    .get((req, res) => {
        fetch('http://ws.audioscrobbler.com/2.0/?method=tag.getTopTags&api_key=2c08f218f45c6f367a0f4d2b350bbffc&format=json')
            .then(response => response.json())
            .then(data => {
                const tags = data.toptags.tag.slice(0, 10); // Limiter à 10 genres

                // Créer un tableau de Promises pour les sous-requêtes
                const promises = tags.map(genre => {
                    return fetch(`http://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag=${encodeURIComponent(genre.name)}&api_key=2c08f218f45c6f367a0f4d2b350bbffc&format=json`)
                        .then(response => response.json())
                        .then(infoData => {
                            return {
                                name: genre.name,
                                count: genre.count,
                                reach: genre.reach,
                                description: infoData.tag.wiki.summary || null,
                            };
                        });
                });

                // Attendre toutes les sous-requêtes
                Promise.all(promises)
                    .then(results => {
                        res.status(200).json(results).end();
                    })
                    .catch(error => {
                        console.error('Erreur lors des sous-requêtes :', error);
                        res.status(500).json({message: 'Erreur lors des sous-requêtes'}).end();
                    });
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des genres :', error);
                res.status(500).json({message: 'Erreur lors de la récupération des genres'}).end();
            });
    });



app.route('/genre/:id/artists')
    .get((req, res) => {
        const id = req.params.id;
        const artists = value.artists.filter(artist => artist.genreId === id);

        if (artists.length === 0) {
            res.status(404)
                .json({message: 'Aucun artiste trouvé pour ce genre'})
                .end();
            return res;
        }
        res.status(200)
            .json(artists[0])
            .end();
        return res;
    });



app.route('/artist/:id/album')
    .get((req, res) => {
        const id = req.params.id;
        const albums = value.albums.filter(album => album.artistId === id);

        if (albums.length === 0) {
            res.status(404)
                .json({message: 'Aucun album trouvé pour cet artiste'})
                .end();
            return res;
        }
        res.status(200)
            .json(albums[0])
            .end();
        return res;
    });

// export de notre application vers le serveur principal
module.exports = app;



