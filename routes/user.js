const express = require("express");
const {
  register,
  login,
  followUnfollow,
  logoutUser,
} = require("../controllers/user");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(register);

router.route("/login").post(login);

router.route("/logout").get(auth, logoutUser);

router.route("/follow/:id").post(auth, followUnfollow);

module.exports = router;
