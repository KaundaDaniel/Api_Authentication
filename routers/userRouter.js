const express = require("express");
const router = express.Router();

const { signUpValidation, loginValidation } = require("../helpers/validator");

const userController = require("../controllers/UserController");

router.post("/register", signUpValidation, userController.register);
router.post("/login", loginValidation, userController.login);
router.get("/get-user", userController.getUser);

module.exports = router;
