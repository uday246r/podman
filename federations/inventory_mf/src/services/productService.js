import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const getToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = async () => {
  const response = await api.get("/product");
  return response.data;
};

export const createProduct = async (product) => {
  const response = await api.post(
    "/product",
    product
  );

  return response.data;
};

export const updateProduct = async (
  id,
  product
) => {
  const response = await api.put(
    `/product/${id}`,
    product
  );

  return response.data;
};

export const deleteProduct = async (
  id
) => {
  await api.delete(`/product/${id}`);
};