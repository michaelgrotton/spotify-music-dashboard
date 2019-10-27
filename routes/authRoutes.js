//routes for handling cookie-based o-auth
const passport = require("passport");

module.exports = app => {
  app.get(
    "/auth/spotify",
    passport.authenticate("spotify", {
      scope: ["user-read-email", "user-read-private", "user-top-read"]
    })
  );

  app.get(
    "/auth/spotify/callback",
    passport.authenticate("spotify"),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });

  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};
