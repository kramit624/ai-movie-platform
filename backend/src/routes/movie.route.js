const express = require("express");
const {
  getMovieInfo,
  getTrending,
  getTopRated,
  getNowPlaying,
  getPopular,
  getHorror,
  getComedy,
  searchByName,
  getMovieInfoByTmdb
} = require("../controllers/movie.controller");

const router = express.Router();

// Home / List Endpoints
router.get("/trending", getTrending);
router.get("/top-rated", getTopRated);
router.get("/now-playing", getNowPlaying);
router.get("/popular", getPopular);

router.get("/horror", getHorror);
router.get("/comedy", getComedy);

router.get("/search", searchByName);

/* TMDB ID and Movie name Based Routes */
router.get("/tmdb/:id/:type", getMovieInfoByTmdb);
router.get("/:query", getMovieInfo);

module.exports = router;