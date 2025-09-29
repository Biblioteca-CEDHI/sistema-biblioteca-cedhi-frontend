const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processCSV,updateBooksMassive,processXLSXUsers } = require('../controllers/csvReader');

// Configuración básica de multer para almacenar archivos en 'uploads'
const upload = multer({ dest: 'uploads/' });

// Ruta para procesar el CSV
//router.post('/upload-csv', upload.single('file'), processCSV);

router.post('/upload-xlsx',upload.single('file'),updateBooksMassive);

router.post('/upload-xlsx-users',upload.single('file'),processXLSXUsers);

module.exports = router;
