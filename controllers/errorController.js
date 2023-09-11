const AppError = require("../utils/AppError");

const SequelizeUniqueConstraintError = (err) => {
  const value = err.errors[0].message;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const SequelizeValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    // console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(err.statusCode).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    //We here send the meaningful error messages to the client
    let error = { ...err };

    if (err.name === "SequelizeUniqueConstraintError")
      error = SequelizeUniqueConstraintError(error);
    if (err.name === "SequelizeValidationError")
      error = SequelizeValidationError(error);

    sendErrorProd(error, res);
  }
};
