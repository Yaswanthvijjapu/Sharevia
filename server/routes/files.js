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

// 1. Upload
router.post('/upload', upload.single('file'), uploadFile);

// 2. List all files
router.get('/', protect, getFiles);

// 3. Download by ID
router.get('/file/:id', downloadFile); // Adjusted to match second set's route

// 4. Delete by ID
router.delete('/:id', protect, deleteFile);

// 5. Get metadata by ID
router.get('/:id', getFileById);

export default router;