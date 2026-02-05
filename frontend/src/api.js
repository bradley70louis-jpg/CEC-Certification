import axios from "axios";

// If you ever deploy, set REACT_APP_API_BASE in frontend/.env
// For local dev this will always work:
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:5000";

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Optional: attach token automatically
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("cec_token", token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem("cec_token");
  }
};

// Load token on boot (if exists)
const bootToken = localStorage.getItem("cec_token");
if (bootToken) setAuthToken(bootToken);

const safeData = (err) => {
  const msg =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Request failed";
  return { ok: false, message: msg };
};

export const healthCheck = async () => {
  try {
    const { data } = await api.get("/api/health");
    return data;
  } catch (e) {
    return safeData(e);
  }
};

export const signupUser = async (email, password) => {
  try {
    const { data } = await api.post("/api/signup", { email, password });
    // backend may or may not return token on signup — handle both
    if (data?.token) setAuthToken(data.token);
    return data;
  } catch (e) {
    return safeData(e);
  }
};

export const loginUser = async (email, password) => {
  try {
    const { data } = await api.post("/api/login", { email, password });
    if (data?.token) setAuthToken(data.token);
    return data;
  } catch (e) {
    return safeData(e);
  }
};

export const logoutUser = async () => {
  // if you later add /api/logout, call it here.
  setAuthToken(null);
  return { ok: true };
};

// Used by AuthContext to restore session
export const checkAuth = async () => {
  try {
    // Add this route on backend when ready. For now, try a safe call.
    // If you don't have /api/me yet, we fallback to token presence.
    const token = localStorage.getItem("cec_token");
    if (!token) return { ok: false };

    // If your backend DOES have /api/me, this will work:
    const { data } = await api.get("/api/me");
    return data;

    // If it doesn't exist yet, comment the 2 lines above and use:
    // return { ok: true, email: "logged-in" };
  } catch (e) {
    // If /api/me 404s right now, don't spam the app:
    const status = e?.response?.status;
    if (status === 404) {
      const token = localStorage.getItem("cec_token");
      return token ? { ok: true } : { ok: false };
    }
    return safeData(e);
  }
};

// IMPORTANT: some of your files previously tried: import api from "../api"
export default api;
