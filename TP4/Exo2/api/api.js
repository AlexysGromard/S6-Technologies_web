'use strict';
/**
 * @doc ancien projet IUT
 */

// import du module Express
let express = require('express');
let app = express();

// devrait etre mis dans un dao pour bien faire avec des dataclass et le dao pour faire les requete pour separer ou selectionne les donnees et un controleur pour les recuperer
const data = require('./data/db.json');



app.route('/genres')

    .get((req, res) => {
        res.status(200)
            .json(data.genres)
            .end();
        return res;
    });


app.route('/genres/:id/artists')
    .get((req, res) => {
        const id = req.params.id;
        const artists = data.artists.filter(artist => artist.genreId === id);

        if (artists.length === 0) {
            res.status(404)
                .json({ message: 'Aucun artiste trouvé pour ce genre' })
                .end();
            return res;
        }
        res.status(200)
            .json(artists)
            .end();
        return res;
        }
    )



app.route('/artists/:id/albums')
    .get((req, res) => {
        const id = req.params.id;
        const albums = data.albums.filter(album => album.artistId === id);

        if (albums.length === 0) {
            res.status(404)
                .json({ message: 'Aucun album trouvé pour cet artiste' })
                .end();
            return res;
        }
        res.status(200)
            .json(albums)
            .end();
        return res;
        }
    )

// export de notre application vers le serveur principal
module.exports = app;
