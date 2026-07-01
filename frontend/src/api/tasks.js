import axios from "axios";

// In dev, VITE_API_URL is empty and requests hit "/api/..." which Vite
// proxies to the backend. In production, set VITE_API_URL to the deployed
// backend origin (e.g. https://tasker-api.onrender.com).
const baseURL = `${import.meta.env.VITE_API_URL || ""}/api`;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

/** Normalize axios errors into a plain Error with a useful message. */
const toError = (err) => {
  const data = err.response?.data;
  const message =
    (data?.errors && data.errors.join(", ")) ||
    data?.message ||
    err.message ||
    "Something went wrong";
  return new Error(message);
};

export const getTasks = async () => {
  try {
    const { data } = await api.get("/tasks");
    return data;
  } catch (err) {
    throw toError(err);
  }
};

export const createTask = async (task) => {
  try {
    const { data } = await api.post("/tasks", task);
    return data;
  } catch (err) {
    throw toError(err);
  }
};

export const updateTask = async (id, task) => {
  try {
    const { data } = await api.put(`/tasks/${id}`, task);
    return data;
  } catch (err) {
    throw toError(err);
  }
};

export const deleteTask = async (id) => {
  try {
    const { data } = await api.delete(`/tasks/${id}`);
    return data;
  } catch (err) {
    throw toError(err);
  }
};
