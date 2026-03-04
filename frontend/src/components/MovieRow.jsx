import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import MovieCard from "./MovieCard";

const MovieRow = ({ title, endpoint }) => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  // Map endpoint to category slug
  const getCategorySlug = (endpoint) => {
    const mapping = {
      "/trending": "trending",
      "/now-playing": "now-playing",
      "/popular": "popular",
      "/horror": "horror",
      "/comedy": "comedy",
    };
    return mapping[endpoint] || endpoint.replace("/", "");
  };

  // Fetch movies when component mounts or endpoint changes
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await api.get(endpoint);
        setMovies(data.data.slice(0, 6));
      } catch (error) {
        console.error(error);
      }
    };

    fetchMovies();
  }, [endpoint]);

  const handleViewAll = () => {
    const categorySlug = getCategorySlug(endpoint);
    navigate(`/category/${categorySlug}`);
  };

  return (
    <section className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-8 md:py-10">
      {/* Header */}
      <div className="mb-6">
        {/* Top Row */}
        <div className="flex justify-between items-center">
          <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-wide relative">
            {title}
          </h2>

          <button
            onClick={handleViewAll}
            className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-300"
          >
            View All →
          </button>
        </div>

        {/* Bottom Line */}
        <div className="mt-3 relative h-[2px] w-full">
          {/* Gray Base Line */}
          <div className="absolute inset-0 bg-gray-700" />

          {/* Red Highlight 10% */}
          <div className="absolute left-0 top-0 h-[2px] w-[10%] bg-red-500" />
        </div>
      </div>

      {/* Movie Row - Horizontal Scroll on Mobile */}
      <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide w-full pb-2">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default MovieRow;
