// Local development entry point. On Vercel the app is served as a serverless
// function via api/index.js instead (see vercel.json) — this file is not used
// there because serverless platforms don't keep a long-lived listener.
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`✗ Failed to start: ${err.message}`);
    process.exit(1);
  });
