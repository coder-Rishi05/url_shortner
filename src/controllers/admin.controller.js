import User from "../models/userModel";

export const getUsers = async (req, res) => {
  try {
    const { role } = req.user;

    if (!role === "admin") {
      return res
        .status(403)
        .json({ message: "You are not admin unauthorised access" });
    }

    const data = await User.find();

    return res.status(201).json({ message: "All the useres fethced", data });
  } catch (error) {
    console.log(error);
    return res.satus(501).json({ message: "server error ", error });
  }
};
