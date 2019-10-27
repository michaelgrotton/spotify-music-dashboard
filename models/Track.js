const mongoose = require("mongoose");
const { Schema } = mongoose;

const trackSchema = new Schema({
  uri: String,
  name: String,
  artists: Array,
  analysis: Array
});

mongoose.model("tracks", trackSchema);
