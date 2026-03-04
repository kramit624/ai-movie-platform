import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";

const ViewAll = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category mapping for titles and endpoints
  const categoryConfig = {
    trending: { title: "Trending Now", endpoint: "/trending" },
    "now-playing": { title: "New Releases", endpoint: "/now-playing" },
    popular: { title: "Popular Movies", endpoint: "/popular" },
    horror: { title: "Horror Movies", endpoint: "/horror" },
    comedy: { title: "Comedy Movies", endpoint: "/comedy" },
  };

  const currentCategory = categoryConfig[category] || {
    title: "Movies",
    endpoint: `/${category}`,
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(currentCategory.endpoint);
        setMovies(data.data || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category, currentCategory.endpoint]);

  const handleMovieClick = (movieTitle) => {
    navigate(`/movies/${encodeURIComponent(movieTitle)}`);
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center pt-20">
        <div className="text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white px-4 sm:px-8 lg:px-16 py-16 sm:py-20 lg:py-24">
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        {/* Back Button + Title */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <ArrowLeft
            size={28}
            className="cursor-pointer hover:text-red-500 transition-colors duration-300 flex-shrink-0"
            onClick={() => navigate("/")}
          />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            {currentCategory.title}
          </h1>
        </div>

        {/* Red underline */}
        <div className="w-32 h-1 bg-red-600"></div>
      </div>

      {/* Movies Count */}
      <p className="text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg">
        {movies.length} {movies.length === 1 ? "movie" : "movies"} found
      </p>

      {/* No Results */}
      {!movies || movies.length === 0 ? (
        <div className="text-gray-400 text-lg text-center py-20">
          No movies found in this category
        </div>
      ) : (
        /* Movies Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie.title)}
              className="cursor-pointer group"
            >
              <div className="relative rounded-xl overflow-hidden aspect-[2/3]">
                <img
                  src={
                    movie.poster ||
                    "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
                    <p className="text-white text-xs sm:text-sm font-bold mb-1">
                      {movie.title}
                    </p>
                    {movie.rating && (
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-gray-300 text-xs">
                          {movie.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title below poster */}
              <p className="text-white text-xs sm:text-sm font-medium mt-2 sm:mt-3 truncate">
                {movie.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAll;
