import api from "./api";

export const assetsService = {
  getAll: (params) => api.get("/assets", { params }).then((res) => res.data),
  create: (asset) => api.post("/assets", asset).then((res) => res.data),
  update: (id, asset) => api.put(`/assets/${id}`, asset).then((res) => res.data),
  remove: (id) => api.delete(`/assets/${id}`)
};
