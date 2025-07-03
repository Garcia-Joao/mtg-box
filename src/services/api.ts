import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(config => {
  // e.g. add auth token
  // config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    // global error handling
    return Promise.reject(error);
  }
);


export default api;
