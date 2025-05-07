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
            // Update the select element with the genres
            let selectGenre = document.getElementById('select-genre');
            if (!selectGenre) {
                console.error('Select element not found');
                return;
            }

            data.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                selectGenre.appendChild(option);
            });
            // Add event listener for genre change
            selectGenre.addEventListener('change', (event) => {
                console.log('Selected genre:', event.target.value);
            });
        })
        .catch(error => {
            console.error(error.message);
        });
}


loadGenre()

console.log('JS file successfully loaded');