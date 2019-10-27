const mongoose = require("mongoose");
const { Schema } = mongoose;

const longtermSchema = new Schema({
  spotifyId: String,
  tracks: Array,
  artists: Array
});

mongoose.model("longterms", longtermSchema);
