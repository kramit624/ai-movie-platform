import { useNavigate } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import appLogo from "../assets/appLogo.png";

const Footer = () => {
  const navigate = useNavigate();

  const footerLinks = {
    Company: [
      { name: "About Us", path: "/about" },
      { name: "Careers", path: "/careers" },
      { name: "Press", path: "/press" },
      { name: "Blog", path: "/blog" },
    ],
    Support: [
      { name: "Help Center", path: "/help" },
      { name: "Contact Us", path: "/contact" },
      { name: "FAQs", path: "/faq" },
      { name: "Account", path: "/account" },
    ],
    Legal: [
      { name: "Privacy Policy", path: "/privacy" },
      { name: "Terms of Service", path: "/terms" },
      { name: "Cookie Policy", path: "/cookies" },
      { name: "Disclaimer", path: "/disclaimer" },
    ],
    Browse: [
      { name: "Movies", path: "/movies" },
      { name: "TV Shows", path: "/tv-shows" },
      { name: "Trending", path: "/trending" },
      { name: "New Releases", path: "/new-releases" },
    ],
  };

  const socialLinks = [
    { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { Icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <div className="bg-black border-t border-white/10">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-10 sm:py-12">
        {/* Top Section - Logo & Social */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 sm:mb-12 pb-8 border-b border-white/10 gap-6">
          <div>
            <img
              src={appLogo}
              alt="App Logo"
              className="w-28 sm:w-32 cursor-pointer hover:opacity-80 transition-opacity duration-300"
              onClick={() => navigate("/")}
            />
            <p className="text-gray-400 mt-3 max-w-sm text-sm sm:text-base">
              Your ultimate destination for movies and TV shows. Stream
              unlimited entertainment.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 sm:gap-4">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-red-600 hover:scale-110 transition-all duration-300"
                aria-label={label}
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">
                {category}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={() => navigate(link.path)}
                      className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-300 text-left text-sm sm:text-base"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-white/5 rounded-xl p-5 sm:p-8 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                <Mail size={18} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg sm:text-xl">
                  Stay Updated
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">
                  Subscribe to our newsletter for the latest releases
                </p>
              </div>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 outline-none focus:border-red-600 transition-all duration-300 w-full md:w-64 text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300 hover:scale-105 whitespace-nowrap text-sm sm:text-base"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p className="text-gray-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} MovieApp. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
              <button className="hover:text-white transition-colors duration-300">
                Privacy
              </button>
              <span>•</span>
              <button className="hover:text-white transition-colors duration-300">
                Terms
              </button>
              <span>•</span>
              <button className="hover:text-white transition-colors duration-300">
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
