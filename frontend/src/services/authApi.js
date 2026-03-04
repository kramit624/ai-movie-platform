import axios from "axios";

// Create an Axios instance for authentication API
const authApi = axios.create({
  baseURL: "http://localhost:5000/api/v1/auth",
});

// Add token to requests
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default authApi;
