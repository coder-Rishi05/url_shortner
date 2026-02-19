import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1, // amount should never be 0 or negative
    },

    creditsAdded: {
      type: Number,
      default: 20,
      min: 1,
    },

    razorpayOrderId: {
      type: String,
      required: true,
      unique: true, // prevents duplicate order storage
      index: true,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const Payment = new mongoose.model("Payment", paymentSchema);

export default Payment;
