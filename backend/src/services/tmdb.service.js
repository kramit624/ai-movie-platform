const axios = require("axios");
const nodeCache = require("node-cache");

const cache = new nodeCache({ stdTTL: 600 }); // Cache for 10 minutes

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: process.env.TMDB_API_KEY,
    language: "en-US",
  },
});

/* ---------------------------------------------------
   Helper: Format Movie or TV Basic Data
--------------------------------------------------- */
const formatContent = (item) => ({
  id: item.id,
  title: item.title || item.name,
  overview: item.overview,
  poster: item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : null,
  backdrop: item.backdrop_path
    ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
    : null,
  releaseDate: item.release_date || item.first_air_date,
  rating: item.vote_average,
  voteCount: item.vote_count,
});

/* ---------------------------------------------------
   Home / List Endpoints
--------------------------------------------------- */

const getTrendingMovies = async () => {
  const cacheKey = "trending_movies";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const { data } = await tmdbClient.get("/trending/movie/day",{
    params: {
      "page": 3, // Fetch the third page to get more variety
    }
  });
  cache.set(cacheKey, data.results.map(formatContent));
  return data.results.map(formatContent);
};

const getTopRatedMovies = async () => {
  const cacheKey = "top_rated_movies";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const { data } = await tmdbClient.get("/movie/top_rated");
  cache.set(cacheKey, data.results.map(formatContent));
  return data.results.map(formatContent);
};

const getNowPlayingMovies = async () => {
  const currentYear = new Date().getFullYear();
  const cacheKey = "now_playing_movies";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const { data } = await tmdbClient.get("/discover/movie", {
    params: {
      primary_release_year: currentYear,
      sort_by: "popularity.desc",
    },
  });
  cache.set(cacheKey, data.results.map(formatContent));
  return data.results.map(formatContent);
};

const searchMovies = async (query) => {
  const { data } = await tmdbClient.get("/search/multi", {
    params: { query },
  });


  return data.results
    .filter((item) => item.media_type === "movie" || item.media_type === "tv")
    .map((item) => ({
      id: item.id,
      type: item.media_type, // "movie" or "tv"
      title: item.title || item.name,
      poster: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
    }));
};

const getTvExternalIds = async (tmdbId) => {
  const { data } = await tmdbClient.get(`/tv/${tmdbId}/external_ids`);
  return data.imdb_id;
};

/* ---------------------------------------------
   Get Movies By Genre
--------------------------------------------- */
const getMoviesByGenre = async (genreId) => {
  const { data } = await tmdbClient.get("/discover/movie", {
    params: {
      with_genres: genreId,
      sort_by: "popularity.desc",
    },
  });

  return data.results.map(formatContent);
};

/* ---------------------------------------------------
   Find by IMDb ID (Movie OR TV)
--------------------------------------------------- */

const findByImdbId = async (imdbId) => {
  const { data } = await tmdbClient.get(`/find/${imdbId}`, {
    params: { external_source: "imdb_id" },
  });

  if (data.movie_results && data.movie_results.length > 0) {
    const movie = data.movie_results[0];
    return {
      id: movie.id,
      type: "movie",
      title: movie.title,
      poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
    };
  }

  if (data.tv_results && data.tv_results.length > 0) {
    const tv = data.tv_results[0];
    return {
      id: tv.id,
      type: "tv",
      title: tv.name,
      poster: tv.poster_path
        ? `https://image.tmdb.org/t/p/w500${tv.poster_path}`
        : null,
    };
  }

  throw new Error("Content not found in TMDB");
};
/* ---------------------------------------------------
   Detailed Info
--------------------------------------------------- */

const getMovieDetails = async (tmdbId) => {
  const cacheKey = `movie_details_${tmdbId}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const { data } = await tmdbClient.get(`/movie/${tmdbId}`);
  cache.set(cacheKey, data);
  return data;
};

const getTvDetails = async (tvId) => {
  const cacheKey = `tv_details_${tvId}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const { data } = await tmdbClient.get(`/tv/${tvId}`);
  cache.set(cacheKey, data);
  return data;
};

/* ---------------------------------------------------
   Credits (Cast)
--------------------------------------------------- */

const formatCast = (castArray = []) =>
  castArray.slice(0, 8).map((member) => ({
    id: member.id,
    name: member.name,
    character: member.character,
    profileImage: member.profile_path
      ? `https://image.tmdb.org/t/p/w300${member.profile_path}`
      : null,
  }));

const getMovieCredits = async (tmdbId) => {
  const { data } = await tmdbClient.get(`/movie/${tmdbId}/credits`);
  return formatCast(data.cast);
};

const getTvCredits = async (tvId) => {
  const { data } = await tmdbClient.get(`/tv/${tvId}/credits`);
  return formatCast(data.cast);
};

/* ---------------------------------------------------
   Genres
--------------------------------------------------- */

const getHorrorMovies = async () => {
  const cacheKey = "horror_movies";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  return getMoviesByGenre(27);
};



const getComedyMovies = async () => {
  const cacheKey = "comedy_movies";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  return getMoviesByGenre(35);
};

const getPopularMovies = async () => {
  const cacheKey = "popular_movies";
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }
  const { data } = await tmdbClient.get("/discover/movie",{
    params:{
      sort_by: "popularity.desc",
      "vote_count.gte": 500, // Ensure we get movies with a significant number of votes
      "page": 3,
    }
  });
  cache.set(cacheKey, data.results.map(formatContent));
  return data.results.map(formatContent);
};

/* ---------------------------------------------------
   Export
--------------------------------------------------- */

module.exports = {
  getTrendingMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  searchMovies,
  findByImdbId,
  getMovieDetails,
  getTvDetails,
  getMovieCredits,
  getTvCredits,
  getTvExternalIds,
  getHorrorMovies,
  getComedyMovies,
  getPopularMovies,
};
