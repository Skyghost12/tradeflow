import api, { setAccessToken } from "./api";

export const signupRequest = async (payload) => {
  const { data } = await api.post("/auth/signup", payload);
  setAccessToken(data.accessToken);
  return data.user;
};

export const loginRequest = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  setAccessToken(data.accessToken);
  return data.user;
};

export const logoutRequest = async () => {
  await api.post("/auth/logout");
  setAccessToken(null);
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
};

export const forgotPasswordRequest = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data.message;
};

export const resetPasswordRequest = async (token, password) => {
  const { data } = await api.post(`/auth/reset-password/${token}`, { password });
  return data.message;
};

export const refreshSession = async () => {
  const { data } = await api.post("/auth/refresh");
  setAccessToken(data.accessToken);
  return data.accessToken;
};
