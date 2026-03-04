import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${encodeURIComponent(movie.title)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="relative flex-shrink-0 w-32 sm:w-36 md:w-44 lg:w-48 xl:w-52 aspect-[2/3] rounded-lg md:rounded-xl overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-105"
    >
      <img
        src={movie.poster}
        alt={movie.title}
        className="w-full h-full object-cover"
      />

      {/* Dark blur gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t backdrop-blur-[0.5px] hover:backdrop-blur-[0px] from-black/80 via-transparent opacity-80 group-hover:opacity-100 transition" />

      {/* Title */}
      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 text-white text-xs sm:text-sm font-bold line-clamp-2">
        {movie.title}
      </div>
    </div>
  );
};

export default MovieCard;
