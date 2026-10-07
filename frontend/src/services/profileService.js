import api from "./api";

export const updateProfile = async (payload) => {
  const { data } = await api.put("/profile", payload);
  return data.user;
};

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const { data } = await api.post("/profile/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.avatar;
};

export const updateWatchlist = async (pairs) => {
  const { data } = await api.put("/profile/watchlist", { pairs });
  return data.watchlist;
};
