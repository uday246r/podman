import api from "./api";

export const employeesService = {
  getAll: (params) => api.get("/employees", { params }).then((res) => res.data),
  create: (employee) => api.post("/employees", employee).then((res) => res.data),
  update: (id, employee) => api.put(`/employees/${id}`, employee).then((res) => res.data),
  remove: (id) => api.delete(`/employees/${id}`)
};
