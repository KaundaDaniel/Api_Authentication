const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../config/dbConnection");
const randomString = require("randomstring");
const sendMail = require("../helpers/SendEmail");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const existingUser = await db.query(
      "SELECT * FROM user WHERE LOWER(email) = LOWER(?)",
      [req.body.email]
    );

    if (existingUser.length > 0) {
      return res.status(400).send({
        msg: "Este email já está cadastrado!",
      });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const result = await db.query(
      "INSERT INTO user (name, email, password) VALUES (?, ?, ?)",
      [req.body.name, req.body.email, hashedPassword]
    );

    const randomToken = randomString.generate();
    //const content = `<p>${req.body.name}, clique no link para a verificação do email <a href="http://127.0.0.1:3000/email-verification?token=${randomToken}"></a></p>`;

    // await sendMail(req.body.email, 'Verificação de Email', content);

    db.query("UPDATE user SET token=? WHERE email=?", [
      randomToken,
      req.body.email,
    ]);

    return res.status(200).json({
      msg: "Usuário cadastrado com sucesso",
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).send({ msg: "Erro no servidor" });
  }
};

const login = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, password } = req.body;

    db.query("SELECT * FROM user WHERE name = ?", [name], (err, result) => {
      if (err) {
        console.error("Erro na consulta:", err);
        return res.status(500).send({ msg: "Erro no servidor" });
      }

      if (result.length === 0) {
        return res.status(401).send({ msg: "Nome ou senha incorretos" });
      }

      const hashedPassword = result[0].password;

      bcrypt.compare(password, hashedPassword, (bErr, bResult) => {
        if (bErr) {
          console.error("Erro na comparação de senha:", bErr);
          return res.status(500).send({ msg: "Erro no servidor" });
        }

        if (bResult) {
          const token = jwt.sign(
            { id: result[0].id, is_admin: result[0].is_admin },
            JWT_SECRET,
            { expiresIn: "1h" }
          );

          db.query(
            "UPDATE user SET last_login = NOW() WHERE id = ?",
            [result[0].id],
            (updateErr) => {
              if (updateErr) {
                console.error("Erro ao atualizar o último login:", updateErr);
              }
            }
          );

          return res.status(200).send({
            msg: "Bem-vindo à Pátria",
            token,
            user: result[0],
          });
        }

        return res.status(401).send({ msg: "Nome ou senha incorretos" });
      });
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).send({ msg: "Erro no servidor" });
  }
};

const getUser = (req, res) => {
  try {
    const authToken = req.headers.authorization.split(" ")[1];
    
    if (!authToken) {
      return res.status(401).send({ success: false, message: "Token não fornecido" });
    }

    const decode = jwt.verify(authToken, JWT_SECRET);

    db.query(
      "SELECT * FROM user WHERE id = ?",
      [decode.id],
      function (error, result, fields) {
        if (error) {
          console.error("Erro ao buscar usuário:", error);
          return res.status(500).send({ success: false, message: "Erro no servidor" });
        }

        if (!result || result.length === 0) {
          return res.status(404).send({ success: false, message: "Usuário não encontrado" });
        }

        return res.status(200).send({ success: true, data: result[0], message: "Fetch com sucesso" });
      }
    );
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return res.status(401).send({ success: false, message: "Token inválido" });
  }
};

module.exports = {
  getUser,
};

module.exports = {
  login,
  register,
  getUser,
};
