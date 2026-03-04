# 🎬 AI Movie Review Platform

A full-stack movie discovery and review platform that integrates **TMDB** and **IMDb** data, allowing users to search movies by title or IMDb ID, view detailed movie pages, explore trending and popular content, and read audience reviews enhanced with **AI-generated insights**.

---

## ✨ Features

**Movie Discovery**
- Trending, Top Rated, Now Playing, and Popular movies
- Genre browsing (Horror, Comedy, and more)
- Search by movie title or IMDb ID

**Movie Detail Pages**
- Full metadata (title, genres, runtime, rating, release date)
- Cast list with character names
- Audience review feed
- AI-generated sentiment summary and insight

**UI/UX**
- Animated hero carousel with GSAP
- Scroll-based movie banner animations
- Responsive layout across mobile, tablet, and desktop
- Modern dark cinema aesthetic with TailwindCSS

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js | UI framework |
| React Router | Client-side routing |
| TailwindCSS | Utility-first styling |
| GSAP | Animations and scroll effects |
| Axios | HTTP client |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB | Database (user data) |
| TMDB API | Movie metadata and discovery |
| IMDb (RapidAPI) | Audience reviews |
| AI Utility | Review summarization and sentiment |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                       │
│  Home · MovieInfo · SearchPage · ViewAll · Login · Signup   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP (Axios)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express REST API                          │
│           /api/v1/movies  /api/v1/search  /api/v1/...       │
└──────┬──────────────────┬──────────────────┬────────────────┘
       │                  │                  │
       ▼                  ▼                  ▼
  TMDB API          IMDb Reviews         MongoDB
  (metadata)        (RapidAPI)          (users)
       │                  │
       └────────┬─────────┘
                ▼
          AI Summarizer
       (sentiment + insight)
```

---

## 📁 Folder Structure

```
ai-movie-platform/
├── backend/
│   └── src/
│       ├── config/
│       │   └── db.js                  # MongoDB connection
│       ├── controllers/
│       │   ├── auth.controller.js     # Login / signup logic
│       │   └── movie.controller.js    # Movie endpoints logic
│       ├── models/
│       │   └── user.model.js          # User schema
│       ├── routes/
│       │   ├── auth.route.js          # Auth route definitions
│       │   └── movie.route.js         # Movie route definitions
│       ├── services/
│       │   ├── movieInfo.service.js   # Data aggregation layer
│       │   ├── review.service.js      # IMDb review fetching
│       │   └── tmdb.service.js        # TMDB API integration
│       └── utils/
│           ├── ai.util.js             # AI insight generation
│            └── asyncHandler.js      # For try and catch
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Hero.jsx
        │   ├── MovieCard.jsx
        │   ├── MovieRow.jsx
        │   ├── PopularScroll.jsx
        │   ├── HorrorSection.jsx
        │   └── Footer.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── MovieInfo.jsx
        │   ├── SearchPage.jsx
        │   ├── ViewAll.jsx
        │   ├── Login.jsx
        │   └── Signup.jsx
        ├── services/
        │   ├── api.js                 # Axios instance for movie API
        │   └── authApi.js             # Axios instance for auth API
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## 🔌 API Reference

### Movie Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/movies/:imdbId` | Full movie details (metadata + cast + reviews + AI) |
| `GET` | `/api/v1/search?q=:query` | Search movies and TV shows by name and IMDB Id |
| `GET` | `/api/v1/trending` | Trending movies of the week |
| `GET` | `/api/v1/top-rated` | Top rated movies |
| `GET` | `/api/v1/now-playing` | Currently playing in cinemas |
| `GET` | `/api/v1/popular` | Popular movies |
| `GET` | `/api/v1/horror` | Horror genre movies |

