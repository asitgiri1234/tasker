import api, { toError } from "./client";

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
