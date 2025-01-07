import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

export const loginUser = async (username, password) => {
  return await axios.post(`${API_URL}/login`, { username, password });
};

export const fetchUsers = async () => {
  return await axios.get(`${API_URL}/users`);
};

export const deleteUser = async (id) => {
  return await axios.delete(`${API_URL}/users/${id}`);
};

export const editUser = async (id, userData) => {
  return await axios.put(`${API_URL}/users/${id}`, userData);
};
