const movieService = require("../services/movieInfo.service");
const tmdbService = require("../services/tmdb.service");
const nodeCache = require("node-cache");

const cache = new nodeCache({ stdTTL: 600 }); // Cache for 10 minutes


// Handles GET /api/v1/movies/:query
const getMovieInfo = async (req, res, next) => {
  try {
    const cacheKey = `movie_info_${req.params.query}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        data: cachedData,
      });
    }

    const { query } = req.params;

    let data;

    if (query.startsWith("tt")) {
      // IMDb search
      data = await movieService.getFullMovieInfo(query);
    } else {
      // Name search
      const results = await tmdbService.searchMovies(query);

      if (!results.length) {
        return res.status(404).json({
          success: false,
          message: "Movie not found",
        });
      }

      const first = results[0];

      data = await movieService.getFullMovieInfoByTmdb(first.id, first.type);
    }

    cache.set(cacheKey, data);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// Handles GET /api/v1/movies/tmdb/:id/:type
const getMovieInfoByTmdb = async (req, res, next) => {
  try {
    const cacheKey = `movie_info_tmdb_${req.params.id}_${req.params.type}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        data: cachedData,
      });
    }

    const { id, type } = req.params;

    const data = await movieService.getFullMovieInfoByTmdb(id, type);

    cache.set(cacheKey, data);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};


/* ---------------------------------------------
   Get Trending Movies
--------------------------------------------- */
const getTrending = async (req, res, next) => {
  try {
    const movies = await tmdbService.getTrendingMovies();

    res.status(200).json({
      success: true,
      results: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------------------------------------
   Get Top Rated Movies
--------------------------------------------- */
const getTopRated = async (req, res, next) => {
  try {
    const movies = await tmdbService.getTopRatedMovies();

    res.status(200).json({
      success: true,
      results: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------------------------------------
   Get Now Playing Movies
--------------------------------------------- */
const getNowPlaying = async (req, res, next) => {
  try {
    const movies = await tmdbService.getNowPlayingMovies();

    res.status(200).json({
      success: true,
      results: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};

/* ---------------------------------------------
   Search Movies By Name
--------------------------------------------- */
const searchByName = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Check if the query is an IMDb ID (starts with "tt")
    const isImdbId = q.trim().startsWith("tt");

    let results;

    if (isImdbId) {
      const result = await tmdbService.findByImdbId(q.trim());
      results = [result]; // Wrap in array for consistent response format
    } else {
      results = await tmdbService.searchMovies(q);
    }

    res.status(200).json({
      success: true,
      results: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};


/* ---------------------------------------------
    (Additional endpoints like getByGenre can be added here)
----------------------------------------------*/

const getHorror = async (req, res, next) => {
  try {
    const movies = await tmdbService.getHorrorMovies();
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
};

const getAction = async (req, res, next) => {
  try {
    const movies = await tmdbService.getActionMovies();
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
};

const getComedy = async (req, res, next) => {
  try {
    const movies = await tmdbService.getComedyMovies();
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
};

const getPopular = async (req, res, next) => {
  try {
    const movies = await tmdbService.getPopularMovies();
    res.status(200).json({ success: true, data: movies });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getMovieInfo,
  getTrending,
  getTopRated,
  getNowPlaying,
  searchByName,
  getHorror,
  getAction,
  getComedy,
  getPopular,
  getMovieInfoByTmdb
};
