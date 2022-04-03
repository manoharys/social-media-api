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
