const express = require('express');
const router = express.Router();
const bookController = require('../controllers/requestBook');

//ruta para obtener todos los libros
router.get('/all',bookController.requestBooks);

//ruta para buscar un libro
router.get('/:registro',bookController.requestBook);

//ruta para agregar un libro
router.post('/addBook',bookController.addBook);

//ruta para agregar libros masivamente

//ruta para modificar o actualizar datos de un libro
router.put('/updateBook',bookController.updateBook);

//ruta para eliminar libros
router.delete('/deleteBook/:registro',bookController.deleteBook);

module.exports = router;