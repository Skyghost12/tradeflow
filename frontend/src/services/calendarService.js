import api from "./api";

export const getEconomicCalendar = async (params = {}) => {
  const { data } = await api.get("/calendar", { params });
  return data.events;
};
