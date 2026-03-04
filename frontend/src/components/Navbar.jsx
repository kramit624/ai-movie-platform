import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, LogOut, ChevronDown, Menu, X, Search } from "lucide-react";
import gsap from "gsap";
import appLogo from "../assets/appLogo.png";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const backdropRef = useRef(null);
  const menuItemsRef = useRef([]);
  const searchBarRef = useRef(null);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);


  // Check if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileMenu]);


  // GSAP Animation for Mobile Menu
  useEffect(() => {
    if (showMobileMenu && !isAnimatingOut) {
      // Animate backdrop
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );

      // Animate menu panel sliding in from right
      gsap.fromTo(
        mobileMenuRef.current,
        { x: "100%", opacity: 0 },
        {
          x: "0%",
          opacity: 1,
          duration: 0.5,
          ease: "power3.out",
        },
      );

      // Stagger animate menu items
      gsap.fromTo(
        menuItemsRef.current,
        {
          x: 50,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.3,
        },
      );
    }
  }, [showMobileMenu, isAnimatingOut]);

  // GSAP Animation for Mobile Search Bar
  useEffect(() => {
    if (showMobileSearch && searchBarRef.current) {
      gsap.fromTo(
        searchBarRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
      );
    }
  }, [showMobileSearch]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    navigate(`/search/${query.trim()}`);
    setQuery("");
    setShowMobileSearch(false);
    setShowMobileMenu(false);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    setShowMobileMenu(false);
    navigate("/");
    window.location.reload();
  };

  // Animate mobile menu closing
  const closeMobileMenu = () => {
    setIsAnimatingOut(true);

    // Animate menu items out
    gsap.to(menuItemsRef.current, {
      x: 50,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in",
    });

    // Animate menu panel sliding out
    gsap.to(mobileMenuRef.current, {
      x: "100%",
      opacity: 0,
      duration: 0.4,
      ease: "power3.in",
    });

    // Animate backdrop
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setShowMobileMenu(false);
        setIsAnimatingOut(false);
      },
    });
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 px-4 md:px-10 py-4 md:py-5 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/10">
        {/* Logo */}
        <img
          src={appLogo}
          alt="App Logo"
          className="w-20 sm:w-24 md:w-28 cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => navigate("/")}
        />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6">
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="w-[300px] bg-white/10 backdrop-blur-md rounded-lg overflow-hidden border border-white/20 focus-within:border-white/40 transition-all duration-300"
          >
            <input
              type="text"
              placeholder="Search by name or IMDb ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent px-4 py-2 text-white placeholder-gray-400 outline-none"
            />
          </form>

          {/* Conditional Rendering: User Profile or Auth Buttons */}
          {user ? (
            /* User Profile Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <span className="text-white font-medium">{user.username}</span>
                <ChevronDown
                  size={18}
                  className={`text-white transition-transform duration-300 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-64 bg-black/95 backdrop-blur-xl rounded-xl border border-white/20 shadow-2xl overflow-hidden">
                  {/* User Info */}
                  <div className="p-4 border-b border-white/10">
                    <p className="text-white font-bold text-lg mb-1">
                      {user.fullName}
                    </p>
                    <p className="text-gray-400 text-sm">@{user.username}</p>
                    <p className="text-gray-500 text-xs mt-1">{user.email}</p>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-all duration-300"
                  >
                    <LogOut size={18} />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Auth Buttons */
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2 text-white font-medium rounded-lg border border-white/30 hover:bg-white/10 hover:border-white/50 transition-all duration-300 hover:scale-105"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-red-600/50"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile/Tablet Right Side */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Search Icon */}
          <button
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            <Search size={22} />
          </button>

          {/* User Profile Icon (Mobile) */}
          {user && (
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          )}

          {/* Hamburger Menu */}
          <button
            onClick={() =>
              showMobileMenu ? closeMobileMenu() : setShowMobileMenu(true)
            }
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-all duration-300"
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Search Bar */}
      {showMobileSearch && (
        <div
          ref={searchBarRef}
          className="fixed top-[72px] left-0 right-0 z-40 px-4 py-3 bg-black/95 backdrop-blur-xl border-b border-white/10 lg:hidden"
        >
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name or IMDb ID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 outline-none focus:border-red-500"
                autoFocus
              />
            </div>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />

          {/* Menu Panel */}
          <div
            ref={mobileMenuRef}
            className="absolute top-[72px] right-0 w-full sm:w-80 h-[calc(100vh-72px)] bg-black/95 backdrop-blur-xl border-l border-white/10 overflow-y-auto"
          >
            {user ? (
              /* Logged In User Menu */
              <div className="p-6 space-y-6">
                {/* User Profile Section */}
                <div
                  ref={(el) => (menuItemsRef.current[0] = el)}
                  className="pb-6 border-b border-white/10"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center">
                      <User size={28} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-xl">
                        {user.fullName}
                      </p>
                      <p className="text-gray-400 text-sm">@{user.username}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="space-y-2">
                  <button
                    ref={(el) => (menuItemsRef.current[1] = el)}
                    onClick={() => {
                      navigate("/");
                      closeMobileMenu();
                    }}
                    className="w-full text-left py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    Home
                  </button>
                  <button
                    ref={(el) => (menuItemsRef.current[2] = el)}
                    onClick={() => {
                      navigate("/category/trending");
                      closeMobileMenu();
                    }}
                    className="w-full text-left py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    Trending
                  </button>
                  <button
                    ref={(el) => (menuItemsRef.current[3] = el)}
                    onClick={() => {
                      navigate("/category/popular");
                      closeMobileMenu();
                    }}
                    className="w-full text-left py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    Popular
                  </button>
                </div>

                {/* Logout Button */}
                <button
                  ref={(el) => (menuItemsRef.current[4] = el)}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg border border-red-500/30 transition-all duration-300"
                >
                  <LogOut size={20} />
                  <span className="font-bold">Logout</span>
                </button>
              </div>
            ) : (
              /* Not Logged In Menu */
              <div className="p-6 space-y-4">
                <p
                  ref={(el) => (menuItemsRef.current[0] = el)}
                  className="text-gray-400 text-sm mb-6"
                >
                  Sign in to access your watchlist and preferences
                </p>

                <button
                  ref={(el) => (menuItemsRef.current[1] = el)}
                  onClick={() => {
                    navigate("/login");
                    closeMobileMenu();
                  }}
                  className="w-full px-6 py-4 text-white font-bold rounded-lg border border-white/30 hover:bg-white/10 transition-all duration-300"
                >
                  Login
                </button>

                <button
                  ref={(el) => (menuItemsRef.current[2] = el)}
                  onClick={() => {
                    navigate("/signup");
                    closeMobileMenu();
                  }}
                  className="w-full px-6 py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg"
                >
                  Sign Up
                </button>

                {/* Menu Items */}
                <div
                  ref={(el) => (menuItemsRef.current[3] = el)}
                  className="pt-4 border-t border-white/10 space-y-2"
                >
                  <button
                    onClick={() => {
                      navigate("/");
                      closeMobileMenu();
                    }}
                    className="w-full text-left py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    Home
                  </button>
                  <button
                    onClick={() => {
                      navigate("/category/trending");
                      closeMobileMenu();
                    }}
                    className="w-full text-left py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    Trending
                  </button>
                  <button
                    onClick={() => {
                      navigate("/category/popular");
                      closeMobileMenu();
                    }}
                    className="w-full text-left py-3 px-4 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                  >
                    Popular
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
