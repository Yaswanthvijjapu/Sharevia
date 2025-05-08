import React, { useEffect, useState } from 'react';
import { type File } from '../types';
import { getFiles } from '../utils/api';
import FileCard from '../components/FileCard';
import FileUpload from '../components/FileUpload';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import { Upload } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);

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
      setError('Failed to load files. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (file: File) => {
    setFiles((prev) => [file, ...prev]);
    setShowUpload(false);
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file._id !== fileId));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Files</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {files.length} {files.length === 1 ? 'file' : 'files'} stored
            </p>
          </div>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New File
          </button>
        </div>

        {showUpload && (
          <div className="mb-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-md p-4 text-center text-red-600 dark:text-red-400">
            {error}
            <button
              onClick={fetchFiles}
              className="ml-3 text-red-700 dark:text-red-300 underline focus:outline-none"
            >
              Try again
            </button>
          </div>
        ) : files.length === 0 ? (
          <EmptyState
            title="No files uploaded yet"
            description="Upload your first file to start sharing."
            onUpload={() => setShowUpload(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <FileCard key={file._id} file={file} onDelete={handleDeleteFile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
