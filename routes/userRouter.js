const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const ratingController = require("../controllers/ratingController");
const movieController = require("../controllers/movieController");
const router = express.Router();

//What an ADMIN USER can do:
router.get(
  "/getAllUsers",
  authController.protect,
  authController.restrictTo("admin"),
  userController.getAllUsers
);

//What a REGULAR USER can do:
router.post("/signUp", userController.signUp);
router.get("/login", userController.login);
router.post("/sendEmail", userController.sendEmail);
router.delete(
  "/deleteUser/:id",
  authController.protect,
  userController.deleteUser
);
router.get("/:id", authController.protect, userController.getUser);
router.patch(
  "/updateUser/:id",
  authController.protect,
  userController.updateUser
);

module.exports = router;
