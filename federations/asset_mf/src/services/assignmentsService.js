import api from "./api";

export const assignmentsService = {
  getAll: () => api.get("/assignments").then((res) => res.data),
  assign: (assignment) => api.post("/assignments", assignment).then((res) => res.data),
  returnAsset: (id) => api.post(`/assignments/${id}/return`)
};
