const mongoose = require("mongoose");
const User = mongoose.model("users");
const spotifyApi = require("../services/spotifyApiClient");

module.exports = (req, res, next) => {
  if (req.user.expiresIn <= new Date(Date.now())) {
    spotifyApi.setRefreshToken(req.user.refreshToken);
    spotifyApi.refreshAccessToken().then(
      async function(data) {
        var user = await User.findById(req.user.id);
        user.expiresIn = new Date(Date.now() + 3600 * 1000);
        user.accessToken = data.body["access_token"];
        await user.save();
      },
      function(err) {
        console.log("Could not refresh access token", err);
      }
    );
  }
  next();
};
