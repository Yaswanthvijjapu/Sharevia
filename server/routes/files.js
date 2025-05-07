import express from 'express';
import { 
  uploadFile, 
  getFiles, 
  getFileById, 
  downloadFile, 
  deleteFile,
  upload
} from '../controllers/filecontroller.js';

const router = express.Router();

// 1. Upload
router.post('/upload', upload.single('file'), uploadFile);

// 2. List all files
router.get('/', getFiles); // Removed protect

// 3. Download by ID
router.get('/file/:id', downloadFile);

// 4. Delete by ID
router.delete('/:id', deleteFile); // Removed protect

// 5. Get metadata by ID
router.get('/:id', getFileById);

export default router;