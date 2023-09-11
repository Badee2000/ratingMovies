const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Rating = require("../models/Rating");
const catchAsync = require("../utils/catchAsync");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const AppError = require("../utils/AppError");

dotenv.config({ path: "./config.env" });

//TOKEN
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const id = user.dataValues.id;
  const token = signToken(id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from the output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    attributes: {
      exclude: [
        "password",
        "passwordConfirm",
        "role",
        "createdAt",
        "updatedAt",
      ],
    },
  });
  res.status(200).json({
    status: "success",
    users: users,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    attributes: {
      exclude: [
        "password",
        "passwordConfirm",
        "role",
        "createdAt",
        "updatedAt",
      ],
    },
    where: { id: req.params.id },
  });
  res.status(200).json({
    status: "success",
    user: user,
  });
});

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please insert email and password!");
  }
  const user = await User.findOne({ where: { email: email } });

  if (!user || !(await user.correctPassword(password, user.Password))) {
    return next(new AppError("Incorrect emai or password", 401));
  }

  createSendToken(user, 200, res);
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.update(
    {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  );
  res.status(200).json({
    status: "success",
    user: user,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.update(
    { status: "inactive" },
    { where: { id: req.params.id } }
  );
  res.status(200).json({
    status: "success",
    user: user,
  });
});

exports.sendEmail = async (req, res) => {
  const { recipient, subject, text } = req.body;
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Configure the email options
  const mailOptions = {
    from: "ada49@ethereal.email",
    to: recipient,
    subject: subject,
    text: text,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.send("Email sent successfully");
    }
  });
};
