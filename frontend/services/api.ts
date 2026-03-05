import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export const uploadDataset = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post(`${API_BASE}/ml/upload`, formData);
};

export const trainModel = (target_column: string) => {
  return axios.post(`${API_BASE}/ml/train`, null, {
    params: { target_column }
  });
};

export const queryRAG = (query: string) => {
  return axios.post(`${API_BASE}/rag/query`, { query });
};