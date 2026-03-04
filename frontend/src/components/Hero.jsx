import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import gsap from "gsap";
import { Star, Play } from "lucide-react";

const Hero = () => {
  const [movies, setMovies] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const textRef = useRef(null);
  const posterRef = useRef(null);
  const bgRef = useRef(null);

  /* ===============================
     Fetch + Preload Images
  =============================== */
  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get("/top-rated");
        const firstFive = data.data.slice(0, 5);

        // Preload backdrop + poster
        firstFive.forEach((movie) => {
          const img1 = new Image();
          img1.src = movie.backdrop;

          const img2 = new Image();
          img2.src = movie.poster;
        });

        setMovies(firstFive);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTrending();
  }, []);

  /* ===============================
     Auto Rotate
  =============================== */
  useEffect(() => {
    if (!movies.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  /* ===============================
     Animations on Slide Change
  =============================== */
  useEffect(() => {
    if (!movies.length) return;

    // Text animation
    gsap.fromTo(
      textRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
    );

    // Poster animation (smooth)
    gsap.fromTo(
      posterRef.current,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
    );

    // Backdrop zoom subtle
    gsap.fromTo(
      bgRef.current,
      { opacity: 0, scale: 1.05 },
      { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
    );
  }, [index, movies]);

  if (!movies.length) return null;

  const movie = movies[index];
  const formattedRating = movie.rating ? movie.rating.toFixed(1) : "N/A";

  return (
    <section className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] overflow-hidden flex items-center px-4 sm:px-8 md:px-12 lg:px-16 pt-20">
      {/* ===============================
          BACKDROP IMAGE (Crossfade)
      =============================== */}
      <div
        ref={bgRef}
        key={movie.backdrop}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${movie.backdrop})`,
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50" />

      {/* ===============================
          CONTENT
      =============================== */}
      <div className="relative z-10 w-full flex flex-col lg:flex-row justify-between items-center lg:items-end gap-8">
        {/* LEFT CONTENT */}
        <div
          ref={textRef}
          className="max-w-xl text-white text-center lg:text-left"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            {movie.title}
          </h1>

          <p className="text-gray-300 mb-6 md:mb-8 line-clamp-3 text-sm sm:text-base">
            {movie.overview}
          </p>

          <button
            onClick={() =>
              navigate(`/movies/${encodeURIComponent(movie.title)}`)
            }
            className="bg-red-600 px-6 py-3 rounded-lg hover:scale-105 transition cursor-pointer text-sm sm:text-base font-semibold"
          >
            More Info
          </button>
        </div>

        {/* RIGHT POSTER */}
        <div ref={posterRef} className="relative hidden md:block">
          <div
            onClick={() =>
              navigate(`/movies/${encodeURIComponent(movie.title)}`)
            }
            className="relative top-0 md:top-8 w-40 md:w-48 lg:w-56 xl:w-64 aspect-[2/3] rounded-xl cursor-pointer overflow-hidden shadow-2xl border border-white/20 hover:scale-105 transition-transform duration-300"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-full object-cover"
            />

            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition">
              <Play size={40} className="text-white" />
            </div>

            {/* Rating badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/20 backdrop-blur-md px-2 py-1 rounded-md">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-semibold">
                {formattedRating}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
