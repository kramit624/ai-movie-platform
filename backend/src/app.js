const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.route');
const movieRoutes = require('./routes/movie.route');

const app = express();
app.use(
  cors({
    origin: "https://ai-movie-platform-c63c.vercel.app/",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/movies', movieRoutes);

module.exports = app;