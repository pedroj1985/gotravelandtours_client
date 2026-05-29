import axios from "axios";

const HTTP = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "http://localhost:5000/api/",
  timeout: 120000,
  headers: { "Content-Type": "application/json" }
});

HTTP.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export { HTTP };
export default HTTP;
