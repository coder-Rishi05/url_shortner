import Razorpay from "razorpay";
import dotenv from "dotenv";
import {TEST_API_KEY,TEST_KEY_SECRET} from "../utils/env.js"

dotenv.config();

// creating instance of razor pay

const razorpay = new Razorpay({
  key_id: TEST_API_KEY,
  key_secret: TEST_KEY_SECRET,
});

export default razorpay;
