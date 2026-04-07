import axios from "axios";

// ✅ Create axios instance
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // 🔁 change to your Laravel API URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ✅ REQUEST INTERCEPTOR (attach token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR (handle errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🔥 Handle Unauthorized (Token expired / invalid)
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Logging out...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // redirect to login
      window.location.href = "/candidate/login";
    }

    return Promise.reject(error);
  }
);

export default api;