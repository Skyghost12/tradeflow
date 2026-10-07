import api from "./api";

export const getTrades = async (params = {}) => {
  const { data } = await api.get("/trades", { params });
  return data;
};

export const getTradeById = async (id) => {
  const { data } = await api.get(`/trades/${id}`);
  return data.trade;
};

export const createTrade = async (payload) => {
  const { data } = await api.post("/trades", payload);
  return data.trade;
};

export const updateTrade = async (id, payload) => {
  const { data } = await api.put(`/trades/${id}`, payload);
  return data.trade;
};

export const deleteTrade = async (id) => {
  await api.delete(`/trades/${id}`);
};
