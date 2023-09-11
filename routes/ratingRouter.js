const express = require("express");
const authController = require("../controllers/authController");
const ratingController = require("../controllers/ratingController");
const router = express.Router();

//Ratings:
router.post(
  "/addRating/:movieId",
  authController.protect,
  ratingController.addRating
);
router.get(
  "/showMyRatings",
  authController.protect,
  ratingController.GetMyRatings
);
module.exports = router;
