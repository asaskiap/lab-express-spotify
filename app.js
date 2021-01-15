require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
    .catch((error) =>
        console.log('Something went wrong when retrieving an access token', error)
    );

// Our routes go here:

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/search', (req, res) => {
    const id = req.query.q;
    spotifyApi
        .searchArtists(id)
        .then((data) => {
            console.log('The received data from the API: ', data.body);
            for (a of data.body.artists.items) {
                console.log(a);
            }
            res.render('results', {
                results: data.body.artists.items
            });
        })
        .catch((err) =>
            console.log('The error while searching artists occurred: ', err)
        );
});

app.get('/albums/:id', (req, res) => {
    const id = req.params.id;
    spotifyApi
        .getArtistAlbums(id)
        .then((data) => {
            // console.log(data.body);

            for (item of data.body.items) {
                console.log(item);
            }
            res.render('albums', {
                albums: data.body.items
            });
        })
        .catch((error) => {
            console.log('error loading albums', error);
        });
});

app.get('/tracks/:id', (req, res) => {
    const id = req.params.id;
    spotifyApi
        .getAlbumTracks(id)
        .then((data) => {
            console.log(data.body.items);
            res.render('tracks', {
                tracks: data.body.items
            });
        })
        .catch((error) => {
            console.log('error loading tracks', error);
        });
});
app.listen(3000, () =>
    console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);