### Auth Routes

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/signup` | Register a new user |
| `POST` | `/api/v1/auth/login` | Authenticate a user |

---

## 🧩 Backend Architecture

### Controllers

**`movie.controller.js`**
Handles all movie-related HTTP requests. Delegates data fetching to the service layer and returns formatted JSON responses. Covers movie detail lookup, trending/popular/genre endpoints, and search.

**`auth.controller.js`**
Handles user registration and login. Validates input, interfaces with the User model, and manages authentication flow.

---

### Services

**`tmdb.service.js`**
Wraps all TMDB API calls — movie search, discovery endpoints (trending, popular, now playing, genres), movie detail fetching, and cast retrieval. Maps TMDB responses into a consistent internal schema.

**`review.service.js`**
Fetches audience reviews from IMDb via RapidAPI. Filters spoiler reviews, sorts by upvotes, and formats each review into a clean object for the frontend and AI layer.

**`movieInfo.service.js`**
The main aggregation service. Orchestrates calls to `tmdb.service`, `review.service`, and `ai.util` to assemble the complete movie response object:
- TMDB metadata + cast
- IMDb reviews
- Numeric audience stats (average rating, sentiment)
- AI-generated summary and sentiment

**`ai.util.js`**
Generates audience insight from a set of reviews using AI summarization. Returns a `summary` string and a `sentiment` label (`positive`, `negative`, `mixed`). Falls back gracefully to numeric sentiment if AI is unavailable or review count is low.

---

## 📦 Installation

**Prerequisites:** Node.js ≥ 18, MongoDB instance, TMDB API key, RapidAPI key (IMDb Scraper)

```bash
# Clone the repository
git clone https://github.com/kramit624/ai-movie-platform.git
cd ai-movie-platform

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Server
PORT=5000

# Database
MONGO_URI=your_mongodb_connection_string

# TMDB
TMDB_API_KEY=your_tmdb_api_key

# TOKEN-SECRET
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret


# TOKEN-SECRET-EXPIRY
ACCESS_TOKEN_EXPIRY=your_access_token_expiry
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry

#NODE-ENV
NODE_ENV=Your desired environment here (e.g., development, production)

# RapidAPI (IMDb Reviews)
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=imdb-scraper4.p.rapidapi.com
```

> ⚠️ Never commit `.env` to version control. Add it to `.gitignore`.

---

## 🚀 Running Locally

**Backend**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm run dev
# App starts on http://localhost:5173
```

---

## 📡 Example API Response

**`GET /api/v1/movies/tt1375666`** *(Inception)*

```json
{
  "data": {
    "movie": {
      "imdbId": "tt1375666",
      "tmdbId": 27205,
      "contentType": "movie",
      "title": "Inception",
      "overview": "A thief who steals corporate secrets through dream-sharing technology...",
      "genres": ["Action", "Science Fiction", "Adventure"],
      "runtime": 148,
      "releaseDate": "2010-07-15",
      "rating": 8.4,
      "voteCount": 35820,
      "poster": "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      "backdrop": "https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg"
    },
    "cast": [
      {
        "id": 6193,
        "name": "Leonardo DiCaprio",
        "character": "Dom Cobb",
        "profileImage": "https://image.tmdb.org/t/p/w500/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg"
      }
    ],
    "audience": {
      "averageRating": 8.7,
      "totalReviews": 12,
      "sentiment": "positive",
      "aiSummary": "Audiences consistently praise Inception for its intricate plot and stunning visuals, calling it one of the most intellectually rewarding blockbusters in recent memory.",
      "aiSentiment": "positive"
    },
    "reviews": [
      {
        "reviewId": "rw1234567",
        "username": "cinephile_99",
        "rating": 9,
        "summary": "Mind-bending masterpiece",
        "text": "Nolan outdoes himself with a layered narrative that rewards repeat viewings...",
        "upVotes": 342,
        "downVotes": 12,
        "spoiler": false,
        "date": "2023-08-14T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 📸 Screenshots

> *Screenshots will be added here after deployment.*

| Page | Preview |
|---|---|
| Home — Hero + Trending | `screenshots/home.png` |
| Movie Detail Page | `screenshots/movie-info.png` |
| Search Results | `screenshots/search.png` |
| View All — Category Grid | `screenshots/view-all.png` |

---

## 🔭 Future Improvements

- [ ] User review submission and rating system
- [ ] Watchlist / favourites (saved to user account)
- [ ] Redis caching for TMDB and review responses
- [ ] Pagination and infinite scroll on category pages
- [ ] AI-powered recommendation engine based on watch history
- [ ] TV show episode-level detail pages
- [ ] PWA support for mobile install

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ using React, Node.js, and the TMDB API</p>