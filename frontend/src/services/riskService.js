import api from "./api";

export const calculateRisk = async (payload) => {
  const { data } = await api.post("/risk-calculator", payload);
  return data.result;
};
