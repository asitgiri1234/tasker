// Vercel serverless entry point. All requests are rewritten to this function
// (see ../vercel.json); the Express app handles routing on the original URL.
module.exports = require("../app");
