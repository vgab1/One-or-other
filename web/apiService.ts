import axios from "axios";
import API_BASE_URL from "./api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const saveChoice = async (nome: string, escolha: string) => {
  const response = await api.post("/escolha", { nome, escolha });
  return response.data;
};

export const getChoices = async () => {
  const response = await api.get("/escolhas");
  return response.data;
};

export default api;