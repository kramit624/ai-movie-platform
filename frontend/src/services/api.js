import axios from "axios";

// Create an instance of axios with the base URL for the backend API
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api/v1/movies`,
  withCredentials: true,
});

export default api;
