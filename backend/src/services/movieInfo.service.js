const tmdbService = require("./tmdb.service");
const reviewService = require("./review.service");
const { generateAudienceInsight } = require("../utils/ai.util");

/* ---------------------------------------------------
   Build Audience Stats (Numeric Based)
--------------------------------------------------- */
const buildAudienceStats = (reviews) => {
  if (!reviews.length) {
    return {
      averageRating: null,
      totalReviews: 0,
      sentiment: "unknown",
    };
  }

  const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  const average = total / reviews.length;

  let sentiment = "mixed";
  if (average >= 7) sentiment = "positive";
  else if (average < 5) sentiment = "negative";

  return {
    averageRating: Number(average.toFixed(2)),
    totalReviews: reviews.length,
    sentiment,
  };
};

/* ---------------------------------------------------
   Format Movie or TV Details
--------------------------------------------------- */
const formatContentDetails = (data, type) => ({
  imdbId: data.imdb_id,
  tmdbId: data.id,
  contentType: type,
  title: data.title || data.name,
  overview: data.overview,
  genres: data.genres?.map((g) => g.name) || [],
  runtime: type === "movie" ? data.runtime : data.episode_run_time?.[0] || null,
  releaseDate: data.release_date || data.first_air_date,
  rating: data.vote_average,
  voteCount: data.vote_count,
  seasons: type === "tv" ? data.number_of_seasons : undefined,
  poster: data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : null,
  backdrop: data.backdrop_path
    ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
    : null,
});

/* ---------------------------------------------------
   Generate AI Insight with Fallback
   - Tries AI if >= 1 review available (was >= 3, too strict)
   - Falls back to numeric sentiment if AI returns "unknown"
     or if there are not enough reviews
--------------------------------------------------- */
const getAiInsightWithFallback = async (reviews, numericSentiment) => {
  // Default fallback
  let aiInsight = {
    summary: null,
    sentiment: "unknown",
  };

  if (reviews.length >= 1) {
    try {
      aiInsight = await generateAudienceInsight(reviews);
    } catch (err) {
      console.error("AI insight generation failed:", err.message);
    }
  }

  // If AI returned unknown/empty sentiment, fall back to numeric sentiment
  const finalSentiment =
    aiInsight.sentiment && aiInsight.sentiment !== "unknown"
      ? aiInsight.sentiment
      : numericSentiment !== "unknown"
        ? numericSentiment
        : null;

  // If AI returned no summary, build a simple one from rating
  const finalSummary =
    aiInsight.summary &&
    aiInsight.summary !== "Not enough reviews to generate AI insight."
      ? aiInsight.summary
      : reviews.length === 0
        ? null
        : `Based on ${reviews.length} review${reviews.length > 1 ? "s" : ""}, audience reception is ${finalSentiment || "mixed"}.`;

  return {
    summary: finalSummary,
    sentiment: finalSentiment,
  };
};

/* ---------------------------------------------------
   Main Aggregation Service
--------------------------------------------------- */
const getFullMovieInfo = async (imdbId) => {
  //  Find Content Type + TMDB ID
  const { id, type } = await tmdbService.findByImdbId(imdbId);

  let details;
  let cast;

  // Fetch Details + Cast Based On Type
  if (type === "movie") {
    details = await tmdbService.getMovieDetails(id);
    cast = await tmdbService.getMovieCredits(id);
  } else {
    details = await tmdbService.getTvDetails(id);
    cast = await tmdbService.getTvCredits(id);
  }

  // Fetch Reviews (IMDb-based)
  const reviews = await reviewService.getReviewsByImdbId(imdbId);

  // Build Numeric Stats
  const audienceStats = buildAudienceStats(reviews);

  // Generate AI Insight with fallback to numeric sentiment
  const aiInsight = await getAiInsightWithFallback(
    reviews,
    audienceStats.sentiment,
  );

  // Final Structured Response
  return {
    movie: formatContentDetails(details, type),
    cast,
    audience: {
      ...audienceStats,
      aiSummary: aiInsight.summary,
      aiSentiment: aiInsight.sentiment,
    },
    reviews,
  };
};

/* ---------------------------------------------------
   Aggregation Using TMDB ID (For Search Results)
--------------------------------------------------- */
const getFullMovieInfoByTmdb = async (tmdbId, type) => {
  let details;
  let cast;

  // Fetch Details + Cast
  if (type === "movie") {
    details = await tmdbService.getMovieDetails(tmdbId);
    cast = await tmdbService.getMovieCredits(tmdbId);
  } else {
    details = await tmdbService.getTvDetails(tmdbId);
    cast = await tmdbService.getTvCredits(tmdbId);
  }

  // Extract IMDb ID (needed for reviews)
  let imdbId = details.imdb_id;

  if (!imdbId && type === "tv") {
    imdbId = await tmdbService.getTvExternalIds(tmdbId);
  }

  let reviews = [];

  if (imdbId && imdbId.startsWith("tt")) {
    try {
      reviews = await reviewService.getReviewsByImdbId(imdbId);
    } catch (err) {
      reviews = [];
    }
  }

  const audienceStats = buildAudienceStats(reviews);

  // Generate AI Insight with fallback to numeric sentiment
  const aiInsight = await getAiInsightWithFallback(
    reviews,
    audienceStats.sentiment,
  );

  return {
    movie: formatContentDetails(details, type),
    cast,
    audience: {
      ...audienceStats,
      aiSummary: aiInsight.summary,
      aiSentiment: aiInsight.sentiment,
    },
    reviews,
  };
};

module.exports = {
  getFullMovieInfo,
  getFullMovieInfoByTmdb,
};
