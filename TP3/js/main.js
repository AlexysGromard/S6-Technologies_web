'use strict';
/* eslint-env browser, es6 */

// Pas besoin d'évenement window.onload puisqu'on utilise l'attribut defer
// lorsque l'on charge notre script

/**
 * Load genres from the server and update the user interface.
 * Modifies the select element with the genres and adds an event listener for genre change.
 * @returns {Promise<void>}
 */
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
                description: genre.description,
            };
        });

        // Update the select element with the genres
        const selectGenre = document.getElementById('select-genre');
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
    }
    catch (error) {
        console.error(error.message);
    }
}

/**
 * Load artists for the selected genre and update the user interface.
 * Modifies the section title and description, and updates the genre top albums.
 * @param {Object} genre - The selected genre object.
 */
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
                id: artist.id,
                genreId: artist.genreId,
                name: artist.name,
                photo: artist.photo,
            };
        });

        // Update genre top album
        const genreTopAlbums = document.querySelector('#genre-top-albums');
        if (!genreTopAlbums) {
            console.error('Genre top album not found');
            return;
        }
        genreTopAlbums.innerHTML = '';

        for (const [, artist] of Object.entries(artistDict)) {
            const div = document.createElement('div');
            div.className = 'artist';
            div.innerHTML = `
                <a id="${artist.id}" href="#"><h3>${artist.name}</h3></a>
                <img src="${artist.photo}" alt="${artist.name}">
            `;
            const link = div.querySelector('a');
            link.addEventListener('click', artistSelected);
            genreTopAlbums.appendChild(div);
        }

    }
    catch (error) {
        console.error(error.message);
    }
}

function artistSelected(event) {
    event.preventDefault(); // Prevent default action of the link

    const artistId = event.target.parentElement.id;
    if (!artistId) {
        return;
    }
    const albumURL = `http://localhost:3000/artists/${artistId}/albums`;
    fetch(albumURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erreur HTTP : ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Convert JSON to dictionary with id name and cover
            const albumDict = {};
            data.forEach(album => {
                albumDict[album.id] = {
                    artistId: album.artistId,
                    year: album.year,
                    title: album.title,
                    label: album.label,
                    cover: album.cover,
                };
            });

            // Fill the album table
            const albumTable = document.querySelector('#albums table tbody');
            if (!albumTable) {
                console.error('Album table not found');
                return;
            }
            albumTable.innerHTML = '';
            for (const [, album] of Object.entries(albumDict)) {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img style="height: 50px" src="${album.cover}" alt="${album.title}"></td>
                    <td>${album.title}</td>
                    <td>${album.year}</td>
                    <td>${album.label}</td>
                `;
                albumTable.appendChild(tr);
            }

            // Update the album section style
            const albumSection = document.querySelector('#albums');
            albumSection.style.visibility = 'visible';
            albumSection.style.opacity = '1';

            const {clientWidth: bodyWidth, clientHeight: bodyHeight} = document.body;
            const {clientWidth: popupWidth, clientHeight: popupHeight} = albumSection;

            albumSection.style.top = `${(bodyHeight - popupHeight) / 2}px`;
            albumSection.style.left = `${(bodyWidth - popupWidth) / 2}px`;

            // Modify button event
            const closeButton = document.querySelector('#ok-button');
            closeButton.addEventListener('click', (event) => {
                event.preventDefault();
                albumSection.style.opacity = '0';
                setTimeout(() => {
                    albumSection.style.visibility = 'hidden';
                }, 200);
            });
        })
        .catch(error => {
            console.error(error.message);
        });
}

loadGenre();

console.log('JS file successfully loaded');