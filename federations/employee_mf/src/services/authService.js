import authApi from "../api/authApi";

export const getRoles = async () => {
  const response = await authApi.get("/Roles");
  console.log(response);
  return response.data;
};

export const createUser = async (payload) => {
  const response = await authApi.post("/users", payload);
  return response.data;
};
