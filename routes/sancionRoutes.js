const express = require('express');
const router = express.Router();
const {getSanciones2,removeSancion} = require('../controllers/sanctionController');

router.get('/getSanciones',getSanciones2);

router.put('/removeSanction/:id_sancion',removeSancion);

module.exports = router;