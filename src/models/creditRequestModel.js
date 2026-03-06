import mongoose from "mongoose";

const creditRequestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reqStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    creditRequested: {
      type: Number,
      default: 10,
      required: true,
    },
  },
  { timestamps: true },
);

const CreditRequest = mongoose.model("creditRequest", creditRequestSchema);

export default CreditRequest;
