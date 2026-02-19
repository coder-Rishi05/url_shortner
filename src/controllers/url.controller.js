import URL from "../models/urlModel.js";
import validator from "validator";
import { validateCustomAlias } from "../utils/validator.js";
import User from "../models/userModel.js";

export const createUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;
    const userId = req.user.id;

    // 1️⃣ Validate original URL
    if (!originalUrl || !validator.isURL(originalUrl)) {
      return res.status(400).json({ message: "Invalid URL" });
    }
    // 2️⃣ Atomically increment credit ONLY if used < total
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: userId,
        $expr: { $lt: ["$credits.used", "$credits.total"] },
      },
      {
        $inc: { "credits.used": 1 },
      },
      { new: true },
    );

    // If no document returned → credit limit exceeded
    if (!updatedUser) {
      return res.status(403).json({
        message: "Credit limit exceeded",
      });
    }

    let shortCode;

    // 2️⃣ If custom alias provided
    if (customAlias) {
      const { isValid, alias, message } = validateCustomAlias(customAlias);

      if (!isValid) {
        return res.status(400).json({ message });
      }

      // 3️⃣ Check uniqueness
      const existingUrl = await URL.findOne({ shortCode: alias });
      if (existingUrl) {
        return res.status(409).json({
          message: "Custom alias already exists",
        });
      }

      shortCode = alias;
    } else {
      // 4️⃣ Generate random short code
      shortCode = Math.random().toString(36).substring(2, 8);
    }
    // url expire
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    // 5️⃣ Create URL document
    const url = await URL.create({
      originalUrl,
      shortCode,
      createdBy: userId,
      expiresAt: expiryDate,
    });

    // 6️⃣ Calculate remaining credits
    const remainingCredits =
      updatedUser.credits.total - updatedUser.credits.used;

    // 6️⃣ Response
    return res.status(201).json({
      message: "URL created successfully",
      shortUrl: `${req.protocol}://${req.get("host")}/api/urls/${shortCode}`,
      remainingCredits,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    // take url from the user.
    const { shortCode } = req.params;
    // const {originalUrl,clickCount } = URL;

    const url = await URL.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({ message: "Url does not exist" });
    }

    if (!url.isActive) {
      return res.status(403).json({ message: "The url is not active" });
    }

    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({ message: "The url is expired" });
    }

    url.clickCount += 1;
    url.lastClickedAt = new Date();
    await url.save();

    res.redirect(url.originalUrl);

    console.log(shortCode);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUserUrls = async (req, res) => {
  try {
    // get user id ye user mera token se aa rha hai req.user.id = jwt.id
    const userId = req.user.id;
    console.log(userId);

    // 2️⃣ Fetch URLs created by this user

    const urls = await URL.find({
      createdBy: userId,
      isActive: true,
    }).sort({ createdAt: -1 });

    // 3️⃣ Response

    return res.status(200).json({
      success: true,
      count: urls.length,
      data: urls,
    });
  } catch (error) {
    console.error("Get User URLs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch user URLs",
    });
  }
};

export const deactivateUrl = async (req, res) => {
  try {
    const { id } = req.params;

    // 2️⃣ Find URL
    const url = await URL.findById(id);

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "URL not found",
      });
    }

    // 3️⃣ Ownership check
    if (url.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to modify this URL",
      });
    }
    // 4️⃣ Deactivate URL
    url.isActive = false;
    await url.save();

    // 5️⃣ Response
    return res.status(200).json({
      success: true,
      message: "URL deactivated successfully",
    });
  } catch (error) {
    console.error("Deactivate URL Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to deactivate URL",
    });
  }
};
