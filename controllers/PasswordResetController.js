const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Email = require("../models/emailModel");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");

const PasswordReset = asyncHandler(async (req, res) => {
  if (!req.body.email) {
    res.status(400).json({ message: "email не предоставлен" });
  }
  try {
    const userFound = await User.findOne(req.body).exec();
    const { _id, email, name } = userFound;
    if (!userFound) {
      res.status(401).json({ message: "Пользователь не зарегистрирован" });
    } else {
      const tempToken = await generateTempEmail(_id, email, name);
      const emailed = await sendPasswordResetEmail(email, tempToken);
      res.status(200).json({
        message: `${userFound.name}, на вашу почту отправлена ссылка для смены пароля.`,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

async function generateTempEmail(id, email, name) {
  try {
    const token = generateToken(id);
    const tempEmail = await Email.create({ email: email, jwtToken: token });
    return token;
  } catch (error) {
    console.error(error);
  }
}

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: "smtp.yandex.ru",
    auth: {
      user: "admin@baigroupkz.com",
      pass: process.env.YANDEX_PASS,
    },
    secure: true,
  });
  const mailData = {
    from: "admin@baigroupkz.com", // sender address
    to: email, // list of receivers
    subject: `Смена пароля для учетной записи ${email} портала corp-baigroupkz`,
    text: "Перейдите по ссылке:",
    html: `<a href=http://localhost:3000/reset-password-confirm?token=${token}>Ссылка для подтверждения почты</a>`,
  };
  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
};

const confirmReset = asyncHandler(async (req, res) => {
  const { password, accessToken } = req.body;
  const userId = jwt.decode(accessToken, process.env.JWT_SECRET);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findByIdAndUpdate(
      { _id: userId.id },
      { password: hashedPassword }
    ).exec();

    const emailTempDelete = await Email.findOneAndDelete({
      accessToken: accessToken,
    });

    res.status(200).send();
  } catch (error) {
    res.status(500).send();
    console.error(error);
  }
});

module.exports = { PasswordReset, confirmReset };
