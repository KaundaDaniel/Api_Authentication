require("dotenv").config(); // Importa as variáveis de ambiente do arquivo .env

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

var mysql = require("mysql");

var conn = mysql.createConnection({
  host: DB_HOST,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
});

conn.connect(function (err) {
  if (err) {
    console.error("Erro de conexão com o banco de dados:", err.message);
    console.log("DB_HOST:", DB_HOST);
    console.log("DB_USERNAME:", DB_USERNAME);
    console.log("DB_PASSWORD:", DB_PASSWORD);
    console.log("DB_NAME:", DB_NAME);

    throw err;
  }
  console.log("Conexão com o banco de dados bem-sucedida");
});

module.exports = conn;
