import api, { toError } from "./client";

export const register = async (payload) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data; // { token, user }
  } catch (err) {
    throw toError(err);
  }
};

export const login = async (payload) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    return data; // { token, user }
  } catch (err) {
    throw toError(err);
  }
};
