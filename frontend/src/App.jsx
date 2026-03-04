import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import SearchPage from "./pages/SearchPage";
import Home from "./pages/Home";
import MovieInfo from "./pages/MovieInfo";
import ViewAll from "./pages/ViewAll";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function AppContent() {
  const location = useLocation();
  const scrollPositions = useRef({});

  // Save scroll position before navigating away
  useEffect(() => {
    const saveScrollPos = () => {
      scrollPositions.current[location.pathname] = window.scrollY;
    };

    window.addEventListener("beforeunload", saveScrollPos);

    return () => {
      saveScrollPos();
      window.removeEventListener("beforeunload", saveScrollPos);
    };
  }, [location.pathname]);

  // Restore scroll position on navigation
  useEffect(() => {
    const savedPosition = scrollPositions.current[location.pathname];

    if (savedPosition !== undefined) {
      setTimeout(() => {
        window.scrollTo(0, savedPosition);
      }, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search/:query" element={<SearchPage />} />
        <Route path="/movies/:query" element={<MovieInfo />} />
        <Route path="/category/:category" element={<ViewAll />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </>
  );
}

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
  