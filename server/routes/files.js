import express from 'express';
import { 
  uploadFile, 
  getFiles, 
  getFileById, 
  downloadFile, 
  deleteFile,
  upload
} from '../controllers/filecontroller.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Upload (specific)
router.post('/upload', upload.single('file'), uploadFile);

// 2. List all files (specific)
router.get('/', protect, getFiles);

// 3. Download by ID (specific)
router.get('/download/:id', downloadFile);

// 4. Delete by ID (specific + protected)
router.delete('/:id', protect, deleteFile);

// 5. Get metadata by ID (generic — goes last)
router.get('/:id', getFileById);

export default router;
 