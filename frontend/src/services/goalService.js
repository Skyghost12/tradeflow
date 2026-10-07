import api from "./api";

export const getGoals = async (timeframe) => {
  const { data } = await api.get("/goals", { params: timeframe ? { timeframe } : {} });
  return data.goals;
};

export const createGoal = async (payload) => {
  const { data } = await api.post("/goals", payload);
  return data.goal;
};

export const updateGoal = async (id, payload) => {
  const { data } = await api.put(`/goals/${id}`, payload);
  return data.goal;
};

export const deleteGoal = async (id) => {
  await api.delete(`/goals/${id}`);
};
