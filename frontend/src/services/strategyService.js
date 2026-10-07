import api from "./api";

export const getStrategies = async () => {
  const { data } = await api.get("/strategies");
  return data.strategies;
};

export const createStrategy = async (payload) => {
  const { data } = await api.post("/strategies", payload);
  return data.strategy;
};

export const updateStrategy = async (id, payload) => {
  const { data } = await api.put(`/strategies/${id}`, payload);
  return data.strategy;
};

export const deleteStrategy = async (id) => {
  await api.delete(`/strategies/${id}`);
};
