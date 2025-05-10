
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { File, Download, ChevronLeft, FileText, Video, Code, Image } from 'lucide-react';
import type { File as CustomFile } from '../types';
import { getFileById, downloadFile } from '../utils/api';
import { formatFileSize, formatDate } from '../utils/formatters';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const FileView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [file, setFile] = useState<CustomFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadQR, setShowDownloadQR] = useState(false);

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
      toast.success('Download started!');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('This file appears to be damaged or invalid.');
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-16 w-16 text-primary-600" />;
    if (type.includes('wordprocessingml.document')) return <FileText className="h-16 w-16 text-primary-600" />;
    if (type.includes('json')) return <Code className="h-16 w-16 text-primary-600" />;
    if (type.includes('video')) return <Video className="h-16 w-16 text-primary-600" />;
    if (type.includes('image')) return <Image className="h-16 w-16 text-primary-600" />;
    return <File className="h-16 w-16 text-primary-600" />;
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4"
      >
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
          <h2 className="text-xl font-medium text-red-700 dark:text-red-300 mb-4">{error}</h2>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    );
  }

  if (!file) return null;

  const downloadUrl = `${window.location.origin}/api/files/file/${file._id}`; // Download endpoint

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center px-4"
    >
      <div className="max-w-lg w-full bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 relative">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 flex items-center justify-center bg-primary-100 dark:bg-primary-900/20 rounded-full">
              {getFileIcon(file.type)}
            </div>
          </div>
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 break-all">
            {file.name}
          </h1>
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            <span>{formatFileSize(file.size)}</span> •{' '}
            <span>{file.downloadCount} downloads</span>
          </div>
          <div className="text-sm text-amber-600 dark:text-amber-400 mb-6">
            Expires {formatDate(file.expiresAt)}
          </div>
          <button
            onClick={handleDownload}
            className="w-full px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 mb-4"
          >
            <div className="flex items-center justify-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download File</span>
            </div>
          </button>
          <button
            onClick={() => setShowDownloadQR(!showDownloadQR)}
            className="w-full px-6 py-3 bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/30 transition-colors"
          >
            <div className="flex items-center justify-center space-x-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <path d="M10 3h4v18h-4z" />
                <path d="M3 10h18v4H3z" />
              </svg>
              <span>Download QR</span>
            </div>
          </button>
        </div>
        {showDownloadQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute top-0 left-0 w-full h-full bg-white dark:bg-slate-800 rounded-xl flex flex-col items-center justify-center z-10"
          >
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Scan to download
            </p>
            <QRCode
              value={downloadUrl}
              size={128}
              bgColor="#ffffff"
              fgColor="#1e293b"
              level="H"
              includeMargin={true}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg"
            />
            <button
              onClick={() => setShowDownloadQR(false)}
              className="mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Close
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FileView;