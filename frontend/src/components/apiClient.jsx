import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI, // Use Vite's `import.meta.env`
});

export default apiClient;
