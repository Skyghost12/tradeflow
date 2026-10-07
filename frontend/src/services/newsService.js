import api from "./api";

export const getMarketNews = async (currency) => {
  const { data } = await api.get("/news", { params: currency ? { currency } : {} });
  return data.news;
};
