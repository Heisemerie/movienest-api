const express = require("express");
const genres = require('./routes/genre')

const app = express();

// Middleware
app.use(express.json());

app.use('/api/genres', genres)

// Express "endpoint" event emitter
const port = process.env.PORT || 3000; // get port from environment variable or use port 3000
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
