const mongoose = require("mongoose");
const { Schema } = mongoose;

const shorttermSchema = new Schema({
  spotifyId: String,
  tracks: Array,
  artists: Array
});

mongoose.model("shortterms", shorttermSchema);
