const express = require("express");
const { createPost, likeAndUnlike } = require("../controllers/post");
const router = express.Router();
const { auth } = require("../middlewares/auth");

router.route("/create").post(auth, createPost);

router.route("/likepost/:id").post(auth, likeAndUnlike);

module.exports = router;
