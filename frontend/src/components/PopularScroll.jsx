import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, Info } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const PopularScroll = () => {
  const [movies, setMovies] = useState([]);
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const navigate = useNavigate();

  /* =========================
     Fetch Popular Movies
  ========================= */
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const { data } = await api.get("/popular");
        setMovies(data.data.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    };

    fetchPopular();
  }, []);

  /* =========================
     Enhanced Vertical Scroll Animation
  ========================= */
  useEffect(() => {
    if (!movies.length) return;

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".scroll-panel");
      const panelHeight = panels[0].offsetHeight;
      const totalScroll = panelHeight * (panels.length - 1);

      // Main container scroll
      gsap.to(containerRef.current, {
        y: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${totalScroll}`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Parallax effect for each panel
      panels.forEach((panel, index) => {
        const bg = panel.querySelector(".panel-bg");
        const overlay = panel.querySelector(".panel-overlay");
        const title = panel.querySelector(".panel-title");
        const description = panel.querySelector(".panel-description");
        const buttons = panel.querySelector(".panel-buttons");

        // Background zoom & parallax
        gsap.fromTo(
          bg,
          { scale: 1.2, y: 0 },
          {
            scale: 1,
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top bottom",
              end: "bottom top",
              scrub: 2,
            },
          },
        );

        // Overlay fade
        gsap.fromTo(
          overlay,
          { opacity: 0.5 },
          {
            opacity: 0.8,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              start: "top center",
              end: "center center",
              scrub: 1,
            },
          },
        );

        // Content stagger animation
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: "top 60%",
            end: "top 20%",
            scrub: 1,
          },
        });

        tl.fromTo(
          title,
          { y: 100, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
        )
          .fromTo(
            description,
            { y: 80, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
            "-=0.3",
          )
          .fromTo(
            buttons,
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
            "-=0.2",
          );
      });
    });

    return () => ctx.revert();
  }, [movies]);

  // Refresh ScrollTrigger on movie updates
  useEffect(() => {
    if (movies.length) {
      ScrollTrigger.refresh();
    }
  }, [movies]);

  const handleMoreInfo = (movieTitle) => {
    navigate(`/movies/${encodeURIComponent(movieTitle)}`);
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-black popular-scroll-section"
    >
      {/* Section Title with fade-in */}
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 pt-16 sm:pt-20 pb-8 sm:pb-12">
        <h2 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider uppercase">
          Popular Movies
        </h2>
        <div className="w-16 sm:w-20 h-1 bg-red-600 mt-3"></div>
      </div>

      {/* Scroll Area */}
      <div className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] overflow-hidden">
        <div ref={containerRef} className="relative">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className="scroll-panel h-[70vh] sm:h-[75vh] md:h-[80vh] w-full relative flex items-center justify-center overflow-hidden"
            >
              {/* Background with parallax */}
              <div
                className="panel-bg absolute inset-0 bg-cover bg-center will-change-transform"
                style={{
                  backgroundImage: `url(${movie.backdrop})`,
                }}
              />

              {/* Gradient Overlay */}
              <div className="panel-overlay absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />

              {/* Vignette Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60" />

              {/* Content */}
              <div className="panel-content relative z-10 text-center max-w-4xl px-4 sm:px-6">
                {/* Number Badge */}
                <div className="absolute -top-12 sm:-top-20 left-1/2 transform -translate-x-1/2">
                  <span className="text-[80px] sm:text-[100px] md:text-[120px] font-black text-white/5 leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Title */}
                <h1 className="panel-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 sm:mb-6 drop-shadow-2xl leading-tight">
                  {movie.title}
                </h1>

                {/* Description */}
                <p className="panel-description text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed line-clamp-2 sm:line-clamp-3 max-w-3xl mx-auto mb-6 sm:mb-8 drop-shadow-lg">
                  {movie.overview}
                </p>

                {/* Buttons */}
                <div className="panel-buttons flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <button
                    onClick={() => handleMoreInfo(movie.title)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 shadow-xl text-sm sm:text-base"
                  >
                    <Play size={18} fill="black" />
                    Play Now
                  </button>
                  <button
                    onClick={() => handleMoreInfo(movie.title)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/20 backdrop-blur-md text-white font-bold rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 hover:scale-105 text-sm sm:text-base"
                  >
                    <Info size={18} />
                    More Info
                  </button>
                </div>
              </div>

              {/* Progress Indicator - Hide on mobile */}
              <div className="hidden sm:flex absolute bottom-6 sm:bottom-8 right-6 sm:right-8 flex-col items-center gap-2">
                <span className="text-white/60 text-xs sm:text-sm font-medium">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="w-0.5 h-10 sm:h-12 bg-white/20 relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 w-full bg-red-600 transition-all duration-300"
                    style={{
                      height: `${((index + 1) / movies.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-white/40 text-xs sm:text-sm font-medium">
                  {String(movies.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularScroll;
