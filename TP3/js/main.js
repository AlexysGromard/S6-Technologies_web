'use strict';
/* eslint-env browser, es6 */

// Pas besoin d'évenement window.onload puisqu'on utilise l'attribut defer
// lorsque l'on charge notre script

async function loadGenre() {
    const genreUrl = 'http://localhost:3000/genres';
    try {
        const response = await fetch(genreUrl);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();

        // Convert JSON to dictionary with id name and description
        const genreDict = {};
        data.forEach(genre => {
            genreDict[genre.id] = {
                name: genre.name,
                description: genre.description
            };
        });

        // Update the select element with the genres
        let selectGenre = document.getElementById('select-genre');
        if (!selectGenre) {
            console.error('Select element not found');
            return;
        }

        // Add options to the select element
        selectGenre.innerHTML = '<option value="" disabled selected>Select a genre</option>';
        for (const [id, genre] of Object.entries(genreDict)) {
            const option = document.createElement('option');
            option.value = id;
            option.textContent = genre.name;
            selectGenre.appendChild(option);
        }

        // Add event listener for genre change
        selectGenre.addEventListener('change', (event) => {
            data.forEach(genre => {
                if (genre.id === event.target.value) {
                    loadArtists(genre);
                }
            });
        });
    } catch (error) {
        console.error(error.message);
    }
}

async function loadArtists(genre) {
    // Modify section title
    const sectionTitle = document.querySelector('#main h2');
    if (!sectionTitle) {
        console.error('Section title not found');
        return;
    }
    sectionTitle.textContent = `Top ${genre.name} artists`;

    // Modify section description
    const sectionDescription = document.querySelector('#genre-desc');
    if (!sectionDescription) {
        console.error('Section description not found');
        return;
    }
    sectionDescription.textContent = genre.description;

    const artistUrl = `http://localhost:3000/genres/${genre.id}/artists`;
    try {
        const response = await fetch(artistUrl);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.json();

        // Convert JSON to dictionary with id genreId name and photo
        const artistDict = {};
        data.forEach(artist => {
            artistDict[artist.id] = {
                genreId: artist.genreId,
                name: artist.name,
                photo: artist.photo,
            };
        });

        // Update genre top album
        let genreTopAlbums = document.querySelector('#genre-top-albums');
        if (!genreTopAlbums) {
            console.error('Genre top album not found');
            return;
        }
        genreTopAlbums.innerHTML = '';

        for (const [id, artist] of Object.entries(artistDict)) {
            const div = document.createElement('div');
            div.className = 'artist';
            div.innerHTML = `
                <a href="#"><h3>${artist.name}</h3></a>
                <img src="${artist.photo}" alt="${artist.name}">
            `;
            genreTopAlbums.appendChild(div);
        }

    } catch (error) {
        console.error(error.message);
    }
}

loadGenre()

console.log('JS file successfully loaded');