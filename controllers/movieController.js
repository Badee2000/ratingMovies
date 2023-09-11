const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Rating = require("../models/Rating");
const Movie = require("../models/Movie");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

exports.addMovie = catchAsync(async (req, res, next) => {
  const movie = await Movie.create({
    title: req.body.title,
  });
  res.status(200).json({
    status: "success",
    movie: movie,
  });
});
