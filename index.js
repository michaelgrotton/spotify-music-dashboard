//node packages
const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");

const keys = require("./config/keys");
mongoose.connect(keys.mongoURI);

//require User.js and passport.js so they execute
require("./models/User");
require("./models/Track");
require("./models/Shortterm");
require("./models/Mediumterm");
require("./models/Longterm");
require("./services/passport.js");

const app = express();

//middlewares
app.use(bodyParser.json());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/spotifyRoutes")(app);

if (process.env.NODE_ENV === "production") {
  //serve up production assets
  app.use(express.static("client/build"));

  //serve up index.html file if route not recognized
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
