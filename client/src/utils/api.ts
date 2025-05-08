import axios from 'axios';
import { API_URL } from '../config';
import type { File } from '../types';

const api = axios.create({
  baseURL: `${API_URL}/api/files`,
});

export const uploadFile = async (file: File, expiryDays: number) => {
  const formData = new FormData();
  formData.append('file', file as unknown as Blob);
  formData.append('expiryDays', expiryDays.toString());
  const response = await api.post('/upload', formData);
  return response.data.data as File;
};

export const getFiles = async () => {
  const response = await api.get('/');
  return response.data as File[];
};

export const getFileById = async (id: string) => {
  const response = await api.get(`/${id}`);
  return response.data as File;
};

export const downloadFile = async (id: string) => {
  window.location.href = `${API_URL}/api/files/file/${id}`;
};

export const deleteFile = async (id: string) => {
  await api.delete(`/${id}`);
};
