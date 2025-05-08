import React from 'react';
import { File as FileIcon, Trash2 } from 'lucide-react';
import type { File } from '../types';
import { formatFileSize, formatDate } from '../utils/formatters';
import { deleteFile } from '../utils/api';

interface FileCardProps {
  file: File;
  onDelete: (id: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onDelete }) => {
  const handleDelete = async () => {
    try {
      await deleteFile(file._id);
      onDelete(file._id);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete file');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm p-4">
      <div className="flex items-center space-x-3">
        <FileIcon className="h-8 w-8 text-primary-500" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{file.name}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {formatFileSize(file.size)} • Uploaded {formatDate(file.createdAt)}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FileCard;
