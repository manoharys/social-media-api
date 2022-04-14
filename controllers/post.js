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

// @route POST api/posts
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

// @route DELETE api/posts/:id
// @desc Delete a post
// @access Private

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: ObjectId(req.params.id) }).exec();

    // check post exists
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // check user is owner of post
    if (post.owner.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "you are not authorized to delete this post",
      });
    }

    // delete post
    await post.remove();

    // remove from owners list of posts
    const user = await User.findById(req.user.id);
    user.post;
    user.posts = user.posts.filter((id) => id.toString() !== post.id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route POST api/posts/comment/:id
// @desc Add a comment to a post
// @access Private

exports.commentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentText = req.body.text;

    if (commentText.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(401).json({
        success: false,
        message: "Post not found",
      });
    }

    const newComment = {
      text: commentText,
      user: req.user.id,
    };

    post.comments.push(newComment);

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// @route GET api/posts
// @desc Get a post
// @access Private

exports.getPostOfFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const posts = await Post.find({
      owner: { $in: user.following },
    });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
