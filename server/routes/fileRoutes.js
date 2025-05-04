const express = require('express');
const router = express.Router();
const { uploadFile, getFile, getQRCode } = require('../controllers/filecontroller');
const upload = require('../middleware/upload');

router.post('/upload', upload.single('file'), uploadFile);
router.get('/files/:id', getFile);
router.get('/qrcode/:id', getQRCode);

module.exports = router;