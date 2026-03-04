import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import PopularScroll from "../components/PopularScroll";
import HorrorSection from "../components/HorrorSection";

function Home() {
  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <Hero />
      <MovieRow title="TRENDING NOW" endpoint="/trending" />
      <MovieRow title="NEW RELEASES" endpoint="/now-playing" />
      <PopularScroll />
      <HorrorSection />
      <MovieRow title="COMEDY MOVIES" endpoint="/comedy" />
    </div>
  );
}

export default Home;
