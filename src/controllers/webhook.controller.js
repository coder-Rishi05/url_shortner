import crypto from "crypto";
import Payment from "../models/payment.model.js";
import User from "../models/user.model.js";
import { CREDIT_AMOUNT } from "../configs/payment.config.js";

export const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.body.event;

    if (event === "payment.captured") {
      const paymentEntity = req.body.payload.payment.entity;

      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      const payment = await Payment.findOne({
        razorpayOrderId,
      });

      if (!payment || payment.status === "success") {
        return res.status(200).json({ message: "Already processed" });
      }

      // Update payment
      payment.status = "success";
      payment.razorpayPaymentId = razorpayPaymentId;
      await payment.save();

      // Add credits
      await User.findByIdAndUpdate(payment.user, {
        $inc: { credits: CREDIT_AMOUNT },
      });
    }

    res.status(200).json({ received: true });
  } catch (error) {
    res.status(500).json({ message: "Webhook error", error: error.message });
  }
};
