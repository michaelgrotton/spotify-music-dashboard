const keys = require("../config/keys");
const SpotifyWebApi = require("spotify-web-api-node");
const mongoose = require("mongoose");

const User = mongoose.model("users");
const Track = mongoose.model("tracks");
const Shortterm = mongoose.model("shortterms");
const Mediumterm = mongoose.model("mediumterms");
const Longterm = mongoose.model("longterms");

var spotifyApi = new SpotifyWebApi({
  clientId: keys.spotifyClientID,
  clientSecret: keys.spotifyClientSecret,
  redirectUri: "http://localhost:5000/auth/spotify/callback"
});

//populate database
const populate = async user => {
  const time_ranges = ["short_term", "medium_term", "long_term"];
  spotifyApi.setAccessToken(user.accessToken);

  for (var i = 0; i < 3; i++) {
    const artistsResponse = await spotifyApi
      .getMyTopArtists({ time_range: time_ranges[i] })
      .catch(err => {
        console.log(err);
      });

    const tracksResponse = await spotifyApi
      .getMyTopTracks({
        time_range: time_ranges[i]
      })
      .catch(err => {
        console.log(err);
      });

    const artists = artistsResponse.body.items.map(function(item) {
      return { uri: item.id, name: item.name };
    });
    const tracks = tracksResponse.body.items.map(function(item) {
      return {
        uri: item.id,
        artists: item.artists.map(artist => artist.name),
        name: item.name
      };
    });

    for (var j = 0; j < tracks.length; j++) {
      track = tracks[j];
      const existing = await Track.findOne({
        uri: track.uri
      });

      if (!existing) {
        const newTrack = await new Track({
          uri: track.uri,
          name: track.name,
          artists: track.artists
        }).save();
      }
    }

    const rangeAttr = {
      spotifyId: user.spotifyId,
      artists,
      tracks
    };

    switch (i) {
      case 0:
        await new Shortterm(rangeAttr).save();
        break;
      case 1:
        await new Mediumterm(rangeAttr).save();
        break;
      case 2:
        await new Longterm(rangeAttr).save();
        break;
    }
  }
};

const analysis = async user => {
  spotifyApi.setAccessToken(user.accessToken);
  const time_ranges = ["short_term", "medium_term", "long_term"];

  for (var j = 0; j < 3; j++) {
    var relation = null;
    while (!relation) {
      switch (time_ranges[j]) {
        case "short_term":
          relation = await Shortterm.findOne({
            spotifyId: user.spotifyId
          });
          break;
        case "medium_term":
          relation = await Mediumterm.findOne({
            spotifyId: user.spotifyId
          });
          break;
        case "long_term":
          relation = await Longterm.findOne({
            spotifyId: user.spotifyId
          });
          break;
      }
    }

    const trackAnalysis = await spotifyApi
      .getAudioFeaturesForTracks(relation.tracks.map(item => item.uri))
      .catch(err => {
        console.log(err);
      });

    for (var i = 0; i < relation.tracks.length; i++) {
      const track = await Track.findOne({
        uri: relation.tracks[i].uri
      });

      track.analysis = trackAnalysis.body.audio_features[i];
      track.save();
    }
  }
};

module.exports = { populate, analysis };
