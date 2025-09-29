const express =require('express');
const router = express.Router();
const {estadisticaLibros,estadisticaUsuarios,getTotal} = require('../controllers/estadisicasController')

router.get('/libros',estadisticaLibros);

router.get('/usuarios',estadisticaUsuarios);

router.get('/getTotal',getTotal);


module.exports = router;