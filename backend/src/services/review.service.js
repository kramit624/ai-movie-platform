const axios = require("axios");

const RAPIDAPI_BASE_URL = "https://imdb-scraper4.p.rapidapi.com/";

const rapidClient = axios.create({
  baseURL: RAPIDAPI_BASE_URL,
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "x-rapidapi-host": process.env.RAPIDAPI_HOST,
  },
});

// Helper function to clean review text by removing HTML tags and decoding entities
const cleanText = (text) => {
  return text
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
};

// Helper function to format review data from RapidAPI response
const formatReview = (review) => ({
  reviewId: review.review_id,
  username: review.username,
  rating: review.rating,
  summary: review.summary,
  text: cleanText(review.text),
  upVotes: review.upVotes,
  downVotes: review.downVotes,
  spoiler: review.spoiler,
  date: review.submission_date,
});

// Fetch reviews for a movie using its IMDb ID.
const getReviewsByImdbId = async (imdbId, limit = 15) => {
  const { data } = await rapidClient.get("/", {
    params: {
      work_type: "reviews_imdb",
      keyword_1: imdbId,
      keyword_2: 50, // fetch max 50 first
    },
  });

  if (!Array.isArray(data)) {
    throw new Error("Invalid review response from RapidAPI");
  }

  // Separate spoiler and non-spoiler reviews
  const nonSpoiler = data.filter((review) => !review.spoiler);
  const spoiler = data.filter((review) => review.spoiler);

  // Prefer non-spoiler reviews; if too few, top up with spoiler ones
  // This ensures AI always has something to work with
  let pool = nonSpoiler;
  if (pool.length < 5 && spoiler.length > 0) {
    pool = [...nonSpoiler, ...spoiler];
  }

  const filtered = pool
    .sort((a, b) => b.upVotes - a.upVotes) // best reviews first
    .slice(0, limit)
    .map(formatReview);

  return filtered;
};

module.exports = {
  getReviewsByImdbId,
};
