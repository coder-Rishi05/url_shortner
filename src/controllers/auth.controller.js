import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import validationSignUpData from "../utils/validator.js";

export const signUp = async (req, res) => {
  try {
    validationSignUpData(req);
    const { firstname, email, password } = req.body;

    if (!firstname || !email || !password) {
      throw new Error("All feilds are mandatory");
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
    res.status(501).json({ message: "server error", error: error.message });
  }
};
