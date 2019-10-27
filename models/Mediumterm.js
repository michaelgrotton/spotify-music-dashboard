const mongoose = require("mongoose");
const { Schema } = mongoose;

const mediumtermSchema = new Schema({
  spotifyId: String,
  tracks: Array,
  artists: Array
});

mongoose.model("mediumterms", mediumtermSchema);
