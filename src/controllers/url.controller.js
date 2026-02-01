import URL from "../models/urlModel.js";
import validator from "validator";

export const createUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // 1. validate input
    if (!originalUrl || !validator.isURL(originalUrl)) {
      return res.status(400).json({ message: "Invalid URL" });
    }

    // 2. generate short code (placeholder logic)
    const shortCode = Math.random().toString(36).substring(2, 8);

    // 3. create url document
    const url = await URL.create({
      originalUrl,
      shortCode,
      createdBy: req.user.id,
    });

    // 4. response
    return res.status(201).json({
      message: "URL created successfully",
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const redirectUrl = async (req, res) => {
  try {
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
    // get user id
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
