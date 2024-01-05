const { check } = require("express-validator");

exports.signUpValidation = [
  check("name", "O campo 'name' é obrigatório.").not().isEmpty(),
  check("email", "O campo 'email' deve ser um endereço de e-mail válido.")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),

  check(
    "password",
    "O campo 'password' deve ter pelo menos 8 caracteres."
  ).isLength({ min: 8 }),
];

exports.loginValidation = [
  check("name", "O campo 'name' é obrigatório.").not().isEmpty(),
  check(
    "password",
    "O campo 'password' deve ter pelo menos 8 caracteres."
  ).isLength({ min: 8 }),
];
