import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5088/api"
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error("Backend API is not reachable. Start the ASP.NET Core API and PostgreSQL, then refresh this page.")
      );
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.title ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
