import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/env.js ";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log(authHeader);

    // Authorization header check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // extract
    const token = authHeader.split(" ")[1];
    console.log(token);

    // verify

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);

    // 4️⃣ Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    console.log(req.user);

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid",
    });
  }

};


// export const auth = async(req,res)=>{
//   // hears authorization se mughe token milega
//   const authHeaders = req.headers.authorization
//   // check if authheaders present or not
//   if(!authHeaders || authHeaders.startsWith("Bearer ")){
//     return res.status(402).json({message:"unauthorised access ! Entry blocked"})
//   }

//   // agr auth hai to extract bhi kro
//   const jwtToken = authHeaders.split(" ")[1];
//   console.log(jwtToken);

//   // now verify the correct or not

//   const decoded = jwt.verify(jwtToken,JWT_SECRET)
//   console.log(decoded)

//   // if decoded now add data to the jwt token

//     req.user = {
//       id:decoded._id,
//       role:decoded.role
//     }


// }