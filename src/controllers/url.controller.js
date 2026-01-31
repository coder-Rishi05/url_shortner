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
