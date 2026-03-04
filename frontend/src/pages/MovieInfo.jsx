import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Star,
  Calendar,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../services/api";

const MovieInfo = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const reviewsRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);


  // Fetch movie info on mount or when query changes
  useEffect(() => {
    const fetchMovieInfo = async () => {
      try {
        setLoading(true);

        // Decode the URL-encoded query
        const decodedQuery = decodeURIComponent(query);

        const response = await api.get(`/${decodedQuery}`);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching movie info:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieInfo();
  }, [query]);

  // Auto-scroll reviews
  useEffect(() => {
    if (!data?.reviews || isScrolling) return;

    const interval = setInterval(() => {
      if (reviewsRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = reviewsRef.current;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          reviewsRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          reviewsRef.current.scrollBy({ left: 350, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [data, isScrolling]);

  // Manual scroll handlers for review carousel
  const scrollReviews = (direction) => {
    if (reviewsRef.current) {
      const scrollAmount = direction === "left" ? -350 : 350;
      reviewsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Render loading state, error state, or main content
  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center pt-20">
        <div className="text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  // If data is null after loading, it means there was an error or the movie wasn't found
  if (!data) {
    return (
      <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center pt-20">
        <div className="text-2xl mb-4">Movie not found</div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300"
        >
          Go Home
        </button>
      </div>
    );
  }

  // Safe destructure with fallbacks so missing fields don't crash the page
  const movie = data.movie || {};
  const cast = data.cast || [];
  const audience = data.audience || {};
  const reviews = data.reviews || [];

  // Sentiment color mapping
  const sentimentColors = {
    positive: "bg-green-500/20 text-green-400 border-green-500/50",
    negative: "bg-red-500/20 text-red-400 border-red-500/50",
    mixed: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  };

  const displayReviews = reviews.slice(0, 10);

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Hero Section with Backdrop */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh] lg:h-[75vh] overflow-hidden">
        {/* Backdrop Image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
          style={{ backgroundImage: `url(${movie.backdrop})` }}
        />

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />

        {/* Content */}
        <div className="relative h-full flex items-end px-4 sm:px-8 lg:px-16 pb-8 sm:pb-10 lg:pb-12 pt-20 sm:pt-24">
          <div className="flex md:relative md:top-8 sm:flex-row flex-col gap-4 sm:gap-8 lg:gap-10 sm:items-end w-full max-w-7xl">
            {/* Poster — w-24 on mobile, scales up on sm/md/lg */}
            {movie.poster && (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-32 sm:w-40 md:w-52 lg:w-72 rounded-xl sm:rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500 border-2 sm:border-4 border-white/10 flex-shrink-0"
              />
            )}

            {/* Info */}
            <div className="flex-1 pb-0 sm:pb-4 w-full min-w-0">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer mb-4 sm:mb-6 transition-colors duration-300 hover:gap-3"
              >
                <ArrowLeft size={20} />
                <span className="font-medium">Back</span>
              </button>

              {/* Title */}
              <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black mb-3 sm:mb-6 drop-shadow-2xl leading-tight">
                {movie.title}
              </h1>

              {/* Meta Info */}
              <div className="flex items-center gap-2 sm:gap-4 text-gray-200 mb-3 sm:mb-6 flex-wrap">
                {movie.releaseDate && (
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg backdrop-blur-sm">
                    <Calendar size={14} />
                    <span className="font-semibold text-xs sm:text-base">
                      {new Date(movie.releaseDate).getFullYear()}
                    </span>
                  </div>
                )}

                {movie.runtime && (
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg backdrop-blur-sm">
                    <Clock size={14} />
                    <span className="font-semibold text-xs sm:text-base">
                      {movie.runtime} min
                    </span>
                  </div>
                )}

                {movie.seasons && (
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg backdrop-blur-sm">
                    <TrendingUp size={14} />
                    <span className="font-semibold text-xs sm:text-base">
                      {movie.seasons} Seasons
                    </span>
                  </div>
                )}

                {movie.rating != null && (
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-yellow-500/20 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg backdrop-blur-sm border border-yellow-500/30">
                    <Star
                      size={14}
                      fill="#fbbf24"
                      className="text-yellow-400"
                    />
                    <span className="font-bold text-sm sm:text-lg">
                      {movie.rating.toFixed(1)}
                    </span>
                    <span className="text-gray-300 text-xs sm:text-sm">
                      / 10
                    </span>
                  </div>
                )}

                {movie.voteCount != null && (
                  <span className="text-gray-400 text-xs sm:text-sm hidden sm:inline">
                    {movie.voteCount.toLocaleString()} votes
                  </span>
                )}
              </div>

              {/* Genres */}
              {movie.genres?.length > 0 && (
                <div className="flex gap-1.5 sm:gap-3 mb-4 sm:mb-8 flex-wrap">
                  {movie.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-2.5 sm:px-5 py-1 sm:py-2 bg-white/10 backdrop-blur-md rounded-full text-xs sm:text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 sm:gap-4 flex-wrap">
                <button className="flex items-center gap-2 sm:gap-3 px-4 sm:px-10 py-2.5 sm:py-4 bg-red-600 hover:bg-red-700 rounded-xl font-bold text-sm sm:text-lg transition-all duration-300 hover:scale-105 shadow-2xl shadow-red-600/50">
                  <Play size={16} fill="white" />
                  Play Now
                </button>
                <button className="px-4 sm:px-10 py-2.5 sm:py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-xl font-bold text-sm sm:text-lg border border-white/30 transition-all duration-300 hover:scale-105">
                  <span className="hidden sm:inline">Add to </span>Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-8 lg:px-16 py-10 sm:py-14 lg:py-16 space-y-12 sm:space-y-16">
        {/* Overview Section */}
        {movie.overview && (
          <section>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 flex items-center gap-3">
              <div className="w-2 h-8 sm:h-10 bg-red-600 rounded-full" />
              Plot Overview
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-5xl">
              {movie.overview}
            </p>
          </section>
        )}

        {/* Audience Insights */}
        {(audience.averageRating != null ||
          audience.totalReviews != null ||
          audience.aiSentiment) && (
          <section className="bg-gradient-to-br from-white/5 to-white/0 rounded-2xl p-5 sm:p-8 border border-white/10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 flex items-center gap-3">
              <div className="w-2 h-8 sm:h-10 bg-red-600 rounded-full" />
              Audience Insights
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Average Rating */}
              {audience.averageRating != null && (
                <div className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <Star
                      size={22}
                      fill="#fbbf24"
                      className="text-yellow-400"
                    />
                    <span className="text-gray-400 text-sm font-medium">
                      Average Rating
                    </span>
                  </div>
                  <p className="text-4xl sm:text-5xl font-black text-white">
                    {audience.averageRating.toFixed(1)}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">out of 10</p>
                </div>
              )}

              {/* Total Reviews */}
              {audience.totalReviews != null && (
                <div className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp size={22} className="text-blue-400" />
                    <span className="text-gray-400 text-sm font-medium">
                      Total Reviews
                    </span>
                  </div>
                  <p className="text-4xl sm:text-5xl font-black text-white">
                    {audience.totalReviews}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">user reviews</p>
                </div>
              )}

              {/* AI Sentiment */}
              {audience.aiSentiment && (
                <div
                  className={`rounded-xl p-5 sm:p-6 border ${sentimentColors[audience.aiSentiment] || "bg-white/5 text-white border-white/10"} transition-all duration-300 hover:scale-105`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-current animate-pulse" />
                    <span className="text-sm font-medium">AI Sentiment</span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-black capitalize">
                    {audience.aiSentiment}
                  </p>
                  <p className="text-sm mt-1 opacity-80">overall mood</p>
                </div>
              )}
            </div>

            {/* AI Summary */}
            {audience.aiSummary && (
              <div className="bg-white/5 rounded-xl p-5 sm:p-6 border border-white/10">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">✨</span> AI Summary
                </h3>
                <p className="text-gray-300 leading-relaxed italic text-sm sm:text-base">
                  "{audience.aiSummary}"
                </p>
              </div>
            )}
          </section>
        )}

        {/* Cast Section */}
        {cast.length > 0 && (
          <section>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 flex items-center gap-3">
              <div className="w-2 h-8 sm:h-10 bg-red-600 rounded-full" />
              Top Cast
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4 lg:gap-6">
              {cast.map((actor) => (
                <div key={actor.id} className="group cursor-pointer">
                  <div className="relative rounded-xl overflow-hidden mb-2 sm:mb-3 aspect-[2/3]">
                    <img
                      src={
                        actor.profileImage ||
                        "https://via.placeholder.com/300x450?text=No+Image"
                      }
                      alt={actor.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                    {actor.name}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        {displayReviews.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-3">
                <div className="w-2 h-8 sm:h-10 bg-red-600 rounded-full" />
                User Reviews
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() => scrollReviews("left")}
                  className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scrollReviews("right")}
                  className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div
              ref={reviewsRef}
              onMouseEnter={() => setIsScrolling(true)}
              onMouseLeave={() => setIsScrolling(false)}
              className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
            >
              {displayReviews.map((review) => (
                <div
                  key={review.reviewId}
                  className="min-w-[280px] sm:min-w-[350px] max-w-[280px] sm:max-w-[350px] bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 sm:p-6 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-105"
                >
                  {/* Review Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-base sm:text-lg text-white mb-1">
                        {review.username}
                      </h3>
                      <p className="text-gray-400 text-xs">
                        {new Date(review.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {review.rating && (
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-2 sm:px-3 py-1 rounded-full border border-yellow-500/30">
                        <Star
                          size={12}
                          fill="#fbbf24"
                          className="text-yellow-400"
                        />
                        <span className="font-bold text-xs sm:text-sm">
                          {review.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Review Summary */}
                  {review.summary && (
                    <h4 className="font-semibold text-white mb-2 sm:mb-3 line-clamp-2 text-sm sm:text-base">
                      {review.summary}
                    </h4>
                  )}

                  {/* Review Text */}
                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-6 mb-3 sm:mb-4">
                    {review.text}
                  </p>

                  {/* Review Footer */}
                  <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-400 pt-3 sm:pt-4 border-t border-white/10">
                    <span className="flex items-center gap-1">
                      👍 {review.upVotes}
                    </span>
                    <span className="flex items-center gap-1">
                      👎 {review.downVotes}
                    </span>
                    {review.spoiler && (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                        SPOILER
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MovieInfo;
