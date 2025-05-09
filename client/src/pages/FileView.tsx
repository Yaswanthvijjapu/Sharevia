
  import React, { useEffect, useState } from 'react';
  import { Link, useParams } from 'react-router-dom';
  import { File as FileIcon, Download, ChevronLeft } from 'lucide-react';
  import type { File as CustomFile } from '../types';
  import { getFileById, downloadFile } from '../utils/api';
  import { formatFileSize, formatDate } from '../utils/formatters';
  import Loader from '../components/Loader';
  import { AxiosError } from 'axios';

  const FileView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [file, setFile] = useState<CustomFile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (id) {
        fetchFileDetails(id);
      }
    }, [id]);

    const fetchFileDetails = async (fileId: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFileById(fileId);
        setFile(data);
      } catch (err: any) {
        console.error('Error fetching file details:', err);
        setError(err.response?.status === 404 ? 'File not found or expired.' : 'Failed to load file details.');
      } finally {
        setLoading(false);
      }
    };

    const handleDownload = async () => {
      if (!file) return;
      try {
        await downloadFile(file._id, file.name); // Use file.uniqueId if needed
      } catch (err) {
        console.error('Download error:', err);
        if (err instanceof AxiosError) {
          setError(err.response?.status === 404 ? 'File not found or expired.' : 'This file appears to be damaged or invalid.');
        } else {
          setError('An unexpected error occurred during download.');
        }
      }
    };

    if (loading) return <Loader />;

    if (error) {
      return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-md p-6">
            <h2 className="text-xl font-medium text-red-700 dark:text-red-400 mb-3">{error}</h2>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    if (!file) return null;

    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
        </div>
        <div className="bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 flex items-center justify-center bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
                <FileIcon className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 break-all">{file.name}</h1>
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-1">
                <span>{formatFileSize(file.size)}</span>
                <span className="mx-2">•</span>
                <span>Downloaded {file.downloadCount} times</span>
              </div>
              <div className="flex items-center text-sm text-amber-600 dark:text-amber-400 mb-6">
                <span>Expires {formatDate(file.expiresAt)}</span>
              </div>
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download File
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default FileView;