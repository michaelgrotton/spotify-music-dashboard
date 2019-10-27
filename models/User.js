const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  spotifyId: String,
  accessToken: String,
  refreshToken: String,
  expiresIn: Date
});

mongoose.model("users", userSchema);
