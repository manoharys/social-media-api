const Post = require("../models/Post");
const User = require("../models/User");
const ObjectId = require("mongodb").ObjectId;

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

// @route GET api/posts
// @desc likeAndUnlike a post
// @access private

exports.likeAndUnlike = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: ObjectId(req.params.id) }).exec();

    // check post exists
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const userId = req.user._id.toString();
    let type;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      type = "unlike";
    } else {
      post.likes.push(userId);
      type = "like";
    }
    await post.save();

    res.status(200).json({
      message: `${type} post successfully`,
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
