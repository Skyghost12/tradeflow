import api from "./api";

export const getLogs = async () => {
  const { data } = await api.get("/psychology");
  return data.logs;
};

export const createLog = async (payload) => {
  const { data } = await api.post("/psychology", payload);
  return data.log;
};

export const getPsychologyReport = async () => {
  const { data } = await api.get("/psychology/report");
  return data.report;
};
