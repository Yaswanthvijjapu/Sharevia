import React, { useState, useContext } from 'react';
import { File, Trash2, Download, FileText, Video, Code, Image } from 'lucide-react';
import { type File as CustomFile } from '../types';
import { formatFileSize, formatDate } from '../utils/formatters';
import { deleteFile, downloadFile } from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { ThemeContext } from '../context/ThemeContext';

interface FileCardProps {
  file: CustomFile;
  onDelete: (id: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onDelete }) => {
  const [showDownloadQR, setShowDownloadQR] = useState(false);
  const { isDarkMode } = useContext(ThemeContext);

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />;
    if (type.includes('wordprocessingml.document')) return <FileText className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />;
    if (type.includes('json')) return <Code className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />;
    if (type.includes('video')) return <Video className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />;
    if (type.includes('image')) return <Image className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />;
    return <File className={`h-8 w-8 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />;
  };

  const handleDelete = async () => {
    try {
      await deleteFile(file._id);
      onDelete(file._id);
      toast.success('File deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleDownload = async () => {
    try {
      await downloadFile(file._id, file.name);
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('This file appears to be damaged or invalid.');
    }
  };

  const downloadUrl = `${window.location.origin}/api/files/file/${file._id}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-200`}
    >
      <div className="flex items-center space-x-4">
        {getFileIcon(file.type)}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'} truncate`}>
            {file.name}
          </p>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {formatFileSize(file.size)} • {formatDate(file.createdAt)}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className={`p-2 ${isDarkMode ? 'text-indigo-400 hover:bg-indigo-900/20' : 'text-indigo-600 hover:bg-indigo-50'} rounded-full transition-colors`}
            title="Download"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowDownloadQR(!showDownloadQR)}
            className={`p-2 ${isDarkMode ? 'text-indigo-400 hover:bg-indigo-900/20' : 'text-indigo-600 hover:bg-indigo-50'} rounded-full transition-colors`}
            title="Download QR"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <path d="M10 3h4v18h-4z" />
              <path d="M3 10h18v4H3z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className={`p-2 ${isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'} rounded-full transition-colors`}
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      {showDownloadQR && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          className={`absolute top-0 left-0 w-full h-full ${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-xl flex flex-col items-center justify-center z-10`}
        >
          <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
            Scan to download
          </p>
          <QRCode
            value={downloadUrl}
            size={100}
            bgColor="#ffffff"
            fgColor="#1e293b"
            level="H"
            includeMargin={true}
            className={`p-2 border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} rounded-lg`}
          />
          <button
            onClick={() => setShowDownloadQR(false)}
            className={`mt-2 text-sm ${isDarkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
          >
            Close
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FileCard;