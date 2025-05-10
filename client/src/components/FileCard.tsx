
import React from 'react';
import { File, Trash2, Download, FileText, Video, Code, Image } from 'lucide-react';
import type { File as CustomFile } from '../types';
import { formatFileSize, formatDate } from '../utils/formatters';
import { deleteFile, downloadFile } from '../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface FileCardProps {
  file: CustomFile;
  onDelete: (id: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onDelete }) => {
  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-primary-600" />;
    if (type.includes('wordprocessingml.document')) return <FileText className="h-8 w-8 text-primary-600" />;
    if (type.includes('json')) return <Code className="h-8 w-8 text-primary-600" />;
    if (type.includes('video')) return <Video className="h-8 w-8 text-primary-600" />;
    if (type.includes('image')) return <Image className="h-8 w-8 text-primary-600" />;
    return <File className="h-8 w-8 text-primary-600" />;
  };

  const handleDelete = async () => {
    try {
      await deleteFile(file._id); // Use file.uniqueId if needed
      onDelete(file._id);
      toast.success('File deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete file');
    }
  };

  const handleDownload = async () => {
    try {
      await downloadFile(file._id, file.name); // Use file.uniqueId if needed
      toast.success('Download started!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('This file appears to be damaged or invalid.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center space-x-4">
        {getFileIcon(file.type)}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
            {file.name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {formatFileSize(file.size)} • {formatDate(file.createdAt)}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleDownload}
            className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full transition-colors"
            title="Download"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            title="Delete"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;