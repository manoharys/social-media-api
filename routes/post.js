const express = require("express");
const { createPost } = require("../controllers/post");
const router = express.Router();
const { auth } = require("../middlewares/auth");

router.route("/create").post(auth, createPost);

module.exports = router;
