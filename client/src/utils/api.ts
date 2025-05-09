
  import axios from 'axios';
  import { API_URL } from '../config';
  import type { File as CustomFile } from '../types';

  const api = axios.create({
    baseURL: `${API_URL}/api/files`,
  });

  export const uploadFile = async (file: File, expiryDays: number) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('expiryDays', expiryDays.toString());
    try {
      const response = await api.post('/upload', formData);
      return response.data.data as CustomFile;
    } catch (error) {
      console.error('API upload error:', error);
      throw error;
    }
  };

  export const getFiles = async () => {
    const response = await api.get('/');
    return response.data as CustomFile[];
  };

  export const getFileById = async (id: string) => {
    const response = await api.get(`/${id}`);
    return response.data as CustomFile;
  };

  export const downloadFile = async (id: string, name: string) => {
    try {
      // Trigger download by opening the URL in a new tab
      const url = `${API_URL}/api/files/file/${id}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  };

  export const deleteFile = async (id: string) => {
    await api.delete(`/${id}`);
  };