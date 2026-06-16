import axios from "axios";

  console.log("VITE_AUTH_API =", import.meta.env.VITE_AUTH_API);
const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API,
});

export default authApi;
