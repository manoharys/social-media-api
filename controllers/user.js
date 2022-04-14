const mongoose = require("mongoose");
const User = require("../models/User");

// @route   POST api/users/register
// @desc    Register user

exports.register = async (req, res) => {
  try {
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      avatar: {
        url: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200",
        public_id: "avatar",
      },
    };

    const user = await User.findOne({ email: newUser.email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const addUser = await User.create(newUser);
    res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = await user.generateToken();

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      })
      .json({
        success: true,
        message: "User logged in successfully",
        token,
      });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST api/users/logout
// @desc Logout user

exports.logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res
      .status(200)
      .cookie("token", null, {
        httpOnly: true,
        expires: new Date(Date.now()),
      })
      .json({
        success: true,
        message: "User logged out successfully",
      });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @route POST api/users/followUnfollow
// @desc Follow or Unfollow user
// @access Private

exports.followUnfollow = async (req, res) => {
  try {
    let user = await User.findById(mongoose.Types.ObjectId(req.user.id)).exec();
    let userTofollow = await User.findById(
      mongoose.Types.ObjectId(req.params.id)
    ).exec();

    if (!user || !userTofollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userId = mongoose.Types.ObjectId(user._id);
    const userToFollowId = mongoose.Types.ObjectId(userTofollow._id);
    if (user.following.includes(userToFollowId)) {
      user.following = user.following.filter(
        (id) => id.toString() !== userToFollowId.toString()
      );
      userTofollow.followers = userTofollow.followers.filter(
        (id) => id.toString() !== userId.toString()
      );
      type = "unfollow";
    } else {
      user.following.push(userToFollowId);
      userTofollow.followers.push(userId);
      type = "follow";
    }

    await user.save();
    await userTofollow.save();

    res.status(200).json({
      success: true,
      message: `User ${type} successfully`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
