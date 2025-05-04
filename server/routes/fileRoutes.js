// routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../midddleware/upload');
const { uploadFile, downloadFile, generateQR } = require('../controllers/filecontroller');

router.post('/upload', upload.single('file'), uploadFile);
router.get('/download/:filename', downloadFile);
router.get('/qr/:filename', generateQR);

module.exports = router;
