const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  )
    token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findOne({ where: { id: decoded.id } });

  if (!currentUser) {
    new AppError(
      "The user belonging to this token is no longer available!",
      401
    );
  }
  req.user = currentUser;
  next();
});

exports.restrictTo = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return next(
      new AppError("You don't have permission to perform this action", 403)
    );
  }
  next();
};
