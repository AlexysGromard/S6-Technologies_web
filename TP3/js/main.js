'use strict';
/* eslint-env browser, es6 */

// Pas besoin d'évenement window.onload puisqu'on utilise l'attribut defer
// lorsque l'on charge notre script

function loadGenre() {
    const genreUrl = 'http://localhost:3000/genres';

    fetch(genreUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data :', data);
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des genres :', error.message);
        });
}

loadGenre()

console.log('JS file successfully loaded');