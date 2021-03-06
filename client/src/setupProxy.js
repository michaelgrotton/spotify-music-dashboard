const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy(["/api", "/auth/spotify"], { target: "http://localhost:5000" })
  );
};
