const refreshToken = require("../middlewares/refreshToken");
const requireLogin = require("../middlewares/requireLogin");
const spotifyApi = require("../services/spotifyApiClient");
const mongoose = require("mongoose");

const Shortterm = mongoose.model("shortterms");
const Mediumterm = mongoose.model("mediumterms");
const Longterm = mongoose.model("longterms");
const Track = mongoose.model("tracks");

module.exports = app => {
  app.get("/api/artists", requireLogin, async (req, res) => {
    var relation = null;
    var time = req.query.time_range;

    while (!relation) {
      switch (time) {
        case "short_term":
          relation = await Shortterm.findOne({
            spotifyId: req.user.spotifyId
          });
          break;
        case "medium_term":
          relation = await Mediumterm.findOne({
            spotifyId: req.user.spotifyId
          });
          break;
        case "long_term":
          relation = await Longterm.findOne({
            spotifyId: req.user.spotifyId
          });
          break;
      }
    }

    const artists = relation.artists.map(artist => {
      return artist.name;
    });

    res.send(artists);
  });

  app.get("/api/tracks", requireLogin, async (req, res) => {
    var time = req.query.time_range;
    var relation = null;

    while (!relation) {
      switch (time) {
        case "short_term":
          relation = await Shortterm.findOne({
            spotifyId: req.user.spotifyId
          });
          break;
        case "medium_term":
          relation = await Mediumterm.findOne({
            spotifyId: req.user.spotifyId
          });
          break;
        case "long_term":
          relation = await Longterm.findOne({
            spotifyId: req.user.spotifyId
          });
          break;
      }
    }

    var tracks = [];

    for (var i = 0; i < relation.tracks.length; i++) {
      const trackDB = await Track.findOne({
        uri: relation.tracks[i].uri
      });

      tracks.push({
        name: trackDB.name,
        artists: trackDB.artists.join(", "),
        analysis: trackDB.analysis.map(function({
          danceability,
          energy,
          key,
          loudness,
          mode,
          speechiness,
          acousticness,
          instrumentalness,
          liveness,
          valence,
          tempo
        }) {
          return {
            danceability,
            energy,
            key,
            loudness,
            mode,
            speechiness,
            acousticness,
            instrumentalness,
            liveness,
            valence,
            tempo
          };
        })
      });
    }

    res.send(tracks);
  });
};
