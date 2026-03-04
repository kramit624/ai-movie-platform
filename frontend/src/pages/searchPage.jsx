import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";

const SearchPage = () => {
  const { query } = useParams();
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch search results when the query changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await api.get("/search", {
          params: { q: query },
        });

        setResults(response.data.data || []);
      } catch (error) {
        console.error(error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center pt-20">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white px-4 sm:px-8 lg:px-16 py-16 sm:py-20 lg:py-24">
      {/* Back Arrow + Title */}
      <div className="flex mt-5 items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
        <ArrowLeft
          size={28}
          className="cursor-pointer hover:text-red-500 transition-colors duration-300 flex-shrink-0"
          onClick={() => navigate("/")}
        />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
          Search Results for <span className="break-all">"{query}"</span>
        </h1>
      </div>

      {/* No Results */}
      {!results || results.length === 0 ? (
        <div className="text-gray-400 text-lg">No results found</div>
      ) : (
        /* Results Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                navigate(`/movies/${encodeURIComponent(item.title)}`)
              }
              className="cursor-pointer group"
            >
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={
                    item.poster ||
                    "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={item.title}
                  className="w-full h-[180px] sm:h-[220px] lg:h-[260px] object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-2 sm:p-3">
                  <p className="text-white text-xs sm:text-sm font-medium truncate">
                    {item.title}
                  </p>
                  <p className="text-gray-400 text-xs uppercase">{item.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
