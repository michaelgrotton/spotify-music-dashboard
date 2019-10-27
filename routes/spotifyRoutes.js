const refreshToken = require("../middlewares/refreshToken");
const requireLogin = require("../middlewares/requireLogin");
const spotifyApi = require("../services/spotifyApiClient");
const mongoose = require("mongoose");

const Shortterm = mongoose.model("shortterms");
const Mediumterm = mongoose.model("mediumterms");
const Longterm = mongoose.model("longterms");

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

    const tracks = relation.tracks.map((track, i) => {
      return {
        name: track.name,
        artists: track.artists.join(", "),
        analysis: track.analysis
      };
    });

    res.send(tracks);
  });
};
