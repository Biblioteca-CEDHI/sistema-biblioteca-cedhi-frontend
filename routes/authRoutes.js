const express = require("express");
const { loginWithToken }  = require("../controllers/authController");
const router = express.Router();

router.post("/token-login", loginWithToken); // recibe token desde PHP

module.exports = router;
