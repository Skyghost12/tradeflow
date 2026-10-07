import api from "./api";

export const getNotes = async (params = {}) => {
  const { data } = await api.get("/notes", { params });
  return data.notes;
};

export const createNote = async (payload) => {
  const { data } = await api.post("/notes", payload);
  return data.note;
};

export const updateNote = async (id, payload) => {
  const { data } = await api.put(`/notes/${id}`, payload);
  return data.note;
};

export const deleteNote = async (id) => {
  await api.delete(`/notes/${id}`);
};
