import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  validationSignUpData,
  validationLoginData,
} from "../utils/validator.js";
import { JWT_SECRET } from "../utils/env.js";

export const signUp = async (req, res) => {
  try {
    validationSignUpData(req);
    const { firstname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "user created sucessfully",
      data: {
        firstname: user.firstname,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    validationLoginData(req);
    const { email, password } = req.body;

    const existUser = await User.findOne({ email }).select("+password");

    if (!existUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // comparing password

    const validUser = await bcrypt.compare(password, existUser.password);

    if (!validUser) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // assign jwt

    const token = jwt.sign(
      { id: existUser._id, role: existUser.role },
      JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      // secure: true, // prod
      sameSite: "strict",
    });

    res.status(200).json({ messgae: "user login sucessfully", token: token });
  } catch (error) {
    console.log("server error", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("server error", error);
    res.status(500).json({ message: "server error", error });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    res.status(200).json({
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      credits: user.credits,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
