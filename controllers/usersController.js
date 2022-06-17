const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Email = require("../models/emailModel");
const nodemailer = require("nodemailer");

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "Такой пользователь уже зарегистрирован" });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    const tempMail = await setTempEmail(user._id, user.email);

    // launch verification email process
    const verEmail = await sendVerificationEmail(
      tempMail.email,
      tempMail.jwtToken
    );

    return res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      // token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: "Что-то пошло не так..." });
    // throw new Error("Что-то пошло не так...");
  }
});
// Generate JWT
const generateToken = (id, email, name) => {
  return jwt.sign({ id, email, name }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

// Create temporary email record for confirmation in DB
const setTempEmail = async (id, email) => {
  try {
    const emailRecord = await Email.create({
      email: email,
      jwtToken: generateEmailToken(id),
    });
    if (emailRecord) {
      return emailRecord;
    }
    // return tempEmail;
  } catch (error) {
    throw new Error("Ошибка при регистрации аккаунта");
  }
};
// Generate JWT for email confirmation
const generateEmailToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    port: 465, // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
      user: "ivanovv.tca@gmail.com",
      pass: process.env.GMAIL_PASS,
    },
    secure: true,
  });

  const mailData = {
    from: "ivanovv.tca@gmail.com", // sender address
    to: email, // list of receivers
    subject: "Подтверждение адреса электронной почты портала corp.baigroupkz",
    text: "Перейдите по ссылке:",
    html: `<a href=http://localhost:5000/.netlify/functions/api/users/verify-email?token=${token}&email=${email}>Ссылка для подтверждения почты</a>`,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const cookies = req.cookies;

  if (!email || !password) {
    return res.status(400).json({ message: "Не получены email или пароль" });
  }

  // Check for user email
  const foundUser = await User.findOne({ email });
  if (!foundUser) return res.sendStatus(401);

  if (foundUser.confirmed) {
    if (await bcrypt.compare(password, foundUser.password)) {
      const { _id, name, email } = foundUser;
      const accessToken = generateToken({ _id, name, email });
      const newRefreshToken = jwt.sign(
        { name: foundUser.name, email: foundUser.email },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "2d" }
      );

      let newRefreshTokenArray = !cookies.jwt
        ? foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

      if (cookies.jwt) {
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        // Detected refresh token reuse!
        if (!foundToken) {
          // clear out ALL previous refresh tokens
          newRefreshTokenArray = [];
        }

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
      }
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.json({
        accessToken,
        name: result.name,
        email: result.email,
        id: result._id,
      });
    }
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(req.user);
});

// @desc Get token data in DB for mail being verified
const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.query.token;
  const email = req.query.email;

  const update = { confirmed: true };
  const tempEmail = await Email.find({ token });
  if (tempEmail) {
    const confirmUser = await User.findOneAndUpdate(email, update);
    if (confirmUser) {
      const deleteTemp = await Email.findOneAndDelete({ token });
      if (deleteTemp) {
        res.redirect("http://localhost:3000/login");
      }
    }
  }
});

module.exports = {
  registerUser,

  loginUser,
  getMe,
  verifyEmail,
};
