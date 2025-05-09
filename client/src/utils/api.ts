
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
    try {
      const response = await api.get('/');
      return response.data as CustomFile[];
    } catch (error) {
      console.error('Error fetching files:', error);
      throw error;
    }
  };

  export const getFileById = async (id: string) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data as CustomFile;
    } catch (error) {
      console.error('Error fetching file by ID:', error);
      throw error;
    }
  };

  export const downloadFile = async (id: string, filename: string) => {
    try {
      const response = await api.get(`/file/${id}`, {
        responseType: 'blob',
      });
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const blob = new Blob([response.data], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  };

  export const deleteFile = async (id: string) => {
    try {
      await api.delete(`/${id}`);
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  };