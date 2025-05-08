import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadFile } from '../utils/api';
import type { File as CustomFile } from '../types';

interface FileUploadProps {
  onUploadSuccess: (file: CustomFile) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null); // Browser File type
  const [expiryDays, setExpiryDays] = useState('7');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const uploadedFile = await uploadFile(file, parseInt(expiryDays));
      onUploadSuccess(uploadedFile);
      setFile(null);
      setExpiryDays('7');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="file" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Select File
        </label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
        />
      </div>
      <div>
        <label htmlFor="expiryDays" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Expiry Days
        </label>
        <input
          type="number"
          id="expiryDays"
          value={expiryDays}
          onChange={(e) => setExpiryDays(e.target.value)}
          min="1"
          className="mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
      <button
        type="submit"
        disabled={!file || uploading}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </form>
  );
};

export default FileUpload;
