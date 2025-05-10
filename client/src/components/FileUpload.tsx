
import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { uploadFile } from '../utils/api';
import type { File as CustomFile } from '../types';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
  ];

  const handleFileChange = (selectedFile: File) => {
    const extension = selectedFile.name
      .slice(selectedFile.name.lastIndexOf('.'))
      .toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      setError(
        'Invalid file type. Allowed: PDF, DOCX, JSON, MP4, AVI, MKV, MOV, WEBM, TXT, PNG, JPG'
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
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-all duration-300 ${
              isDragging
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-full cursor-pointer"
            >
              <FileText className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-3" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {file ? file.name : 'Drop files here or click to upload'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
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
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
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
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                disabled={uploading}
              />
            </div>
            <button
              type="submit"
              disabled={uploading || !file}
              className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
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
              className="flex items-center text-sm text-red-600 dark:text-red-400"
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