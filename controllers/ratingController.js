const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Rating = require("../models/Rating");
const Movie = require("../models/Movie");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

exports.addRating = catchAsync(async (req, res, next) => {
  const movieId = req.params.movieId * 1;
  const movie = await Movie.findOne({ where: { id: movieId } });
  if (!movie) {
    return next(new AppError("There is no movie with the given id!", 404));
  }
  const token = req.headers.cookie.split("=")[1];
  const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;
  console.log(userId);
  const rating = await Rating.create({
    value: req.body.value,
    comment: req.body.comment,
    userId: userId,
    movieId: movieId, // Associate the Movie
  });
  res.status(200).json({
    status: "success",
    rating: rating,
  });
});

exports.GetMyRatings = catchAsync(async (req, res, next) => {
  const token = req.headers.cookie.split("=")[1];
  const decodedToken = jwt.decode(token, process.env.JWT_SECRET);
  const userId = decodedToken.id;
  const ratings = await Rating.findAll({
    attributes: {
      exclude: ["id", "createdAt", "updatedAt", "userId"],
    },
    where: { userId: userId },
  });
  res.status(200).json({
    status: "success",
    ratings: ratings,
  });
});

//   const ratingValues = ratings.map((rating) => rating.dataValues);

// ratings.map(async (rating) => {
//   // console.log(rating.dataValues.movieId);
//   const findNames = await Movie.findOne({
//     where: { id: rating.dataValues.movieId },
//     attributes: {
//       exclude: ["id", "createdAt", "updatedAt"],
//     },
//   });
//   const movieName = findNames.dataValues.title;
//   rating.dataValues.movieId = movieName;
//   rating._previousDataValues.movieId = movieName;
//   console.log(1);
// });
