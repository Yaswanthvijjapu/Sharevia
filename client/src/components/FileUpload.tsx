import React, { useState, useRef, useContext } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { uploadFile } from '../utils/api';
import type { File as CustomFile } from '../types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ThemeContext } from '../context/ThemeContext';

interface FileUploadProps {
  onUploadSuccess: (file: CustomFile) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [expiryDays, setExpiryDays] = useState<number>(7);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isDarkMode } = useContext(ThemeContext);

  const allowedExtensions = [
    '.pdf',
    '.docx',
    '.json',
    '.mp4',
    '.avi',
    '.mkv',
    '.mov',
    '.webm',
    '.txt',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
  ];

  const handleFileChange = (selectedFile: File) => {
    const extension = selectedFile.name
      .slice(selectedFile.name.lastIndexOf('.'))
      .toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      setError(
        'Invalid file type. Allowed: PDF, DOCX, JSON, MP4, AVI, MKV, MOV, WEBM, TXT, PNG, JPG, JPEG, GIF'
      );
      setFile(null);
    } else {
      setError(null);
      setFile(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadedFile = await uploadFile(file, expiryDays);
      onUploadSuccess(uploadedFile);
      toast.success('File uploaded successfully!');
      setFile(null);
      setExpiryDays(7);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to upload file';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6`}
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-all duration-300 ${
              isDragging
                ? isDarkMode
                  ? 'border-indigo-400 bg-indigo-900/20'
                  : 'border-indigo-600 bg-indigo-50'
                : isDarkMode
                ? 'border-slate-600 hover:bg-slate-700'
                : 'border-slate-300 hover:bg-slate-50'
            }`}
          >
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              <FileText className={`w-12 h-12 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mb-3`} />
              <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {file ? file.name : 'Drop files here or click to upload'}
              </p>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                PDF, DOCX, JSON, MP4, AVI, MKV, MOV, WEBM, TXT, PNG, JPG (max 100MB)
              </p>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0];
                  if (selectedFile) handleFileChange(selectedFile);
                }}
                disabled={uploading}
                ref={fileInputRef}
              />
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label
                htmlFor="expiry-days"
                className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1`}
              >
                Expiry (days)
              </label>
              <input
                id="expiry-days"
                type="number"
                min="1"
                max="30"
                value={expiryDays}
                onChange={(e) => setExpiryDays(parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'} focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                disabled={uploading}
              />
            </div>
            <button
              type="submit"
              disabled={uploading || !file}
              className={`mt-6 px-6 py-2 text-white rounded-lg font-medium transition-all duration-200 ${isDarkMode ? 'bg-indigo-400 hover:bg-indigo-500 disabled:bg-indigo-300 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 focus:ring-indigo-600'} disabled:cursor-not-allowed focus:outline-none focus:ring-2`}
            >
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload'}</span>
              </div>
            </button>
          </div>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex items-center text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default FileUpload;