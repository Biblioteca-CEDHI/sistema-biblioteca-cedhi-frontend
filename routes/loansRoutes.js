
const express =require('express');
const router = express.Router();
const {loanBookRegister,loansDelay,getAllLoans,loansReturn, deleteLoan} = require("../controllers/loanController");

// AGREGAR UN PRESTAMO
router.post('/addLoan',loanBookRegister);


router.get('/loansDelay',loansDelay);


//OBTENER TODOS LOS PRESTAMOS
router.get('/allLoans',getAllLoans);

router.post('/returnLoan',loansReturn);

router.delete('/deleteLoan/:id_prestamo',deleteLoan);


module.exports = router;