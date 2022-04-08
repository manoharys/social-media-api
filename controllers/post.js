const Post = require("../models/Post");
const User = require("../models/User");

// @route POST api/posts
// @desc Create a post
// @access Private

exports.createPost = async (req, res) => {
  try {
    const newPost = {
      caption: req.body.caption,
      image: {
        public_id: "req.body.public_id",
        url: "req.body.url",
      },
      owner: req.user.id,
    };

    const post = await Post.create(newPost);

    // update users posts
    const user = await User.findById(req.user.id);
    user.posts.push(post.id);
    await user.save();

    res.status(201).json({
      message: "Post created successfully",
      success: true,
      post,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
