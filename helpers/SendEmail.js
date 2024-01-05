const nodemailer = require("nodemailer");
const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

const sendEmail = async (email, emailSubject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      requireTLS: true,
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: SMTP_EMAIL,
      to: email,
      subject: emailSubject,
      html: content,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email enviado com sucesso:", info.response);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error.message);
    throw error;
  }
};

module.exports = sendEmail;
