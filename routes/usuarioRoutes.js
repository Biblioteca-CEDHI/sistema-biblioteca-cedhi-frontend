const express = require('express');
const router = express.Router();
const{getAllUsuarios,addUsuarioCedhi,updateUsuarioCedhi,deleteUsuarioCedhi} = require('../controllers/usuariosController');

router.get('/getAllUsuariosCedhi',getAllUsuarios);

router.post('/addUsuarioCedhi',addUsuarioCedhi);

router.put('/updateUsuarioCedhi',updateUsuarioCedhi);

router.delete('/deleteUSuarioCedhi/:codigo',deleteUsuarioCedhi);

module.exports = router;
