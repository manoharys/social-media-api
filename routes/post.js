const express = require("express");
const {
  createPost,
  likeAndUnlike,
  deletePost,
  commentPost,
} = require("../controllers/post");
const router = express.Router();
const { auth } = require("../middlewares/auth");

router.route("/create").post(auth, createPost);

router.route("/likepost/:id").post(auth, likeAndUnlike);

router.route("/comment/:id").post(auth, commentPost);

router.route("/delete/:id").delete(auth, deletePost);

module.exports = router;
