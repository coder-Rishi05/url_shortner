import URL from "../models/urlModel.js";
import User from "../models/userModel.js";
import { validateCredits } from "../utils/validator.js";

/**
 * GET all users
 * GET /api/admin/users
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      message: "All users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Activate / Deactivate user
 * PATCH /api/admin/users/:id/status
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = isActive;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Change user role
 * PATCH /api/admin/users/:id/role
 */
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User role updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Admin stats
 * GET /api/admin/stats
 */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const inactiveUsers = await User.countDocuments({ isActive: false });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// get all urls

export const getAllUrls = async (req, res) => {
  try {
    const urls = await URL.find();
    if (!urls) {
      return res.status(404).json({ message: "No urls created yet" });
    }

    return res.status(200).json({ message: "fetched all urls", urls: urls });
  } catch (error) {
    console.log(error);
    return res.staus(500).json({ message: "Server error" });
  }
};

export const deleteUrls = async (req, res) => {
  try {
    const { id } = req.params;

    const url = await URL.findById(id);
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Sirf deactivated URLs hi delete ho sakti hain
    if (url.isActive) {
      return res.status(403).json({ message: "Active URL cannot be deleted" });
    }

    const deletedUrl = await URL.findByIdAndDelete(id);

    return res.status(200).json({
      message: "URL deleted successfully",
      deletedUrl,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUserCredits = async (req, res) => {
  try {
    const { id } = req.params;
    const { credits } = req.body;

    const { isValid, message } = validateCredits(credits);
    if (!isValid) {
      return res.status(400).json({ success: false, message });
    }
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.credits.total += credits;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `credits credits added successfully`,
      data: {
        userId: user._id,
        newCreditBalance: user.credits.total, // Frontend ko updated balance batao
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getCreditRequest = async (req, res) => {};
