import axiosInstance from "./axiosInstance";
import { getCookie } from "./cookie";

const registerUser = (formData) => {
  return axiosInstance.post("/auth/register", formData);
};

export const loginUser = (formData) => {
  return axiosInstance.post("/auth/login", formData);
};

export const createProduct = (formData) => {
  return axiosInstance.post("/products", formData);
};
export const getProducts = ({ page = 1, limit = 10, name }) => {
  const params = { page, limit };

  if (name && name.trim() !== "") {
    params.name = name.trim();
  }

  return axiosInstance.get("/products", { params });
};

export const deleteProduct = (id) => {
  return axiosInstance.delete(`/products/${id}`);
};
export const editProduct = (id, formData) => {
  return axiosInstance.put(`/products/${id}`, formData);
};

export { registerUser };
export default loginUser;
