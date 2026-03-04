import axios from "axios";

// Create an instance of axios with the base URL for the backend API
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1/movies",
});

export default api;
