// Serverless entry for the backend service (Vercel multi-service deploy).
// The root vercel.json routes every /api/* request to this service; this
// catch-all function receives the original URL and lets the Express app
// (backend/app.js) do the routing. Not used in local dev (server.js listens).
module.exports = require("../app");
