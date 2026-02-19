import razorpay from "../configs/razorpay.js";
import Payment from "../models/paymentModel.js";
import { CREDIT_PRICE, CREDIT_AMOUNT } from "../configs/payment.config.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: CREDIT_PRICE, // 500 = ₹5
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Store payment in DB
    await Payment.create({
      user: userId,
      amount: CREDIT_PRICE,
      creditsAdded: CREDIT_AMOUNT,
      razorpayOrderId: order.id,
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: CREDIT_PRICE,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};
