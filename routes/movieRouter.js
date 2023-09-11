const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const ratingController = require("../controllers/ratingController");
const movieController = require("../controllers/movieController");
const router = express.Router();

router.post(
  "/addMovie",
  authController.protect,
  authController.restrictTo("admin"),
  movieController.addMovie
);

module.exports = router;
