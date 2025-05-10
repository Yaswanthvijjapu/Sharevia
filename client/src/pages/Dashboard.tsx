
import React, { useEffect, useState } from 'react';
import type { File as CustomFile } from '../types';
import { getFiles } from '../utils/api';
import FileCard from '../components/FileCard';
import FileUpload from '../components/FileUpload';
import Loader from '../components/Loader';
import { AxiosError } from 'axios';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<CustomFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFiles();
      setFiles(data);
    } catch (err) {
      console.error('Error fetching files:', err);
      if (err instanceof AxiosError) {
        setError(err.response?.status === 404 ? 'No files found.' : 'Failed to load files.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (file: CustomFile) => {
    setFiles((prev) => [file, ...prev]);
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((file) => file._id !== id));
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Your Files
        </h1>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4"
          >
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}
        {files.length === 0 && !error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-lg text-slate-500 dark:text-slate-400">
              No files uploaded yet. Start by uploading a file above!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {files.map((file) => (
              <FileCard key={file._id} file={file} onDelete={handleDelete} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;