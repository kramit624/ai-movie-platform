import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const HorrorSection = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  // Fetch horror movies on component mount
  useEffect(() => {
    const fetchHorror = async () => {
      try {
        const { data } = await api.get("/horror");
        setMovies(data.data.slice(0, 12)); // 12 movies
      } catch (error) {
        console.error("Error fetching horror movies:", error);
      }
    };

    fetchHorror();
  }, []);

  // Navigate to movie detail page on click
  const handleMovieClick = (movieTitle) => {
    navigate(`/movies/${encodeURIComponent(movieTitle)}`);
  };

  // Navigate to full horror category page
  const handleViewAll = () => {
    navigate("/category/horror");
  };

  return (
    <section className="bg-black px-4 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16">
      {/* Header */}
      <div className="mb-6">
        {/* Top Row */}
        <div className="flex justify-between items-center">
          <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-wide relative">
            HORROR MOVIES
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

      {/* Movie Grid - Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="relative group cursor-pointer"
            onClick={() => handleMovieClick(movie.title)}
          >
            <div className="relative rounded-lg md:rounded-xl overflow-hidden aspect-[2/3]">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Bottom Overlay for Title */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-2 sm:p-3">
                <p className="text-white text-xs sm:text-sm font-medium truncate">
                  {movie.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HorrorSection;
